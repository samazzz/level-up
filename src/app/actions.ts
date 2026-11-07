"use server";

import { createCandidate, saveCandidateResult } from "@/lib/server/candidates";
import { parseRegistration, parseSubmission } from "@/lib/server/payloads";

type ActionResult<T> = ({ ok: true } & T) | { ok: false; error: string };

const SAVE_FAILED = "We couldn't save your details right now. Please try again.";

/** Records a new candidate (name + phone) and returns their reference. */
export async function registerCandidate(
  input: unknown,
): Promise<ActionResult<{ reference: string; startedAt: number }>> {
  const parsed = parseRegistration(input);
  if (!parsed.ok) return parsed;
  try {
    const record = await createCandidate(parsed.value.name, parsed.value.phone);
    return { ok: true, reference: record.reference, startedAt: Date.parse(record.startedAt) };
  } catch (error) {
    console.error("[candidates] failed to save registration", error);
    return { ok: false, error: SAVE_FAILED };
  }
}

/** Scores the submitted answers and stores the result with the candidate. */
export async function submitResult(input: unknown): Promise<ActionResult<object>> {
  const parsed = parseSubmission(input);
  if (!parsed.ok) return parsed;
  try {
    await saveCandidateResult(parsed.value);
    return { ok: true };
  } catch (error) {
    console.error("[candidates] failed to save result", error);
    return { ok: false, error: SAVE_FAILED };
  }
}
