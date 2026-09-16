#!/usr/bin/env node
/**
 * Removes the junk macOS (and Windows) leave behind in the working tree.
 *
 * This repo lives on a network volume, so every copy sprinkles AppleDouble
 * sidecars (`._something`) next to the real files, plus the usual `.DS_Store`
 * per visited folder. They are already gitignored, but they are not harmless:
 * a few hundred of them slow down every recursive scan — Vite's watcher, the
 * test globs, `find`, editor indexing — and `._router.tsx` sitting next to
 * `router.tsx` is a constant source of confusion when reading a file listing.
 *
 * Deliberately conservative: it only ever removes entries whose *name* matches
 * one of the patterns below, and it never descends into node_modules, .git or
 * build output. Run `node scripts/clean-workspace.mjs --dry-run` to see what
 * would go without touching anything.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Directories we never walk into: either not ours, or regenerated anyway.
const SKIPPED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vercel",
  ".next",
]);

/** Junk files, matched on the file name alone. */
const isJunkFile = (name) =>
  name.startsWith("._") ||
  name === ".DS_Store" ||
  name === "Thumbs.db" ||
  name === "desktop.ini" ||
  name === "Icon\r";

/** Junk directories, matched by exact name so nothing real can be caught. */
const JUNK_DIRS = new Set([
  "__MACOSX",
  ".AppleDouble",
  ".Spotlight-V100",
  ".TemporaryItems",
  ".Trashes",
  ".fseventsd",
]);

const dryRun = process.argv.includes("--dry-run");
const verbose = process.argv.includes("--verbose");

const removed = [];
let bytesFreed = 0;

async function walk(dir) {
  let entries;

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    // A directory that disappeared mid-walk is not worth failing the run over.
    if (error.code === "ENOENT" || error.code === "EACCES") return;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (JUNK_DIRS.has(entry.name)) {
        await remove(fullPath, true);
        continue;
      }

      if (SKIPPED_DIRS.has(entry.name)) continue;

      await walk(fullPath);
      continue;
    }

    if (isJunkFile(entry.name)) {
      await remove(fullPath, false);
    }
  }
}

async function remove(fullPath, isDirectory) {
  const relativePath = path.relative(ROOT, fullPath);

  try {
    const stats = await fs.stat(fullPath);
    bytesFreed += stats.size;
  } catch {
    // Size is only used for the summary; losing it is not a failure.
  }

  removed.push(relativePath);

  if (dryRun) return;

  await fs.rm(fullPath, { force: true, recursive: isDirectory });
}

await walk(ROOT);

const label = dryRun ? "would remove" : "removed";

if (removed.length === 0) {
  console.log("clean-workspace: nothing to clean.");
} else {
  if (verbose || dryRun) {
    for (const entry of removed) console.log(`  ${entry}`);
  }

  const kilobytes = Math.round(bytesFreed / 1024);
  console.log(
    `clean-workspace: ${label} ${removed.length} file(s) (~${kilobytes} KB).` +
      (verbose || dryRun ? "" : " Pass --verbose to list them.")
  );
}
