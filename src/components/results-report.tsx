"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { resetAssessment, useAssessmentSession } from "@/lib/assessment-store";
import { CEFR_LEVELS, LEVEL_PROFILES } from "@/lib/levels";
import { sectionsForAttempt } from "@/lib/questions";
import { PASS_THRESHOLD, scoreAssessment } from "@/lib/scoring";
import {
  CheckIcon,
  ChevronDownIcon,
  CrossIcon,
  LoadingState,
  PrinterIcon,
  RestartIcon,
  buttonStyles,
} from "./ui";

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" });

const BANDS = [
  { label: "Basic user", levels: ["A1", "A2"] },
  { label: "Independent user", levels: ["B1", "B2"] },
  { label: "Proficient user", levels: ["C1", "C2"] },
];

const card = "rounded-2xl border border-line bg-surface p-6 sm:p-7 print:break-inside-avoid";

export function ResultsReport() {
  const session = useAssessmentSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) router.replace("/");
    else if (session && session.completedAt === null) router.replace("/assessment");
  }, [session, router]);

  if (!session || session.completedAt === null) {
    return <LoadingState label="Preparing your report" />;
  }

  const sections = sectionsForAttempt(session.questionIds);
  const result = scoreAssessment(session.questionIds, session.answers);
  const profile = LEVEL_PROFILES[result.level];
  const levelIndex = CEFR_LEVELS.indexOf(result.level);
  const firstName = session.name.split(" ")[0];
  const minutes = Math.max(1, Math.round((session.completedAt - session.startedAt) / 60000));
  const passMark = Math.ceil(PASS_THRESHOLD * (result.byLevel[0]?.total ?? 5));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 print:max-w-none print:py-0">
      {/* Title */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">
            Assessment report
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Well done, {firstName}.
          </h1>
          <p className="mt-2 text-ink-muted">Here is a detailed view of your English proficiency.</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button type="button" className={buttonStyles.secondary} onClick={() => window.print()}>
            <PrinterIcon />
            Print / Save PDF
          </button>
          <button type="button" className={buttonStyles.primary} onClick={resetAssessment}>
            <RestartIcon />
            Retake
          </button>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm md:grid-cols-4">
        {[
          ["Candidate", session.name],
          ["Reference", session.reference],
          ["Completed", dateFormat.format(session.completedAt)],
          ["Time taken", `${minutes} min`],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface px-5 py-4">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="mt-0.5 font-medium break-words">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Headline result */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className={`${card} flex flex-col gap-6 sm:flex-row sm:items-center`}>
          <div className="flex size-32 shrink-0 flex-col items-center justify-center rounded-3xl bg-brand text-on-brand">
            <span className="text-5xl font-semibold tracking-tight">{profile.code}</span>
            <span className="mt-1 text-xs font-medium opacity-80">CEFR level</span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-subtle">{profile.band}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{profile.summary}</p>
            {result.belowA1 && (
              <p className="mt-3 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-muted">
                Your answers suggest you are at the very start of A1. Focus on core vocabulary and
                basic sentence patterns, then take the assessment again.
              </p>
            )}
          </div>
        </div>

        <div className={`${card} flex items-center gap-6`}>
          <ScoreRing percent={result.percent} />
          <div>
            <p className="text-sm font-medium text-ink-subtle">Overall score</p>
            <p className="text-3xl font-semibold tracking-tight">{result.percent}%</p>
            <p className="mt-1 text-sm text-ink-muted">
              {result.correct} of {result.total} questions correct
            </p>
          </div>
        </div>
      </section>

      {/* CEFR scale */}
      <section className={`${card} mt-6`} aria-labelledby="scale-heading">
        <h2 id="scale-heading" className="font-semibold">
          Your position on the CEFR scale
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {BANDS.map((band) => (
            <div key={band.label}>
              <p className="mb-2 text-xs font-medium text-ink-subtle">{band.label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {band.levels.map((code) => {
                  const index = CEFR_LEVELS.indexOf(code as (typeof CEFR_LEVELS)[number]);
                  const isCurrent = index === levelIndex;
                  const isReached = index <= levelIndex && !result.belowA1;
                  return (
                    <div
                      key={code}
                      className={`rounded-lg px-2 py-3 text-center ${
                        isCurrent
                          ? "bg-brand text-on-brand ring-2 ring-brand ring-offset-2 ring-offset-surface"
                          : isReached
                            ? "bg-brand-soft text-brand"
                            : "bg-surface-muted text-ink-subtle"
                      }`}
                      aria-current={isCurrent ? "true" : undefined}
                    >
                      <span className="block text-sm font-semibold">{code}</span>
                      <span className="hidden text-[11px] sm:block">
                        {LEVEL_PROFILES[code as (typeof CEFR_LEVELS)[number]].name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Breakdown */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="font-semibold">Performance by skill</h2>
          <ul className="mt-5 space-y-4">
            {result.bySection.map((s) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{s.title}</span>
                    <span className="text-ink-muted">
                      {s.correct}/{s.total}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={card}>
          <h2 className="font-semibold">Performance by level</h2>
          <p className="mt-1 text-sm text-ink-muted">
            A level is achieved with at least {passMark} of {result.byLevel[0]?.total} correct.
          </p>
          <ul className="mt-4 divide-y divide-line">
            {result.byLevel.map((l) => (
              <li key={l.level} className="flex items-center justify-between py-2.5 text-sm">
                <span className="flex items-center gap-3">
                  <span className="w-7 font-mono font-semibold">{l.level}</span>
                  <span className="text-ink-muted">{LEVEL_PROFILES[l.level].name}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-ink-muted">
                    {l.correct}/{l.total}
                  </span>
                  <span
                    className={`inline-flex w-24 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.passed ? "bg-success-soft text-success" : "bg-surface-muted text-ink-subtle"
                    }`}
                  >
                    {l.passed ? (
                      <>
                        <CheckIcon width={12} height={12} strokeWidth={3} /> Achieved
                      </>
                    ) : (
                      "Not yet"
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Can-do + next steps */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="font-semibold">What you can do at {profile.code}</h2>
          <ul className="mt-4 space-y-3">
            {profile.canDo.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="mt-0.5 text-success">
                  <CheckIcon width={16} height={16} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={card}>
          <h2 className="font-semibold">Recommended next steps</h2>
          <ol className="mt-4 space-y-3">
            {profile.nextSteps.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-[11px] font-semibold text-brand">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Answer review */}
      <section className="mt-10 print:hidden" aria-labelledby="review-heading">
        <h2 id="review-heading" className="text-lg font-semibold">
          Review your answers
        </h2>
        <div className="mt-4 space-y-3">
          {sections.map((section) => {
            const score = result.bySection.find((s) => s.id === section.id)!;
            return (
              <details key={section.id} className="group rounded-2xl border border-line bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium">{section.title}</span>
                  <span className="flex items-center gap-3 text-sm text-ink-muted">
                    {score.correct}/{score.total} correct
                    <ChevronDownIcon className="transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <ol className="divide-y divide-line border-t border-line">
                  {section.questions.map((q) => {
                    const chosen = session.answers[q.id];
                    const isCorrect = chosen === q.answer;
                    return (
                      <li key={q.id} className="flex gap-4 px-6 py-4 text-sm">
                        <span
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                            isCorrect ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckIcon width={12} height={12} strokeWidth={3} />
                          ) : (
                            <CrossIcon width={12} height={12} strokeWidth={3} />
                          )}
                          <span className="sr-only">{isCorrect ? "Correct" : "Incorrect"}</span>
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium">
                            {q.prompt.replaceAll("___", "_____")}{" "}
                            <span className="ml-1 font-mono text-xs text-ink-subtle">{q.level}</span>
                          </p>
                          <p className="mt-1 text-ink-muted">
                            Your answer:{" "}
                            <span className={isCorrect ? "text-success" : "text-danger"}>
                              {chosen === undefined ? "No answer" : q.options[chosen]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-ink-muted">
                              Correct answer: <span className="text-ink">{q.options[q.answer]}</span>
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </details>
            );
          })}
        </div>
      </section>

      {/* Method */}
      <section className="mt-10 rounded-2xl bg-surface-muted p-6 text-sm leading-relaxed text-ink-muted print:break-inside-avoid">
        <h2 className="font-semibold text-ink">How your level is calculated</h2>
        <p className="mt-2">
          Each CEFR level from A1 to C2 is measured by {result.byLevel[0]?.total} questions spread
          across all {sections.length} sections. A level counts as achieved when at least {passMark} of its
          questions are answered correctly. Your reported level is the highest level achieved with
          every level below it also achieved, so a lucky guess on a difficult question cannot
          inflate your result.
        </p>
        <p className="mt-2">
          This is an indicative placement result, not an official certificate.
        </p>
      </section>
    </div>
  );
}

function ScoreRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 100 100" className="size-28 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--surface-muted)" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
      />
    </svg>
  );
}
