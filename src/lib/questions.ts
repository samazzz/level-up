import { CEFR_LEVELS, type CefrLevel } from "./levels";

export type Question = {
  id: string;
  level: CefrLevel;
  prompt: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
};

/** Questions drawn per CEFR level in each section for one attempt. */
export const QUESTIONS_PER_LEVEL = 2;

/**
 * The full question bank: 3 questions per CEFR level in each section.
 * Each attempt draws QUESTIONS_PER_LEVEL of them (see `drawQuestionIds`).
 */
export const SECTIONS: Section[] = [
  {
    id: "grammar",
    title: "Grammar",
    description: "Verb tenses, conditionals and sentence structure.",
    instructions: "Choose the option that correctly completes each sentence.",
    questions: [
      // A1
      {
        id: "grammar-1",
        level: "A1",
        prompt: "She ___ a teacher at the local school.",
        options: ["am", "is", "are", "be"],
        answer: 1,
      },
      {
        id: "grammar-7",
        level: "A1",
        prompt: "___ you like chocolate?",
        options: ["Does", "Are", "Do", "Is"],
        answer: 2,
      },
      {
        id: "grammar-8",
        level: "A1",
        prompt: "There ___ two books on the table.",
        options: ["is", "am", "be", "are"],
        answer: 3,
      },
      // A2
      {
        id: "grammar-2",
        level: "A2",
        prompt: "We ___ to the cinema last weekend.",
        options: ["have gone", "goes", "went", "going"],
        answer: 2,
      },
      {
        id: "grammar-9",
        level: "A2",
        prompt: "My sister is ___ than me.",
        options: ["taller", "tall", "tallest", "more tall"],
        answer: 0,
      },
      {
        id: "grammar-10",
        level: "A2",
        prompt: "Look at those dark clouds! It ___ rain.",
        options: ["goes to", "is going to", "will to", "is raining to"],
        answer: 1,
      },
      // B1
      {
        id: "grammar-3",
        level: "B1",
        prompt: "If it ___ tomorrow, we will cancel the picnic.",
        options: ["rains", "will rain", "rained", "would rain"],
        answer: 0,
      },
      {
        id: "grammar-11",
        level: "B1",
        prompt: "I ___ in this city since 2015.",
        options: ["live", "am living", "lived", "have lived"],
        answer: 3,
      },
      {
        id: "grammar-12",
        level: "B1",
        prompt: "The new bridge ___ by a local company last year.",
        options: ["was built", "built", "has built", "is building"],
        answer: 0,
      },
      // B2
      {
        id: "grammar-4",
        level: "B2",
        prompt: "By the time we arrived at the station, the train ___.",
        options: ["has already left", "already leaves", "is already leaving", "had already left"],
        answer: 3,
      },
      {
        id: "grammar-13",
        level: "B2",
        prompt: "If I ___ the weather forecast, I would have taken an umbrella.",
        options: ["checked", "have checked", "had checked", "would check"],
        answer: 2,
      },
      {
        id: "grammar-14",
        level: "B2",
        prompt: "She asked me where ___.",
        options: ["did I live", "do I live", "lived I", "I lived"],
        answer: 3,
      },
      // C1
      {
        id: "grammar-5",
        level: "C1",
        prompt: "Not only ___ the deadline, but he also went over budget.",
        options: ["he missed", "did he miss", "he did miss", "missed he"],
        answer: 1,
      },
      {
        id: "grammar-15",
        level: "C1",
        prompt: "___ the report, she sent it to her manager.",
        options: ["Finished", "Having finished", "Being finished", "Having been finished"],
        answer: 1,
      },
      {
        id: "grammar-16",
        level: "C1",
        prompt: "___ I need right now is a long holiday.",
        options: ["That", "Which", "What", "It"],
        answer: 2,
      },
      // C2
      {
        id: "grammar-6",
        level: "C2",
        prompt:
          "___ the support of her colleagues, the project would never have been completed.",
        options: ["Were it not", "Unless it had been", "Had it not been for", "Should it not have"],
        answer: 2,
      },
      {
        id: "grammar-17",
        level: "C2",
        prompt: "The committee recommended that the proposal ___ rejected.",
        options: ["is being", "would", "to be", "be"],
        answer: 3,
      },
      {
        id: "grammar-18",
        level: "C2",
        prompt: "___ as it may seem, the theory has been confirmed by several experiments.",
        options: ["Strange", "Strangely", "However strange", "So strange"],
        answer: 0,
      },
    ],
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    description: "Word meaning, word choice and precision.",
    instructions: "Choose the word that best completes each sentence.",
    questions: [
      // A1
      {
        id: "vocabulary-1",
        level: "A1",
        prompt: "I wear a ___ on my head when it is cold outside.",
        options: ["shoe", "belt", "glove", "hat"],
        answer: 3,
      },
      {
        id: "vocabulary-7",
        level: "A1",
        prompt: "My mother's sister is my ___.",
        options: ["aunt", "uncle", "cousin", "niece"],
        answer: 0,
      },
      {
        id: "vocabulary-8",
        level: "A1",
        prompt: "We eat ___ in the morning before school.",
        options: ["dinner", "lunch", "breakfast", "supper"],
        answer: 2,
      },
      // A2
      {
        id: "vocabulary-2",
        level: "A2",
        prompt: "The museum is very ___. There are always lots of tourists there.",
        options: ["quiet", "popular", "empty", "boring"],
        answer: 1,
      },
      {
        id: "vocabulary-9",
        level: "A2",
        prompt: "I can't hear you. Can you speak more ___, please?",
        options: ["quietly", "quickly", "softly", "loudly"],
        answer: 3,
      },
      {
        id: "vocabulary-10",
        level: "A2",
        prompt: "The train was ___, so we arrived an hour late.",
        options: ["early", "delayed", "empty", "cheap"],
        answer: 1,
      },
      // B1
      {
        id: "vocabulary-3",
        level: "B1",
        prompt: "Could you ___ me some money until Friday? I left my wallet at home.",
        options: ["lend", "borrow", "owe", "pay back"],
        answer: 0,
      },
      {
        id: "vocabulary-11",
        level: "B1",
        prompt: "I'm really ___ in history, so I read a lot of books about it.",
        options: ["interesting", "interested", "boring", "bored"],
        answer: 1,
      },
      {
        id: "vocabulary-12",
        level: "B1",
        prompt: "Please ___ this form and give it to the receptionist.",
        options: ["fill in", "fill up", "fill on", "fill at"],
        answer: 0,
      },
      // B2
      {
        id: "vocabulary-4",
        level: "B2",
        prompt: "The new policy was met with widespread ___; almost nobody supported it.",
        options: ["approval", "enthusiasm", "criticism", "ambition"],
        answer: 2,
      },
      {
        id: "vocabulary-13",
        level: "B2",
        prompt: "The company had to ___ 200 workers because of falling sales.",
        options: ["lay down", "lay off", "lay out", "lay by"],
        answer: 1,
      },
      {
        id: "vocabulary-14",
        level: "B2",
        prompt: "Her ___ to detail makes her an excellent editor.",
        options: ["attendance", "intention", "attention", "tension"],
        answer: 2,
      },
      // C1
      {
        id: "vocabulary-5",
        level: "C1",
        prompt: "The evidence was so ___ that the jury reached a verdict in under an hour.",
        options: ["compulsory", "complacent", "compulsive", "compelling"],
        answer: 3,
      },
      {
        id: "vocabulary-15",
        level: "C1",
        prompt:
          "The minister insisted that his comments had been ___ by the press and that he had never said such a thing.",
        options: ["misled", "mistaken", "misplaced", "misquoted"],
        answer: 3,
      },
      {
        id: "vocabulary-16",
        level: "C1",
        prompt: "After years of ___ research, the team finally identified the cause of the disease.",
        options: ["mischievous", "meticulous", "miscellaneous", "malicious"],
        answer: 1,
      },
      // C2
      {
        id: "vocabulary-6",
        level: "C2",
        prompt:
          "The politician's speech was full of ___: it sounded impressive but said almost nothing new.",
        options: ["plaudits", "platitudes", "placebos", "plateaus"],
        answer: 1,
      },
      {
        id: "vocabulary-17",
        level: "C2",
        prompt:
          "The novel's plot is so ___ that many readers have to re-read chapters to follow it.",
        options: ["convivial", "contrite", "convoluted", "conventional"],
        answer: 2,
      },
      {
        id: "vocabulary-18",
        level: "C2",
        prompt: "Despite weeks of negotiation, she remained ___ and refused to change her position.",
        options: ["indolent", "ingenuous", "innocuous", "intransigent"],
        answer: 3,
      },
    ],
  },
  {
    id: "language-in-use",
    title: "Language in Use",
    description: "Prepositions, phrasal verbs, collocations and idioms.",
    instructions: "Choose the option that makes each sentence natural and correct.",
    questions: [
      // A1
      {
        id: "language-1",
        level: "A1",
        prompt: "I get up ___ seven o'clock every morning.",
        options: ["in", "on", "at", "to"],
        answer: 2,
      },
      {
        id: "language-7",
        level: "A1",
        prompt: "My birthday is ___ May.",
        options: ["on", "at", "in", "to"],
        answer: 2,
      },
      {
        id: "language-8",
        level: "A1",
        prompt: "She lives ___ a small flat near the station.",
        options: ["on", "in", "to", "of"],
        answer: 1,
      },
      // A2
      {
        id: "language-2",
        level: "A2",
        prompt: "It's too dark in here. Can you ___ the light, please?",
        options: ["turn on", "turn off", "look at", "put down"],
        answer: 0,
      },
      {
        id: "language-9",
        level: "A2",
        prompt: "Please ___ your shoes before you come into the house.",
        options: ["put on", "take off", "take on", "get off"],
        answer: 1,
      },
      {
        id: "language-10",
        level: "A2",
        prompt: "I'm looking forward ___ you next week.",
        options: ["to see", "seeing", "to seeing", "see"],
        answer: 2,
      },
      // B1
      {
        id: "language-3",
        level: "B1",
        prompt: "I've been looking ___ my keys all morning, but I can't find them.",
        options: ["after", "at", "up", "for"],
        answer: 3,
      },
      {
        id: "language-11",
        level: "B1",
        prompt: "Can you ___ my cat while I'm on holiday?",
        options: ["look for", "look up", "look into", "look after"],
        answer: 3,
      },
      {
        id: "language-12",
        level: "B1",
        prompt: "My little brother is afraid ___ spiders.",
        options: ["from", "of", "about", "with"],
        answer: 1,
      },
      // B2
      {
        id: "language-4",
        level: "B2",
        prompt: "Despite the heavy rain, the match ___ ahead as planned.",
        options: ["carried", "went", "took", "put"],
        answer: 1,
      },
      {
        id: "language-13",
        level: "B2",
        prompt: "The meeting has been ___ off completely and will not be rescheduled.",
        options: ["put", "called", "taken", "set"],
        answer: 1,
      },
      {
        id: "language-14",
        level: "B2",
        prompt: "She has ___ a lot of progress in her English this year.",
        options: ["made", "done", "taken", "had"],
        answer: 0,
      },
      // C1
      {
        id: "language-5",
        level: "C1",
        prompt: "The council has been dragging its ___ over the decision for months.",
        options: ["toes", "hands", "feet", "legs"],
        answer: 2,
      },
      {
        id: "language-15",
        level: "C1",
        prompt: "Can you ___ my memory? I've completely forgotten his name.",
        options: ["run", "push", "jog", "walk"],
        answer: 2,
      },
      {
        id: "language-16",
        level: "C1",
        prompt: "We'll just have to ___ the bullet and tell the client the truth.",
        options: ["bite", "chew", "eat", "hold"],
        answer: 0,
      },
      // C2
      {
        id: "language-6",
        level: "C2",
        prompt: "The board rejected the proposal out of ___, without even discussing it.",
        options: ["hand", "mind", "place", "turn"],
        answer: 0,
      },
      {
        id: "language-17",
        level: "C2",
        prompt: "His explanation doesn't hold ___; it is full of contradictions.",
        options: ["air", "water", "ground", "fire"],
        answer: 1,
      },
      {
        id: "language-18",
        level: "C2",
        prompt:
          "Winning the contract was a ___ victory: the price cut they offered wiped out their profits for the year.",
        options: ["Trojan", "Spartan", "Pyrrhic", "Herculean"],
        answer: 2,
      },
    ],
  },
  {
    id: "accuracy",
    title: "Sentence Accuracy",
    description: "Spotting errors and recognising well-formed English.",
    instructions: "Choose the one sentence that is grammatically correct.",
    questions: [
      // A1
      {
        id: "accuracy-1",
        level: "A1",
        prompt: "Which sentence is correct?",
        options: [
          "He don't like coffee.",
          "He doesn't likes coffee.",
          "He not like coffee.",
          "He doesn't like coffee.",
        ],
        answer: 3,
      },
      {
        id: "accuracy-7",
        level: "A1",
        prompt: "Which sentence is correct?",
        options: ["I am 25 years.", "I have 25 years old.", "I am 25 years old.", "I has 25 years."],
        answer: 2,
      },
      {
        id: "accuracy-8",
        level: "A1",
        prompt: "Which sentence is correct?",
        options: [
          "She can to swim very well.",
          "She cans swim very well.",
          "She can swims very well.",
          "She can swim very well.",
        ],
        answer: 3,
      },
      // A2
      {
        id: "accuracy-2",
        level: "A2",
        prompt: "Which sentence is correct?",
        options: [
          "There is many people in the park.",
          "There are much people in the park.",
          "There are many people in the park.",
          "There is a lot people in the park.",
        ],
        answer: 2,
      },
      {
        id: "accuracy-9",
        level: "A2",
        prompt: "Which sentence is correct?",
        options: [
          "Did you went to school yesterday?",
          "Did you go to school yesterday?",
          "Do you went to school yesterday?",
          "Did you goed to school yesterday?",
        ],
        answer: 1,
      },
      {
        id: "accuracy-10",
        level: "A2",
        prompt: "Which sentence is correct?",
        options: [
          "He is more taller than his father.",
          "He is tallest than his father.",
          "He is taller that his father.",
          "He is taller than his father.",
        ],
        answer: 3,
      },
      // B1
      {
        id: "accuracy-3",
        level: "B1",
        prompt: "Which sentence is correct?",
        options: [
          "I have lived here for five years.",
          "I have lived here since five years.",
          "I live here for five years.",
          "I am living here since five years.",
        ],
        answer: 0,
      },
      {
        id: "accuracy-11",
        level: "B1",
        prompt: "Which sentence is correct?",
        options: [
          "If I will see her, I will tell her.",
          "If I see her, I tell her tomorrow.",
          "If I see her, I will tell her.",
          "If I would see her, I will tell her.",
        ],
        answer: 2,
      },
      {
        id: "accuracy-12",
        level: "B1",
        prompt: "Which sentence is correct?",
        options: [
          "I'm used to get up early.",
          "I'm used to getting up early.",
          "I used to getting up early.",
          "I'm use to get up early.",
        ],
        answer: 1,
      },
      // B2
      {
        id: "accuracy-4",
        level: "B2",
        prompt: "Which sentence is correct?",
        options: [
          "The book which I borrowed it from you was excellent.",
          "The book that I borrowed from you was excellent.",
          "The book what I borrowed from you was excellent.",
          "The book I borrowed from you it was excellent.",
        ],
        answer: 1,
      },
      {
        id: "accuracy-13",
        level: "B2",
        prompt: "Which sentence is correct?",
        options: [
          "The police is investigating the case.",
          "The polices are investigating the case.",
          "The police investigates the case now.",
          "The police are investigating the case.",
        ],
        answer: 3,
      },
      {
        id: "accuracy-14",
        level: "B2",
        prompt: "Which sentence is correct?",
        options: [
          "She suggested that I take a break.",
          "She suggested me to take a break.",
          "She suggested me that I take a break.",
          "She suggested to me take a break.",
        ],
        answer: 0,
      },
      // C1
      {
        id: "accuracy-5",
        level: "C1",
        prompt: "Which sentence is correct?",
        options: [
          "Hardly I had arrived when the phone rang.",
          "Hardly had I arrived than the phone rang.",
          "Hardly did I arrived when the phone rang.",
          "Hardly had I arrived when the phone rang.",
        ],
        answer: 3,
      },
      {
        id: "accuracy-15",
        level: "C1",
        prompt: "Which sentence is correct?",
        options: [
          "Had I knew about the problem, I would have helped.",
          "Would I have known about the problem, I would have helped.",
          "Had I known about the problem, I would have helped.",
          "If I knew about the problem, I would helped.",
        ],
        answer: 2,
      },
      {
        id: "accuracy-16",
        level: "C1",
        prompt: "Which sentence is correct?",
        options: [
          "It's the first time I've ever eaten sushi.",
          "It's the first time I ever eat sushi.",
          "It's the first time I've ever ate sushi.",
          "It's the first time I eat ever sushi.",
        ],
        answer: 0,
      },
      // C2
      {
        id: "accuracy-6",
        level: "C2",
        prompt: "Which sentence is correct?",
        options: [
          "Having walked into the room, the smell of fresh paint overwhelmed.",
          "Walking into the room, the smell of fresh paint overwhelming me.",
          "Walking into the room, I was overwhelmed by the smell of fresh paint.",
          "Walking into the room, I was overwhelming by the smell of fresh paint.",
        ],
        answer: 2,
      },
      {
        id: "accuracy-17",
        level: "C2",
        prompt: "Which sentence is correct?",
        options: [
          "The meeting having been cancelled, everyone went home early.",
          "The meeting been cancelled, everyone went home early.",
          "The meeting having being cancelled, everyone went home early.",
          "The meeting having been cancelled, so everyone went home early.",
        ],
        answer: 0,
      },
      {
        id: "accuracy-18",
        level: "C2",
        prompt: "Which sentence is correct?",
        options: [
          "He laid on the sofa all afternoon.",
          "He has lay on the sofa all afternoon.",
          "He lay on the sofa all afternoon.",
          "He lain on the sofa all afternoon.",
        ],
        answer: 2,
      },
    ],
  },
];

export const QUESTION_BANK: Question[] = SECTIONS.flatMap((s) => s.questions);

export const BANK_SIZE = QUESTION_BANK.length;

/** Number of questions in one attempt. */
export const QUESTIONS_PER_TEST = SECTIONS.length * CEFR_LEVELS.length * QUESTIONS_PER_LEVEL;

const BANK_INDEX = new Map(QUESTION_BANK.map((q, index) => [q.id, index]));

export function isBankQuestion(id: string): boolean {
  return BANK_INDEX.has(id);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function byLevelThenBankOrder(a: Question, b: Question) {
  const level = CEFR_LEVELS.indexOf(a.level) - CEFR_LEVELS.indexOf(b.level);
  return level !== 0 ? level : BANK_INDEX.get(a.id)! - BANK_INDEX.get(b.id)!;
}

/**
 * Draws a fresh set of questions for one attempt, balanced so that every
 * section has QUESTIONS_PER_LEVEL questions at each CEFR level.
 */
export function drawQuestionIds(random: () => number = Math.random): string[] {
  const ids: string[] = [];
  for (const section of SECTIONS) {
    for (const level of CEFR_LEVELS) {
      shuffle(
        section.questions.filter((q) => q.level === level),
        random,
      )
        .slice(0, QUESTIONS_PER_LEVEL)
        .sort(byLevelThenBankOrder)
        .forEach((q) => ids.push(q.id));
    }
  }
  return ids;
}

/**
 * Returns the sections of an attempt, containing only the drawn questions,
 * in the order they were drawn.
 */
export function sectionsForAttempt(questionIds: string[]): Section[] {
  const order = new Map(questionIds.map((id, index) => [id, index]));
  return SECTIONS.map((section) => {
    const questions = section.questions
      .filter((q) => order.has(q.id))
      .sort((a, b) => order.get(a.id)! - order.get(b.id)!);
    return { ...section, questions };
  });
}
