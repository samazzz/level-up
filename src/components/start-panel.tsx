"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { registerCandidate } from "@/app/actions";
import {
  resetAssessment,
  startAssessment,
  useAssessmentSession,
} from "@/lib/assessment-store";
import {
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  validateName,
  validatePhone,
} from "@/lib/validation";
import { ArrowRightIcon, ClockIcon, RestartIcon, ShieldIcon, buttonStyles } from "./ui";

const cardClass = "rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8";

const inputClass =
  "mt-2 block w-full rounded-xl border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-2 focus:outline-offset-0 focus:outline-brand";

type RegisteredCandidate = { reference: string; name: string; phone: string; startedAt: number };

export function StartPanel() {
  const session = useAssessmentSession();
  const router = useRouter();
  // Keeps the form on screen while navigating, instead of briefly
  // showing the "in progress" card for the session that was just created.
  const [starting, setStarting] = useState(false);

  function handleRegistered(candidate: RegisteredCandidate) {
    setStarting(true);
    startAssessment(candidate);
    router.push("/assessment");
  }

  if (starting) return <DetailsForm locked onRegistered={() => {}} />;

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

  return <DetailsForm locked={false} onRegistered={handleRegistered} />;
}

function DetailsForm({
  locked,
  onRegistered,
}: {
  locked: boolean;
  onRegistered: (candidate: RegisteredCandidate) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Set synchronously so a double click can never register the candidate twice.
  const inFlight = useRef(false);

  const nameError = validateName(name);
  const phoneError = validatePhone(phone);
  const agreeError = agreed ? null : "Please confirm before you begin.";
  const showNameError = submitted && nameError !== null;
  const showPhoneError = submitted && phoneError !== null;
  const showAgreeError = submitted && agreeError !== null;
  const busy = locked || saving;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || inFlight.current) return;
    setSubmitted(true);
    setServerError(null);

    const firstInvalid = nameError
      ? "candidate-name"
      : phoneError
        ? "candidate-phone"
        : agreeError
          ? "candidate-agree"
          : null;
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    inFlight.current = true;
    setSaving(true);
    let registered = false;
    try {
      const response = await registerCandidate({ name, phone });
      if (response.ok) {
        registered = true;
        onRegistered({ reference: response.reference, startedAt: response.startedAt, name, phone });
      } else {
        setServerError(response.error);
      }
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      if (!registered) {
        inFlight.current = false;
        setSaving(false);
      }
    }
  }

  return (
    <form className={cardClass} onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-semibold tracking-tight">Begin your assessment</h2>
      <p className="mt-2 text-ink-muted">
        Enter your details to begin. Your name will appear on your report.
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
          maxLength={NAME_MAX_LENGTH}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={showNameError}
          aria-describedby={showNameError ? "candidate-name-error" : undefined}
          className={`${inputClass} ${showNameError ? "border-danger" : "border-line-strong"}`}
        />
        {showNameError && (
          <p id="candidate-name-error" className="mt-2 text-sm text-danger">
            {nameError}
          </p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="candidate-phone" className="text-sm font-medium">
          Phone number
        </label>
        <input
          id="candidate-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="e.g. +44 7700 900123"
          maxLength={PHONE_MAX_LENGTH}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={showPhoneError}
          aria-describedby={showPhoneError ? "candidate-phone-error" : "candidate-phone-hint"}
          className={`${inputClass} ${showPhoneError ? "border-danger" : "border-line-strong"}`}
        />
        {showPhoneError ? (
          <p id="candidate-phone-error" className="mt-2 text-sm text-danger">
            {phoneError}
          </p>
        ) : (
          <p id="candidate-phone-hint" className="mt-2 text-sm text-ink-subtle">
            Include your country code if you are outside your home country.
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

      {serverError && (
        <p role="alert" className="mt-5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button type="submit" className={`${buttonStyles.primary} mt-6 w-full`} disabled={busy}>
        {busy ? "Starting…" : "Start assessment"}
        <ArrowRightIcon />
      </button>

      <ul className="mt-6 space-y-2 text-sm text-ink-subtle">
        <li className="flex items-center gap-2">
          <ClockIcon className="shrink-0" />
          Takes about 20 minutes. There is no time limit.
        </li>
        <li className="flex items-center gap-2">
          <ShieldIcon className="shrink-0" />
          Your name, phone number and result are saved so we can follow up with you.
        </li>
      </ul>
    </form>
  );
}
