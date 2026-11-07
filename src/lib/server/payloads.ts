import { LEVEL_PROFILES } from "../levels";
import { QUESTIONS_PER_TEST, isBankQuestion } from "../questions";
import { scoreAssessment } from "../scoring";
import {
  normalizeName,
  normalizePhone,
  validateName,
  validatePhone,
} from "../validation";
import { REFERENCE_PATTERN, type CandidateResult } from "./candidates";

/**
 * Server actions can be called directly with any payload, so everything
 * coming from the browser is checked here before it reaches the file.
 */

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const INVALID = "Some of the submitted details are invalid. Please refresh and try again.";

function asRecord(input: unknown): Record<string, unknown> | null {
  return typeof input === "object" && input !== null && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : null;
}

export function parseRegistration(input: unknown): Parsed<{ name: string; phone: string }> {
  const data = asRecord(input);
  if (!data || typeof data.name !== "string" || typeof data.phone !== "string") {
    return { ok: false, error: INVALID };
  }
  const error = validateName(data.name) ?? validatePhone(data.phone);
  if (error) return { ok: false, error };
  return { ok: true, value: { name: normalizeName(data.name), phone: normalizePhone(data.phone) } };
}

export type Submission = {
  reference: string;
  name: string;
  phone: string;
  startedAt: string;
  result: CandidateResult;
};

export function parseSubmission(input: unknown): Parsed<Submission> {
  const data = asRecord(input);
  if (!data) return { ok: false, error: INVALID };
  const { reference, name, phone, startedAt, questionIds, answers } = data;

  if (typeof reference !== "string" || !REFERENCE_PATTERN.test(reference)) {
    return { ok: false, error: INVALID };
  }
  if (typeof name !== "string" || validateName(name)) return { ok: false, error: INVALID };
  if (typeof phone !== "string" || validatePhone(phone)) return { ok: false, error: INVALID };
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return { ok: false, error: INVALID };
  }

  if (
    !Array.isArray(questionIds) ||
    questionIds.length !== QUESTIONS_PER_TEST ||
    new Set(questionIds).size !== questionIds.length ||
    !questionIds.every((id) => typeof id === "string" && isBankQuestion(id))
  ) {
    return { ok: false, error: INVALID };
  }

  const answerMap = asRecord(answers);
  if (!answerMap) return { ok: false, error: INVALID };
  const cleanAnswers: Record<string, number> = {};
  for (const id of questionIds as string[]) {
    const value = answerMap[id];
    if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > 3) {
      return { ok: false, error: "Please answer every question before submitting." };
    }
    cleanAnswers[id] = value as number;
  }

  // The score is always recomputed on the server from the raw answers.
  const score = scoreAssessment(questionIds as string[], cleanAnswers);
  return {
    ok: true,
    value: {
      reference,
      name: normalizeName(name),
      phone: normalizePhone(phone),
      startedAt: new Date(startedAt).toISOString(),
      result: {
        level: score.level,
        levelName: LEVEL_PROFILES[score.level].name,
        correct: score.correct,
        total: score.total,
        percent: score.percent,
        sections: Object.fromEntries(
          score.bySection.map((s) => [s.title, `${s.correct}/${s.total}`]),
        ),
      },
    },
  };
}
