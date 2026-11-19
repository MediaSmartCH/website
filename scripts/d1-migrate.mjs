// Applies the migrations/*.sql files to the Cloudflare D1 database, and —
// the point of the exercise — records which ones have been applied.
//
// Before this script the .sql files said what *should* be applied and nothing
// said what *had* been. Answering "is 0002 live?" meant reading production
// logs for the error it causes when it is missing, or querying sqlite_master
// by hand. `schema_migrations` makes the question answer itself.
//
//   node scripts/d1-migrate.mjs                      # status, read-only
//   node scripts/d1-migrate.mjs --apply --dry-run    # what would run
//   node scripts/d1-migrate.mjs --apply              # run what is pending
//   node scripts/d1-migrate.mjs --baseline <id>      # see below
//
// Status is the default because this points at the production database: a bare
// invocation reads and never writes.
import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = join(root, "migrations");

// Anchored so the id can be interpolated into SQL as a literal: no quotes, no
// semicolons, no comment markers can reach the statement.
const MIGRATION_FILENAME = /^\d{4}_[a-z0-9_]+\.sql$/;

const D1_TIMEOUT_MS = 30_000;

const args = process.argv.slice(2);
const isApply = args.includes("--apply");
const isDryRun = args.includes("--dry-run");

/** Reads `--flag value`, returning null when the flag is absent. */
function readFlagValue(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} needs a migration id, e.g. ${flag} 0002_add_security_counters`);
  }
  return value;
}

/**
 * Loads .env.local when it exists.
 *
 * Absent is not an error: in CI the three Cloudflare variables come from the
 * environment itself. Only their absence afterwards is fatal.
 */
function loadLocalEnv() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

function readCredentials() {
  const names = [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_D1_DATABASE_ID",
  ];
  const missing = names.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing ${missing.join(", ")}. Set them in .env.local or in the environment. ` +
        "They are the same values the deployed API uses (see api/_shared/d1.ts)."
    );
  }

  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
  };
}

/**
 * Sends one request to D1's HTTP query API.
 *
 * `sql` may carry several statements separated by semicolons; D1 runs them as
 * a batch. The migration text is passed through untouched rather than split on
 * semicolons here, so a semicolon inside a comment or a string literal cannot
 * cut a statement in half.
 */
async function d1Query(sql) {
  const { accountId, apiToken, databaseId } = readCredentials();
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), D1_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
      signal: abort.signal,
    });
  } catch (error) {
    if (abort.signal.aborted) {
      throw new Error(`D1 request timed out after ${D1_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`D1 HTTP ${response.status}: ${body.slice(0, 500)}`);
  }

  const envelope = await response.json();
  if (!envelope.success) {
    const message = envelope.errors?.map((e) => e.message).join("; ") ?? "unknown";
    throw new Error(`D1 query failed: ${message}`);
  }

  return envelope.result;
}

/** Every migration on disk, in filename order, with the checksum of its text. */
function listMigrations() {
  const names = readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  const rejected = names.filter((name) => !MIGRATION_FILENAME.test(name));
  if (rejected.length > 0) {
    throw new Error(
      `Migration filenames must look like 0003_short_description.sql — rejected: ${rejected.join(", ")}`
    );
  }

  return names.map((name) => {
    const sql = readFileSync(join(migrationsDir, name), "utf8");
    return {
      id: name.replace(/\.sql$/, ""),
      sql,
      checksum: createHash("sha256").update(sql).digest("hex"),
    };
  });
}

/**
 * Creates the tracking table if it is not there yet.
 *
 * This table is owned by the migration runner rather than by a 0000_*.sql
 * file: a migration that creates the table recording migrations could not be
 * recorded before it had run.
 */
async function ensureTrackingTable() {
  await d1Query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         TEXT    PRIMARY KEY,
      applied_at INTEGER NOT NULL,
      checksum   TEXT    NOT NULL
    );
  `);
}

/** Map of migration id -> the row recording it. */
async function fetchApplied() {
  const [block] = await d1Query(
    "SELECT id, applied_at, checksum FROM schema_migrations ORDER BY id;"
  );
  return new Map((block?.results ?? []).map((row) => [row.id, row]));
}

/** SQL recording one migration. Values are constrained to hex and the
 *  filename charset, so they are safe as literals. */
function recordStatement(migration, appliedAt) {
  return `INSERT OR IGNORE INTO schema_migrations (id, applied_at, checksum)
          VALUES ('${migration.id}', ${appliedAt}, '${migration.checksum}');`;
}

/**
 * Runs one migration and records it in the same request.
 *
 * The INSERT rides along as the last statement so a migration whose own
 * statements fail is never recorded: the call returns an error and the row is
 * never written, leaving the migration pending rather than silently "done".
 */
async function applyMigration(migration) {
  const appliedAt = Math.floor(Date.now() / 1000);
  await d1Query(`${migration.sql}\n${recordStatement(migration, appliedAt)}`);
}

function formatRow(id, state, detail = "") {
  return `  ${state.padEnd(10)} ${id}${detail ? `  ${detail}` : ""}`;
}

function describe(migration, applied) {
  const row = applied.get(migration.id);
  if (!row) return { state: "pending", detail: "" };
  if (row.checksum !== migration.checksum) {
    return {
      state: "CHANGED",
      detail: "file edited since it was applied — the database does not match it",
    };
  }
  return {
    state: "applied",
    detail: new Date(row.applied_at * 1000).toISOString().slice(0, 10),
  };
}

function reportStatus(migrations, applied) {
  console.log("\nmigrations/ as recorded in the D1 database\n");

  for (const migration of migrations) {
    const { state, detail } = describe(migration, applied);
    console.log(formatRow(migration.id, state, detail));
  }

  const orphans = [...applied.keys()].filter(
    (id) => !migrations.some((migration) => migration.id === id)
  );
  for (const id of orphans) {
    console.log(formatRow(id, "orphan", "recorded in the database, no file on disk"));
  }

  return { orphans };
}

/**
 * Records migrations as applied WITHOUT running them.
 *
 * Needed once, to adopt this tracking on a database whose schema is already
 * up to date. Re-running the existing migrations instead is not an option:
 * 0001 contains `ALTER TABLE ... ADD COLUMN`, which fails on a second pass.
 */
async function runBaseline(migrations, applied, through) {
  const index = migrations.findIndex((migration) => migration.id === through);
  if (index === -1) {
    throw new Error(
      `No migration called ${through}. Known: ${migrations.map((m) => m.id).join(", ")}`
    );
  }

  const target = migrations.slice(0, index + 1).filter((m) => !applied.has(m.id));
  if (target.length === 0) {
    console.log("\nNothing to baseline: all of them are already recorded.\n");
    return;
  }

  console.log(
    `\nRecording ${target.length} migration(s) as applied, WITHOUT running them:\n`
  );
  for (const migration of target) console.log(formatRow(migration.id, "baseline"));

  if (isDryRun) {
    console.log("\n--dry-run: nothing was written.\n");
    return;
  }

  const appliedAt = Math.floor(Date.now() / 1000);
  await d1Query(target.map((m) => recordStatement(m, appliedAt)).join("\n"));
  console.log("\nDone. Run without arguments to check the result.\n");
}

async function runApply(migrations, applied) {
  const pending = migrations.filter((migration) => !applied.has(migration.id));

  if (pending.length === 0) {
    console.log("\nNothing pending.\n");
    return;
  }

  console.log(`\n${pending.length} migration(s) to apply:\n`);
  for (const migration of pending) console.log(formatRow(migration.id, "pending"));

  if (isDryRun) {
    console.log("\n--dry-run: nothing was written.\n");
    return;
  }

  console.log("");
  for (const migration of pending) {
    process.stdout.write(`  applying ${migration.id} ... `);
    await applyMigration(migration);
    console.log("ok");
  }
  console.log("\nDone.\n");
}

async function main() {
  const baselineThrough = readFlagValue("--baseline");
  loadLocalEnv();

  const migrations = listMigrations();
  await ensureTrackingTable();
  const applied = await fetchApplied();

  if (baselineThrough) return runBaseline(migrations, applied, baselineThrough);
  if (isApply) return runApply(migrations, applied);

  const { orphans } = reportStatus(migrations, applied);
  const drifted = migrations.filter(
    (migration) => describe(migration, applied).state === "CHANGED"
  );

  console.log("");
  // A changed file or an orphan row means the record and the database have
  // parted ways, which is exactly what this table exists to catch. Exiting
  // non-zero lets CI fail on it.
  if (drifted.length > 0 || orphans.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
