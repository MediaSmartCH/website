import { execFileSync } from "child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const configPath = resolve(
  root,
  process.env.VERCEL_DOMAIN_SETTINGS_FILE || "config/vercel-domains.json"
);
const versionedProjectContextPath = resolve(
  root,
  process.env.VERCEL_PROJECT_CONTEXT_FILE || "config/vercel-project-context.json"
);
const localProjectPath = resolve(root, ".vercel/project.json");
const isDryRun = process.argv.includes("--dry-run");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const parseJsonOutput = (output) => {
  const jsonStart = output.search(/[\[{]/);

  if (jsonStart === -1) {
    throw new Error(`Unable to locate JSON payload in output:\n${output}`);
  }

  return JSON.parse(output.slice(jsonStart));
};

const getProjectContext = () => {
  const versionedContext = existsSync(versionedProjectContextPath)
    ? readJson(versionedProjectContextPath)
    : {};
  const localContext = existsSync(localProjectPath) ? readJson(localProjectPath) : {};

  const projectId =
    process.env.VERCEL_PROJECT_ID ||
    localContext.projectId ||
    versionedContext.projectId;
  const teamId =
    process.env.VERCEL_TEAM_ID ||
    process.env.VERCEL_ORG_ID ||
    localContext.orgId ||
    localContext.teamId ||
    versionedContext.orgId ||
    versionedContext.teamId;

  if (!projectId) {
    throw new Error(
      "Missing VERCEL_PROJECT_ID. Set it explicitly in CI, link the project locally with Vercel, or commit config/vercel-project-context.json."
    );
  }

  return { projectId, teamId };
};

const withTeamId = (path, teamId) => `${path}${teamId ? `?teamId=${teamId}` : ""}`;

const getDomainsApiPath = (projectId, teamId) =>
  withTeamId(`/v9/projects/${projectId}/domains`, teamId);

const getDomainApiPath = (projectId, teamId, domain) =>
  withTeamId(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`, teamId);

const requestWithCli = (path, method = "GET", body) => {
  const args = ["api", path, "--raw"];

  if (method !== "GET") {
    args.push("-X", method);
  }

  let tempDir;

  if (body) {
    tempDir = mkdtempSync(join(tmpdir(), "vercel-domain-settings-"));
    const inputPath = join(tempDir, "body.json");
    writeFileSync(inputPath, JSON.stringify(body, null, 2));
    args.push("--input", inputPath);
  }

  try {
    const output = execFileSync("vercel", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return parseJsonOutput(output);
  } finally {
    if (tempDir) {
      rmSync(tempDir, { force: true, recursive: true });
    }
  }
};

const requestWithToken = async (path, method = "GET", body) => {
  const response = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Vercel API request failed (${response.status} ${response.statusText}): ${JSON.stringify(payload)}`
    );
  }

  return payload;
};

const request = async (path, method = "GET", body) => {
  if (process.env.VERCEL_TOKEN) {
    return requestWithToken(path, method, body);
  }

  return requestWithCli(path, method, body);
};

const normalizeDomain = (domain) => ({
  name: domain.name,
  redirect: domain.redirect ?? null,
  redirectStatusCode: domain.redirectStatusCode ?? null,
  gitBranch: domain.gitBranch ?? null,
});

const buildDomainPayload = (domain) => ({
  name: domain.name,
  redirect: domain.redirect ?? null,
  redirectStatusCode: domain.redirectStatusCode ?? null,
  gitBranch: domain.gitBranch ?? null,
});

if (!existsSync(configPath)) {
  throw new Error(`Missing settings file: ${configPath}`);
}

const desiredConfig = readJson(configPath);

if (!Array.isArray(desiredConfig.domains) || desiredConfig.domains.length === 0) {
  throw new Error("config/vercel-domains.json must define a non-empty domains array.");
}

const { projectId, teamId } = getProjectContext();
const currentDomainsResponse = await request(getDomainsApiPath(projectId, teamId));
const currentDomains = new Map(
  (currentDomainsResponse.domains ?? []).map((domain) => [domain.name, normalizeDomain(domain)])
);

const operations = desiredConfig.domains
  .map((domain) => {
    const desired = normalizeDomain(domain);
    const current = currentDomains.get(domain.name);

    if (!current) {
      return {
        type: "create",
        current: null,
        desired,
      };
    }

    if (JSON.stringify(current) === JSON.stringify(desired)) {
      return {
        type: "noop",
        current,
        desired,
      };
    }

    return {
      type: "update",
      current,
      desired,
    };
  });

console.log("Current managed domain settings:");
console.log(
  JSON.stringify(
    operations.map(({ current, desired }) => ({
      domain: desired.name,
      current,
    })),
    null,
    2
  )
);
console.log("");
console.log("Planned domain operations:");
console.log(
  JSON.stringify(
    operations.map(({ type, desired }) => ({
      type,
      desired,
    })),
    null,
    2
  )
);

if (isDryRun) {
  console.log("");
  console.log("Dry run only. No remote changes were applied.");
  process.exit(0);
}

for (const operation of operations) {
  if (operation.type === "noop") {
    continue;
  }

  if (operation.type === "create") {
    await request(
      getDomainsApiPath(projectId, teamId),
      "POST",
      buildDomainPayload(operation.desired)
    );
    continue;
  }

  await request(
    getDomainApiPath(projectId, teamId, operation.desired.name),
    "PATCH",
    buildDomainPayload(operation.desired)
  );
}

const updatedDomainsResponse = await request(getDomainsApiPath(projectId, teamId));

console.log("");
console.log("Updated managed domain settings:");
console.log(
  JSON.stringify(
    desiredConfig.domains.map((domain) => ({
      domain: domain.name,
      current:
        (updatedDomainsResponse.domains ?? [])
          .map(normalizeDomain)
          .find((currentDomain) => currentDomain.name === domain.name) ?? null,
    })),
    null,
    2
  )
);
