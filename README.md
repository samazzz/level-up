# LevelUp English Assessment

A web-based English placement test that maps candidates to the [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages) scale (A1 to C2). Candidates enter their name, answer 48 multiple-choice questions across four skill areas, and get an instant report with their level, a skill breakdown and suggested next steps. Nothing is saved on a server: answers and results stay in the candidate's browser.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Features

- **CEFR-aligned levels.** Results map to A1–C2, with a description, "can do" statements and next steps for each level.
- **Fresh question set per attempt.** Each attempt draws 48 questions from a bank of 72, balanced so every section has the same number of questions at each level.
- **Gap-free scoring.** The reported level is the highest level passed with every level below it also passed, so lucky guesses on hard questions don't inflate the result.
- **Progress survives a refresh.** The session is kept in `sessionStorage`, and the app still works from memory when storage is blocked.
- **Printable report.** The results page has a print layout and lets candidates review every answer next to the correct one.
- **Accessible UI.** Labelled progress bars, step navigation with `aria-current`, focus management between sections and inline form validation.

## How it works

1. **Start.** The candidate enters their name and confirms they will take the test without help. The browser creates a session with a reference such as `LU-261107-7KQ2`.
2. **Assessment.** Questions are shown in four sections, one at a time. The candidate must answer every question in a section before moving on.
3. **Submit.** On the last section the answers are scored in the browser. Nothing is uploaded.
4. **Report.** The results page shows the CEFR level, overall score, per-level and per-section breakdowns, an answer review, and options to print or retake.

### Sections

| Section           | Focus                                                  |
| ----------------- | ------------------------------------------------------ |
| Grammar           | Verb tenses, conditionals and sentence structure       |
| Vocabulary        | Word meaning, word choice and precision                |
| Language in Use   | Prepositions, phrasal verbs, collocations and idioms   |
| Sentence Accuracy | Spotting errors and recognising well-formed English    |

The bank holds 3 questions per CEFR level in each section (4 × 6 × 3 = 72). Each attempt draws 2 per level per section (4 × 6 × 2 = 48), so every level is measured by 8 questions.

### Scoring

A level is **passed** when at least 60% of its questions are correct (5 of 8). The candidate's level is the highest one reached by passing each level in turn from A1 upwards. A candidate who passes A1, A2 and B2 but fails B1 is reported as **A2**.

If even A1 is not passed, the report shows A1 and flags the result as below A1.

The logic lives in [`src/lib/scoring.ts`](src/lib/scoring.ts).

## Getting started

### Prerequisites

- Node.js 20.9 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create a production build            |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page with the start form
│   ├── assessment/page.tsx      # Assessment flow
│   ├── results/page.tsx         # Results report
│   ├── layout.tsx               # Root layout, header and footer
│   └── globals.css              # Tailwind theme tokens
├── components/
│   ├── start-panel.tsx          # Name form and resume/reset controls
│   ├── assessment-runner.tsx    # Section navigation, progress and submission
│   ├── question-card.tsx        # Single multiple-choice question
│   ├── results-report.tsx       # Level, breakdowns, answer review, method
│   └── ui.tsx                   # Shared buttons, icons and logo
└── lib/
    ├── questions.ts             # Question bank and per-attempt draw
    ├── levels.ts                # CEFR level profiles
    ├── scoring.ts               # Scoring rules
    └── assessment-store.ts      # Client session store (sessionStorage)
```

## Customizing the assessment

**Add or edit questions** in [`src/lib/questions.ts`](src/lib/questions.ts). Each question needs:

- a unique `id`
- a CEFR `level`
- a `prompt`, using `___` for the gap
- exactly 4 `options`
- the `answer` index of the correct option

Each level in each section must have at least `QUESTIONS_PER_LEVEL` questions for the draw to stay balanced.

**Change the test length** with `QUESTIONS_PER_LEVEL` in `questions.ts`. The total is `sections × 6 levels × QUESTIONS_PER_LEVEL`, and the landing page updates automatically.

**Change the pass mark** with `PASS_THRESHOLD` in [`src/lib/scoring.ts`](src/lib/scoring.ts).

**Edit level descriptions**, "can do" statements and next steps in [`src/lib/levels.ts`](src/lib/levels.ts).

## Deployment

The app stores nothing on the server, so it runs on any Next.js host, including serverless platforms such as Vercel.

```bash
npm run build
npm start
```

## Disclaimer

LevelUp gives an indicative placement result. It is not an official CEFR certificate.
