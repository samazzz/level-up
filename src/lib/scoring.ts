import { CEFR_LEVELS, type CefrLevel } from "./levels";
import { sectionsForAttempt } from "./questions";

/** Share of questions at a level that must be correct to pass that level. */
export const PASS_THRESHOLD = 0.6;

export type Answers = Record<string, number>;

export type LevelScore = {
  level: CefrLevel;
  correct: number;
  total: number;
  passed: boolean;
};

export type SectionScore = {
  id: string;
  title: string;
  correct: number;
  total: number;
};

export type AssessmentResult = {
  level: CefrLevel;
  /** True when not even the A1 questions reached the pass threshold. */
  belowA1: boolean;
  correct: number;
  total: number;
  percent: number;
  byLevel: LevelScore[];
  bySection: SectionScore[];
};

/**
 * The reported level is the highest CEFR level reached without a gap:
 * the candidate must pass each level from A1 upwards. This stops lucky
 * guesses on hard questions from inflating the result.
 */
export function scoreAssessment(questionIds: string[], answers: Answers): AssessmentResult {
  const levelTotals = new Map<CefrLevel, { correct: number; total: number }>(
    CEFR_LEVELS.map((level) => [level, { correct: 0, total: 0 }]),
  );

  const bySection: SectionScore[] = sectionsForAttempt(questionIds).map((section) => {
    let correct = 0;
    for (const question of section.questions) {
      const isCorrect = answers[question.id] === question.answer;
      const bucket = levelTotals.get(question.level)!;
      bucket.total += 1;
      if (isCorrect) {
        bucket.correct += 1;
        correct += 1;
      }
    }
    return {
      id: section.id,
      title: section.title,
      correct,
      total: section.questions.length,
    };
  });

  const byLevel: LevelScore[] = CEFR_LEVELS.map((level) => {
    const { correct, total } = levelTotals.get(level)!;
    return {
      level,
      correct,
      total,
      passed: total > 0 && correct / total >= PASS_THRESHOLD,
    };
  });

  let reached: CefrLevel | null = null;
  for (const score of byLevel) {
    if (!score.passed) break;
    reached = score.level;
  }

  const correct = bySection.reduce((sum, s) => sum + s.correct, 0);
  const total = bySection.reduce((sum, s) => sum + s.total, 0);

  return {
    level: reached ?? "A1",
    belowA1: reached === null,
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    byLevel,
    bySection,
  };
}
