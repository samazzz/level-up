# LevelUp English Assessment

A web-based English placement test that maps candidates to the [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages) scale (A1 to C2). Candidates enter their name and phone number, answer 48 multiple-choice questions across four skill areas, and get an instant report with their level, a skill breakdown and suggested next steps. Every result is saved on the server.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Features

- **CEFR-aligned levels.** Results map to A1–C2, with a description, "can do" statements and next steps for each level.
- **Fresh question set per attempt.** Each attempt draws 48 questions from a bank of 72, balanced so every section has the same number of questions at each level.
- **Gap-free scoring.** The reported level is the highest level passed with every level below it also passed, so lucky guesses on hard questions don't inflate the result.
- **Server-side scoring.** The browser sends only the raw answers. The server checks the payload, recomputes the score and stores the result.
- **Progress survives a refresh.** The session is kept in `sessionStorage`, and the app still works from memory when storage is blocked.
- **Printable report.** The results page has a print layout and lets candidates review every answer next to the correct one.
- **Accessible UI.** Labelled progress bars, step navigation with `aria-current`, focus management between sections and inline form validation.

## How it works

1. **Start.** The candidate enters their name and phone number and confirms they will take the test without help. The server validates the details, creates a record and returns a reference such as `LU-261107-7KQ2`.
2. **Assessment.** Questions are shown in four sections, one at a time. The candidate must answer every question in a section before moving on.
3. **Submit.** On the last section the answers are sent to the server, which scores them and saves the result with the candidate record. The session only counts as complete once the server confirms the save.
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

## Configuration

| Variable          | Default                | Description                                  |
| ----------------- | ---------------------- | -------------------------------------------- |
| `CANDIDATES_FILE` | `data/candidates.json` | Path to the JSON file storing candidate data |

Example:

```bash
CANDIDATES_FILE=/var/lib/levelup/candidates.json npm start
```

## Candidate data

Candidates and their results are stored in a single JSON file. The file and its folder are created on first write. A completed record looks like this:

```json
{
  "reference": "LU-261107-7KQ2",
  "name": "Jane Doe",
  "phone": "+44 7700 900123",
  "startedAt": "2026-11-07T10:02:11.000Z",
  "completedAt": "2026-11-07T10:21:45.000Z",
  "result": {
    "level": "B2",
    "levelName": "Upper-Intermediate",
    "correct": 33,
    "total": 48,
    "percent": 69,
    "sections": {
      "Grammar": "9/12",
      "Vocabulary": "8/12",
      "Language in Use": "8/12",
      "Sentence Accuracy": "8/12"
    }
  }
}
```

Records that were started but not finished have `completedAt` and `result` set to `null`.

How the store behaves:

- **Serialized writes.** All reads and writes go through one in-process queue, so concurrent requests don't overwrite each other.
- **Atomic saves.** Data is written to a temporary file and then renamed over the original.
- **Corruption-safe.** A file that can't be parsed raises an error instead of being treated as empty, so saved records are never wiped.
- **Idempotent submissions.** Submitting again for a completed record changes nothing.

> [!IMPORTANT]
> The file contains names and phone numbers. `/data/` is gitignored. Keep it out of version control and back it up like any other personal data.

There is no admin dashboard yet. To view results, open the JSON file directly.

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page with the start form
│   ├── assessment/page.tsx      # Assessment flow
│   ├── results/page.tsx         # Results report
│   ├── actions.ts               # Server actions: registerCandidate, submitResult
│   ├── layout.tsx               # Root layout, header and footer
│   └── globals.css              # Tailwind theme tokens
├── components/
│   ├── start-panel.tsx          # Candidate details form and resume/reset controls
│   ├── assessment-runner.tsx    # Section navigation, progress and submission
│   ├── question-card.tsx        # Single multiple-choice question
│   ├── results-report.tsx       # Level, breakdowns, answer review, method
│   └── ui.tsx                   # Shared buttons, icons and logo
└── lib/
    ├── questions.ts             # Question bank and per-attempt draw
    ├── levels.ts                # CEFR level profiles
    ├── scoring.ts               # Scoring rules
    ├── validation.ts            # Name and phone rules shared by client and server
    ├── assessment-store.ts      # Client session store (sessionStorage)
    └── server/
        ├── candidates.ts        # JSON file persistence
        └── payloads.ts          # Server-side validation of action payloads
```

## Customizing the assessment

**Add or edit questions** in [`src/lib/questions.ts`](src/lib/questions.ts). Each question needs:

- a unique `id`
- a CEFR `level`
- a `prompt`, using `___` for the gap
- exactly 4 `options` (the server only accepts answer indexes 0–3)
- the `answer` index of the correct option

Each level in each section must have at least `QUESTIONS_PER_LEVEL` questions for the draw to stay balanced.

**Change the test length** with `QUESTIONS_PER_LEVEL` in `questions.ts`. The total is `sections × 6 levels × QUESTIONS_PER_LEVEL`, and the landing page updates automatically.

**Change the pass mark** with `PASS_THRESHOLD` in [`src/lib/scoring.ts`](src/lib/scoring.ts).

**Edit level descriptions**, "can do" statements and next steps in [`src/lib/levels.ts`](src/lib/levels.ts).

## Deployment

The app needs a **persistent, writable filesystem** to store candidate data. Run it as a long-lived Node.js server (a VPS, a container with a mounted volume, etc.) and point `CANDIDATES_FILE` at persistent storage:

```bash
npm run build
CANDIDATES_FILE=/path/to/persistent/candidates.json npm start
```

> [!WARNING]
> Serverless platforms such as Vercel have read-only or temporary filesystems, so results would be lost. The write queue also only covers a single process, so don't run several instances against the same file. For either setup, swap `src/lib/server/candidates.ts` for a database-backed version.

## Disclaimer

LevelUp gives an indicative placement result. It is not an official CEFR certificate.
