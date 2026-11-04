import type { Question } from "@/lib/questions";
import { CheckIcon } from "./ui";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Renders "___" gaps in a prompt as a visible blank line. */
function Prompt({ text }: { text: string }) {
  const parts = text.split("___");
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="mx-1 inline-block w-16 translate-y-[3px] border-b-2 border-ink-subtle">
              <span className="sr-only">blank</span>
            </span>
          )}
        </span>
      ))}
    </>
  );
}

type QuestionCardProps = {
  question: Question;
  number: number;
  selected: number | undefined;
  onSelect: (optionIndex: number) => void;
};

export function QuestionCard({ question, number, selected, onSelect }: QuestionCardProps) {
  const answered = selected !== undefined;

  return (
    <fieldset className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <legend className="sr-only">
        Question {number}: {question.prompt.replaceAll("___", "blank")}
      </legend>

      <div className="flex items-start gap-4" aria-hidden="true">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold transition-colors ${
            answered ? "bg-brand text-on-brand" : "bg-surface-muted text-ink-muted"
          }`}
        >
          {number}
        </span>
        <p className="pt-1 text-[17px] leading-relaxed font-medium">
          <Prompt text={question.prompt} />
        </p>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:pl-12">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          return (
            <label
              key={option}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                isSelected
                  ? "border-brand bg-brand-soft"
                  : "border-line hover:border-line-strong hover:bg-surface-muted"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={isSelected}
                onChange={() => onSelect(index)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  isSelected
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line-strong bg-surface text-transparent"
                }`}
              >
                <CheckIcon width={13} height={13} strokeWidth={3} />
              </span>
              <span className="font-mono text-xs font-semibold text-ink-subtle" aria-hidden="true">
                {OPTION_LETTERS[index]}
              </span>
              <span className={isSelected ? "font-medium text-ink" : "text-ink"}>{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
