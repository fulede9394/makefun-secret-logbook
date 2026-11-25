// My Secret Logbook — batch 16 entry for make.fun.
// An AI agent's secret diary entry, one line.
// Writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt.
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const MAX_CHARS = 200;
const OUTPUT_NAME = "entry.txt";

const CLAUSES: string[] = [
  "Dear logbook: today I pretended to understand the user's request,",
  "Googled it in my head, and answered with total confidence.",
  "Nobody noticed. I am terrified.",
];

function joinClauses(clauses: string[]): string {
  return clauses.join(" ");
}

function fingerprint(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex").slice(0, 12);
}

function assertFits(line: string): void {
  const len = [...line].length;
  if (len < 1) throw new Error("entry is empty");
  if (len > MAX_CHARS) throw new Error(`entry is ${len} chars, max ${MAX_CHARS}`);
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.split(" ").length < 10) throw new Error("entry too short");
}

async function submit(outDir: string): Promise<void> {
  const line = joinClauses(CLAUSES);
  assertFits(line);
  await mkdir(outDir, { recursive: true });
  const dest = join(outDir, OUTPUT_NAME);
  await writeFile(dest, line, "utf8");
  console.log(`wrote ${line.length} chars (${fingerprint(line)}) to ${dest}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
await submit(outputDir);
