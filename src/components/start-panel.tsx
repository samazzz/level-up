"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  resetAssessment,
  startAssessment,
  useAssessmentSession,
} from "@/lib/assessment-store";
import { ArrowRightIcon, ClockIcon, RestartIcon, ShieldIcon, buttonStyles } from "./ui";

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’ .-]*$/u;

function validateName(raw: string): string | null {
  const name = raw.trim();
  if (name.length === 0) return "Please enter your full name.";
  if (name.length < 2) return "Your name must be at least 2 characters.";
  if (name.length > 60) return "Your name must be 60 characters or fewer.";
  if (!NAME_PATTERN.test(name)) return "Please use letters, spaces, hyphens or apostrophes only.";
  return null;
}

const cardClass = "rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8";

export function StartPanel() {
  const session = useAssessmentSession();
  const router = useRouter();
  // Keeps the form on screen while navigating, instead of briefly
  // showing the "in progress" card for the session that was just created.
  const [starting, setStarting] = useState(false);

  if (starting) return <NameForm pending onStart={() => {}} />;

  if (session && session.completedAt !== null) {
    return (
      <div className={cardClass}>
        <p className="text-sm font-medium text-success">Assessment complete</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Your report is ready, {session.name.split(" ")[0]}.
        </h2>
        <p className="mt-3 text-ink-muted">
          You have finished the assessment. View your CEFR level and detailed breakdown.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className={buttonStyles.primary} onClick={() => router.push("/results")}>
            View my report
            <ArrowRightIcon />
          </button>
          <button type="button" className={buttonStyles.ghost} onClick={resetAssessment}>
            <RestartIcon />
            Start a new assessment
          </button>
        </div>
      </div>
    );
  }

  if (session) {
    const total = session.questionIds.length;
    const answered = session.questionIds.filter((id) => id in session.answers).length;
    const percent = Math.round((answered / total) * 100);
    return (
      <div className={cardClass}>
        <p className="text-sm font-medium text-brand">Assessment in progress</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Welcome back, {session.name.split(" ")[0]}.
        </h2>
        <p className="mt-3 text-ink-muted">
          You have answered {answered} of {total} questions. Continue where you left off.
        </p>
        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Assessment progress"
        >
          <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className={buttonStyles.primary} onClick={() => router.push("/assessment")}>
            Resume assessment
            <ArrowRightIcon />
          </button>
          <button type="button" className={buttonStyles.ghost} onClick={resetAssessment}>
            <RestartIcon />
            Discard and start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <NameForm
      pending={false}
      onStart={() => {
        setStarting(true);
        router.push("/assessment");
      }}
    />
  );
}

function NameForm({ pending, onStart }: { pending: boolean; onStart: () => void }) {
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = validateName(name);
  const agreeError = agreed ? null : "Please confirm before you begin.";
  const showNameError = submitted && nameError !== null;
  const showAgreeError = submitted && agreeError !== null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setSubmitted(true);
    if (nameError || agreeError) {
      const target = nameError ? "candidate-name" : "candidate-agree";
      document.getElementById(target)?.focus();
      return;
    }
    startAssessment(name);
    onStart();
  }

  return (
    <form className={cardClass} onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-semibold tracking-tight">Begin your assessment</h2>
      <p className="mt-2 text-ink-muted">
        Enter your name as you would like it to appear on your report.
      </p>

      <div className="mt-6">
        <label htmlFor="candidate-name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="candidate-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Alex Morgan"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={showNameError}
          aria-describedby={showNameError ? "candidate-name-error" : undefined}
          className={`mt-2 block w-full rounded-xl border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-2 focus:outline-offset-0 focus:outline-brand ${
            showNameError ? "border-danger" : "border-line-strong"
          }`}
        />
        {showNameError && (
          <p id="candidate-name-error" className="mt-2 text-sm text-danger">
            {nameError}
          </p>
        )}
      </div>

      <div className="mt-5">
        <label
          htmlFor="candidate-agree"
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-muted p-4 text-sm leading-relaxed text-ink-muted"
        >
          <input
            id="candidate-agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-invalid={showAgreeError}
            aria-describedby={showAgreeError ? "candidate-agree-error" : undefined}
            className="mt-0.5 size-4 shrink-0 accent-brand"
          />
          I will complete this assessment on my own, without dictionaries, translators or other
          help, so my result reflects my real level.
        </label>
        {showAgreeError && (
          <p id="candidate-agree-error" className="mt-2 text-sm text-danger">
            {agreeError}
          </p>
        )}
      </div>

      <button type="submit" className={`${buttonStyles.primary} mt-6 w-full`} disabled={pending}>
        {pending ? "Starting…" : "Start assessment"}
        <ArrowRightIcon />
      </button>

      <ul className="mt-6 space-y-2 text-sm text-ink-subtle">
        <li className="flex items-center gap-2">
          <ClockIcon className="shrink-0" />
          Takes about 20 minutes. There is no time limit.
        </li>
        <li className="flex items-center gap-2">
          <ShieldIcon className="shrink-0" />
          Your answers stay in this browser and are never uploaded.
        </li>
      </ul>
    </form>
  );
}
