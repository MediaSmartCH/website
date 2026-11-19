/**
 * Locks the naming convention `scripts/d1-migrate.mjs` enforces.
 *
 * The runner derives a migration's identity from its filename, orders the
 * files by it, and interpolates it into SQL as a literal — so it refuses to
 * run at all when a name does not match. Without this test that refusal would
 * surface the first time someone pointed the runner at the production
 * database, which is the worst moment to discover it.
 *
 * It lives beside the runner rather than under src/test because it reads the
 * filesystem: the root tsconfig deliberately withholds the Node types from
 * src/, which is browser code.
 */

import { readFileSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { describe, expect, it } from 'vitest';

// Kept in step with MIGRATION_FILENAME in scripts/d1-migrate.mjs.
const MIGRATION_FILENAME = /^\d{4}_[a-z0-9_]+\.sql$/;

const migrationsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../migrations',
);

const migrationFiles = readdirSync(migrationsDir).filter((name) =>
  name.endsWith('.sql'),
);

describe('D1 migration files', () => {
  it('has migrations to check', () => {
    expect(migrationFiles.length).toBeGreaterThan(0);
  });

  it('names every migration the way the runner expects', () => {
    const rejected = migrationFiles.filter(
      (name) => !MIGRATION_FILENAME.test(name),
    );
    expect(rejected).toEqual([]);
  });

  it('gives every migration a body to run', () => {
    const empty = migrationFiles.filter(
      (name) => readFileSync(join(migrationsDir, name), 'utf8').trim() === '',
    );
    expect(empty).toEqual([]);
  });

  it('numbers each migration once', () => {
    const numbers = migrationFiles.map((name) => name.slice(0, 4));
    expect(numbers).toHaveLength(new Set(numbers).size);
  });

  it('orders by filename the same way it orders by number', () => {
    // The runner sorts filenames as strings and trusts that to be migration
    // order. That only holds while the numeric prefixes are zero-padded to the
    // same width, which the pattern above guarantees — this asserts the
    // consequence directly, so a later change to the pattern cannot quietly
    // break ordering.
    const byName = [...migrationFiles].sort();
    const byNumber = [...migrationFiles].sort(
      (a, b) => Number(a.slice(0, 4)) - Number(b.slice(0, 4)),
    );
    expect(byName).toEqual(byNumber);
  });
});
