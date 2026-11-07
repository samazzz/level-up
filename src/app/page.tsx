import { StartPanel } from "@/components/start-panel";
import { BANK_SIZE, QUESTIONS_PER_TEST, SECTIONS } from "@/lib/questions";

const FACTS = [
  { value: String(QUESTIONS_PER_TEST), label: "questions" },
  { value: String(SECTIONS.length), label: "sections" },
  { value: "~20", label: "minutes" },
  { value: "A1–C2", label: "CEFR scale" },
];

const STEPS = [
  { title: "Enter your details", body: "Your name and phone number. No account or email required." },
  { title: "Complete four sections", body: "Answer each question by selecting the option you believe is correct." },
  { title: "Receive your report", body: "See your CEFR level, a skill-by-skill breakdown and how to improve." },
];

export default function Home() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1fr_420px] lg:gap-16">
      <section>
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">
          English proficiency assessment
        </p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Discover your true English level.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          A structured assessment of grammar, vocabulary, real-world usage and accuracy. Get an
          instant report with your level from A1 to C2 and a clear plan for what to work on next.
        </p>

        <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="bg-surface px-4 py-4">
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block text-2xl font-semibold tracking-tight">{fact.value}</span>
                <span className="text-sm text-ink-subtle">{fact.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 max-w-xl text-sm text-ink-subtle">
          Questions are drawn from a bank of {BANK_SIZE}, balanced across every level, so each
          attempt is different.
        </p>

        <div className="mt-12">
          <h2 className="text-sm font-semibold text-ink">What the assessment covers</h2>
          <ol className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
            {SECTIONS.map((section, index) => (
              <li key={section.id} className="flex gap-4 px-5 py-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-xs font-semibold text-brand">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{section.title}</p>
                  <p className="text-sm text-ink-muted">{section.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <h2 className="text-sm font-semibold text-ink">How it works</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-surface p-5">
                <span className="font-mono text-xs font-semibold text-ink-subtle">
                  STEP {index + 1}
                </span>
                <p className="mt-2 font-medium">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <StartPanel />
      </aside>
    </div>
  );
}
