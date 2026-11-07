"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  completeAssessment,
  goToStep,
  recordAnswer,
  useAssessmentSession,
} from "@/lib/assessment-store";
import { sectionsForAttempt } from "@/lib/questions";
import { QuestionCard } from "./question-card";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, LoadingState, buttonStyles } from "./ui";

export function AssessmentRunner() {
  const session = useAssessmentSession();
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (session === null) router.replace("/");
    else if (session && session.completedAt !== null) router.replace("/results");
  }, [session, router]);

  if (!session || session.completedAt !== null) {
    return <LoadingState label="Loading your assessment" />;
  }

  const sections = sectionsForAttempt(session.questionIds);
  const questionNumbers = new Map(session.questionIds.map((id, index) => [id, index + 1]));
  const step = session.currentStep;
  const section = sections[step];
  const isLastStep = step === sections.length - 1;
  const answeredInSection = section.questions.filter((q) => q.id in session.answers).length;
  const sectionComplete = answeredInSection === section.questions.length;
  const totalQuestions = session.questionIds.length;
  const answeredTotal = session.questionIds.filter((id) => id in session.answers).length;
  const overallPercent = Math.round((answeredTotal / totalQuestions) * 100);

  function changeStep(next: number) {
    goToStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }

  function handleNext() {
    if (!sectionComplete) return;
    if (isLastStep) completeAssessment();
    else changeStep(step + 1);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-32 sm:px-6 sm:pt-10">
      {/* Candidate + progress overview */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink-subtle">Candidate</p>
          <p className="font-semibold">{session.name}</p>
        </div>
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{answeredTotal}</span> of {totalQuestions}{" "}
          answered
        </p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Overall progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPercent}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      {/* Stepper */}
      <nav aria-label="Assessment sections" className="mt-6">
        <ol className="grid grid-cols-4 gap-2">
          {sections.map((s, index) => {
            const state = index < step ? "done" : index === step ? "current" : "upcoming";
            return (
              <li key={s.id} aria-current={state === "current" ? "step" : undefined}>
                <div
                  className={`h-1 rounded-full ${
                    state === "upcoming" ? "bg-line" : "bg-brand"
                  }`}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      state === "done"
                        ? "bg-brand text-on-brand"
                        : state === "current"
                          ? "border-2 border-brand text-brand"
                          : "border border-line-strong text-ink-subtle"
                    }`}
                  >
                    {state === "done" ? <CheckIcon width={11} height={11} strokeWidth={3.5} /> : index + 1}
                  </span>
                  <span
                    className={`hidden truncate text-xs sm:block ${
                      state === "current" ? "font-semibold text-ink" : "text-ink-subtle"
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="sr-only sm:hidden">{s.title}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Section header */}
      <header className="mt-10">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">
          Section {step + 1} of {sections.length}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-1 text-3xl font-semibold tracking-tight focus:outline-none"
        >
          {section.title}
        </h1>
        <p className="mt-2 text-ink-muted">
          {section.instructions} Select one answer for each question.
        </p>
      </header>

      {/* Questions */}
      <div key={section.id} className="mt-8 space-y-4">
        {section.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            number={questionNumbers.get(question.id)!}
            selected={session.answers[question.id]}
            onSelect={(option) => recordAnswer(question.id, option)}
          />
        ))}
      </div>

      {/* Navigation bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            className={buttonStyles.secondary}
            onClick={() => changeStep(step - 1)}
            disabled={step === 0}
          >
            <ArrowLeftIcon />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </button>

          <p className="text-center text-sm text-ink-muted" aria-live="polite">
            {sectionComplete ? (
              isLastStep ? (
                "All questions answered"
              ) : (
                "Section complete"
              )
            ) : (
              <>
                <span className="font-semibold text-ink">{answeredInSection}</span> of{" "}
                {section.questions.length} answered
              </>
            )}
          </p>

          <button
            type="button"
            className={buttonStyles.primary}
            onClick={handleNext}
            disabled={!sectionComplete}
          >
            {isLastStep ? "Submit & see results" : "Continue"}
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
