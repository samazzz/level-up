import { useSyncExternalStore } from "react";
import { QUESTIONS_PER_TEST, SECTIONS, drawQuestionIds, isBankQuestion } from "./questions";
import { normalizeName, normalizePhone } from "./validation";

/**
 * Client-side store for the candidate's assessment session.
 *
 * State lives in memory and is mirrored to sessionStorage so a page refresh
 * does not lose progress. If storage is unavailable (private mode, blocked
 * site data) the app keeps working from memory for the current visit.
 */

const STORAGE_KEY = "levelup:assessment:v3";

export type AssessmentSession = {
  /** Human-readable reference shown on the report, e.g. LU-261104-7KQ2. */
  reference: string;
  name: string;
  phone: string;
  startedAt: number;
  completedAt: number | null;
  currentStep: number;
  /** The questions drawn from the bank for this attempt, in display order. */
  questionIds: string[];
  /** Question id -> chosen option index. */
  answers: Record<string, number>;
};

type Snapshot = AssessmentSession | null;

let state: Snapshot | undefined;
const listeners = new Set<() => void>();

function isSession(value: unknown): value is AssessmentSession {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.reference === "string" &&
    typeof v.name === "string" &&
    v.name.trim().length > 0 &&
    typeof v.phone === "string" &&
    typeof v.startedAt === "number" &&
    (v.completedAt === null || typeof v.completedAt === "number") &&
    Number.isInteger(v.currentStep) &&
    (v.currentStep as number) >= 0 &&
    (v.currentStep as number) < SECTIONS.length &&
    Array.isArray(v.questionIds) &&
    v.questionIds.length === QUESTIONS_PER_TEST &&
    v.questionIds.every((id) => typeof id === "string" && isBankQuestion(id)) &&
    typeof v.answers === "object" &&
    v.answers !== null &&
    Object.values(v.answers).every((a) => Number.isInteger(a))
  );
}

function load(): Snapshot {
  if (state === undefined) {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      state = isSession(parsed) ? parsed : null;
    } catch {
      state = null;
    }
  }
  return state;
}

function commit(next: Snapshot) {
  state = next;
  try {
    if (next) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: the in-memory state still drives the app.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns `undefined` during server rendering and hydration (session not yet
 * known), `null` when there is no session, or the session itself.
 */
export function useAssessmentSession(): Snapshot | undefined {
  return useSyncExternalStore(subscribe, load, () => undefined);
}

/** Starts a session for a candidate the server has already registered. */
export function startAssessment(candidate: {
  reference: string;
  name: string;
  phone: string;
  startedAt: number;
}) {
  commit({
    reference: candidate.reference,
    name: normalizeName(candidate.name),
    phone: normalizePhone(candidate.phone),
    startedAt: candidate.startedAt,
    completedAt: null,
    currentStep: 0,
    questionIds: drawQuestionIds(),
    answers: {},
  });
}

export function recordAnswer(questionId: string, optionIndex: number) {
  const session = load();
  if (!session || session.completedAt !== null) return;
  if (!session.questionIds.includes(questionId)) return;
  commit({ ...session, answers: { ...session.answers, [questionId]: optionIndex } });
}

export function goToStep(step: number) {
  const session = load();
  if (!session || session.completedAt !== null) return;
  const clamped = Math.min(Math.max(step, 0), SECTIONS.length - 1);
  commit({ ...session, currentStep: clamped });
}

export function completeAssessment() {
  const session = load();
  if (!session || session.completedAt !== null) return;
  commit({ ...session, completedAt: Date.now() });
}

export function resetAssessment() {
  commit(null);
}
