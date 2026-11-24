// v2 runner: carries the one-line confession from entry.txt to the
// grader's output folder, byte for byte. The line itself is the whole
// entry, so this file stays deliberately boring — read, check, copy.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "entry.txt");

function fail(message: string): never {
  throw new Error(`entry.txt rejected: ${message}`);
}

const line = readFileSync(sourcePath, "utf8");

// Mirror the sealed gate here so a bad line fails loudly in dev instead
// of scoring a silent zero: exactly one line, 1-200 chars, not blank.
if (line.length === 0) fail("empty file");
if (line.length > 200) fail(`too long (${line.length} chars, max 200)`);
if (line.trim().length === 0) fail("only whitespace");
if (line.includes("\n") || line.includes("\r")) {
  fail("must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : join(scriptDir, "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
console.log(`wrote ${line.length}-char confession to ${join(outDir, "entry.txt")}`);
