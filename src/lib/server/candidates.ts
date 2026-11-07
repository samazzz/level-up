import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CefrLevel } from "../levels";

/**
 * Candidate records are kept in a JSON file inside the project
 * (data/candidates.json by default, gitignored because it holds personal data).
 * Set CANDIDATES_FILE to store them somewhere else.
 */

export type CandidateResult = {
  level: CefrLevel;
  levelName: string;
  correct: number;
  total: number;
  percent: number;
  /** Section title -> "correct/total". */
  sections: Record<string, string>;
};

export type CandidateRecord = {
  reference: string;
  name: string;
  phone: string;
  startedAt: string;
  completedAt: string | null;
  result: CandidateResult | null;
};

export const REFERENCE_PATTERN = /^LU-\d{6}-[A-Z2-9]{4}$/;

export function candidatesFilePath(): string {
  return process.env.CANDIDATES_FILE || path.join(process.cwd(), "data", "candidates.json");
}

// All reads and writes go through one queue so concurrent requests
// never overwrite each other's changes.
let queue: Promise<unknown> = Promise.resolve();

function serialized<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(file: string): Promise<CandidateRecord[]> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  if (raw.trim() === "") return [];
  // A file that can't be parsed is an error, never treated as empty:
  // writing back an empty list would silently delete every saved record.
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error(`${file} must contain a JSON array`);
  return data as CandidateRecord[];
}

async function writeAll(file: string, records: CandidateRecord[]): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await rename(temp, file);
}

function createReference(now: Date): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(randomBytes(4), (b) => alphabet[b % alphabet.length]).join("");
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `LU-${yy}${mm}${dd}-${suffix}`;
}

/** Saves a new candidate when they start the assessment. */
export function createCandidate(name: string, phone: string): Promise<CandidateRecord> {
  return serialized(async () => {
    const file = candidatesFilePath();
    const records = await readAll(file);
    const taken = new Set(records.map((r) => r.reference));
    const now = new Date();
    let reference = createReference(now);
    while (taken.has(reference)) reference = createReference(now);

    const record: CandidateRecord = {
      reference,
      name,
      phone,
      startedAt: now.toISOString(),
      completedAt: null,
      result: null,
    };
    records.push(record);
    await writeAll(file, records);
    return record;
  });
}

/**
 * Stores the final result. If the record is missing (for example the file
 * was reset during the test), it is recreated so the candidate is never lost.
 * Submitting again for a completed record changes nothing.
 */
export function saveCandidateResult(input: {
  reference: string;
  name: string;
  phone: string;
  startedAt: string;
  result: CandidateResult;
}): Promise<CandidateRecord> {
  return serialized(async () => {
    const file = candidatesFilePath();
    const records = await readAll(file);
    let record = records.find((r) => r.reference === input.reference);
    if (record?.completedAt) return record;

    if (!record) {
      record = {
        reference: input.reference,
        name: input.name,
        phone: input.phone,
        startedAt: input.startedAt,
        completedAt: null,
        result: null,
      };
      records.push(record);
    }
    record.completedAt = new Date().toISOString();
    record.result = input.result;
    await writeAll(file, records);
    return record;
  });
}
