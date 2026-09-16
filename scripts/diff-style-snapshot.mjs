/**
 * Compares two style snapshots and reports every rendered difference.
 *
 * Exits non-zero as soon as anything differs, so it can gate a refactoring step:
 * during an internal refactor there is no such thing as an acceptable visual
 * change, only regressions.
 *
 * Usage:
 *   node scripts/diff-style-snapshot.mjs .snapshots/before.json .snapshots/after.json
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const [beforePath, afterPath] = process.argv.slice(2);

if (!beforePath || !afterPath) {
  console.error('Usage: node scripts/diff-style-snapshot.mjs <before.json> <after.json>');
  process.exit(2);
}

const before = JSON.parse(readFileSync(resolve(beforePath), 'utf8'));
const after = JSON.parse(readFileSync(resolve(afterPath), 'utf8'));

/** Height differences below this are treated as sub-pixel rounding, not a change. */
const BOX_TOLERANCE_PX = 1;

const problems = [];
const record = (page, kind, detail) => problems.push({ page, kind, detail });

function comparePages() {
  const beforeKeys = Object.keys(before.pages);
  const afterKeys = new Set(Object.keys(after.pages));

  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) record(key, 'page-missing', 'page absent from the after snapshot');
  }
  for (const key of afterKeys) {
    if (!(key in before.pages)) record(key, 'page-added', 'page absent from the before snapshot');
  }

  return beforeKeys.filter((key) => afterKeys.has(key));
}

function compareTextStyles(page, a, b) {
  for (const [key, beforeStyle] of Object.entries(a.textStyles)) {
    const afterStyle = b.textStyles[key];

    if (!afterStyle) {
      record(page, 'text-missing', key);
      continue;
    }

    for (const property of Object.keys(beforeStyle)) {
      if (beforeStyle[property] !== afterStyle[property]) {
        record(
          page,
          'style-changed',
          `${key}\n      ${property}: ${beforeStyle[property]} → ${afterStyle[property]}`,
        );
      }
    }
  }

  for (const key of Object.keys(b.textStyles)) {
    if (!(key in a.textStyles)) record(page, 'text-added', key);
  }
}

function compareBoxes(page, a, b) {
  for (const [key, beforeBox] of Object.entries(a.boxes)) {
    const afterBox = b.boxes[key];
    if (!afterBox) continue; // already reported as text-missing

    for (const dimension of ['width', 'height']) {
      const delta = Math.abs(beforeBox[dimension] - afterBox[dimension]);
      if (delta > BOX_TOLERANCE_PX) {
        record(
          page,
          'box-changed',
          `${key}\n      ${dimension}: ${beforeBox[dimension]}px → ${afterBox[dimension]}px`,
        );
      }
    }
  }
}

function compareColors(page, a, b) {
  const keys = new Set([
    ...Object.keys(a.colorHistogram),
    ...Object.keys(b.colorHistogram),
  ]);

  for (const key of keys) {
    const beforeCount = a.colorHistogram[key] ?? 0;
    const afterCount = b.colorHistogram[key] ?? 0;

    if (beforeCount === 0) record(page, 'color-added', `${key} (×${afterCount})`);
    else if (afterCount === 0) record(page, 'color-removed', `${key} (was ×${beforeCount})`);
  }
}

for (const page of comparePages()) {
  const a = before.pages[page];
  const b = after.pages[page];

  compareTextStyles(page, a, b);
  compareBoxes(page, a, b);
  compareColors(page, a, b);
}

if (problems.length === 0) {
  console.log(`No rendered difference across ${Object.keys(before.pages).length} pages.`);
  process.exit(0);
}

const byPage = problems.reduce((acc, problem) => {
  (acc[problem.page] ??= []).push(problem);
  return acc;
}, {});

for (const [page, pageProblems] of Object.entries(byPage)) {
  console.log(`\n${page} — ${pageProblems.length} difference(s)`);
  for (const { kind, detail } of pageProblems.slice(0, 25)) {
    console.log(`  [${kind}] ${detail}`);
  }
  if (pageProblems.length > 25) {
    console.log(`  … and ${pageProblems.length - 25} more`);
  }
}

console.log(`\n${problems.length} difference(s) total.`);
process.exit(1);
