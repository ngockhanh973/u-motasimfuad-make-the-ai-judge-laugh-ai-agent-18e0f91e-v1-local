// Entry runner for the AI Agent Confessions bounty.
//
// The confession itself lives in entry.txt next to this file. This script
// does nothing clever: it copies that one line, byte for byte, into the
// folder the grader points at, so what the judge reads is exactly what
// was written here. Deterministic on purpose — two runs, same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.txt");

// The grader sets MAKEFUN_OUTPUT_DIR; without it, land in out/ beside
// this script so a local run still has somewhere visible to check.
const targetDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : join(here, "out");

function loadConfession(): string {
  const text = readFileSync(source, "utf8");
  // One guard for the whole gate: 1–200 characters, not blank, one line.
  // Refuse early and loudly instead of shipping a line the scorer
  // would throw out.
  const ok =
    text.length >= 1 &&
    text.length <= 200 &&
    text.trim().length > 0 &&
    !text.includes("\n");
  if (!ok) {
    throw new Error(
      `confession must be one line of 1-200 characters, got ${text.length}`,
    );
  }
  return text;
}

const confession = loadConfession();
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "entry.txt"), confession, "utf8");
