export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type CefrLevel = (typeof CEFR_LEVELS)[number];

export type LevelProfile = {
  code: CefrLevel;
  name: string;
  band: "Basic user" | "Independent user" | "Proficient user";
  summary: string;
  canDo: string[];
  nextSteps: string[];
};

export const LEVEL_PROFILES: Record<CefrLevel, LevelProfile> = {
  A1: {
    code: "A1",
    name: "Beginner",
    band: "Basic user",
    summary:
      "You are building the foundations of English. You can recognise familiar words and very simple phrases, especially when people speak slowly and clearly.",
    canDo: [
      "Introduce yourself and answer simple personal questions",
      "Understand everyday words such as numbers, days and common objects",
      "Fill in basic forms with your name, address and nationality",
    ],
    nextSteps: [
      "Learn the 500 most frequent English words and practise them daily",
      "Master the present simple and the verb “to be”",
      "Listen to short, slow audio for beginners for 10 minutes a day",
    ],
  },
  A2: {
    code: "A2",
    name: "Elementary",
    band: "Basic user",
    summary:
      "You can communicate in simple, routine situations and understand frequently used expressions about familiar topics such as shopping, family and work.",
    canDo: [
      "Describe your background, surroundings and daily routine in simple terms",
      "Handle short social exchanges and simple transactions",
      "Understand short, simple texts such as notices, menus and personal messages",
    ],
    nextSteps: [
      "Practise talking about past events with the past simple",
      "Read graded readers written for A2–B1 learners",
      "Start writing short messages and emails in English",
    ],
  },
  B1: {
    code: "B1",
    name: "Intermediate",
    band: "Independent user",
    summary:
      "You can deal with most situations you are likely to meet while travelling or at work, and produce simple connected text on topics that interest you.",
    canDo: [
      "Understand the main points of clear, standard speech on familiar matters",
      "Describe experiences, events, hopes and ambitions",
      "Give brief reasons and explanations for your opinions and plans",
    ],
    nextSteps: [
      "Work on conditionals, the present perfect and linking words",
      "Watch series or podcasts in English with English subtitles",
      "Practise expressing and defending an opinion in short paragraphs",
    ],
  },
  B2: {
    code: "B2",
    name: "Upper-Intermediate",
    band: "Independent user",
    summary:
      "You can interact with a degree of fluency and spontaneity that makes regular conversation with native speakers possible without strain for either side.",
    canDo: [
      "Understand the main ideas of complex texts, including technical discussions in your field",
      "Produce clear, detailed text on a wide range of subjects",
      "Explain a viewpoint on an issue, giving the advantages and disadvantages of options",
    ],
    nextSteps: [
      "Expand your range of collocations, phrasal verbs and idioms",
      "Read long-form articles from quality newspapers and magazines",
      "Focus on accuracy in advanced structures such as the past perfect and passives",
    ],
  },
  C1: {
    code: "C1",
    name: "Advanced",
    band: "Proficient user",
    summary:
      "You can express yourself fluently and spontaneously, and use English flexibly and effectively for social, academic and professional purposes.",
    canDo: [
      "Understand a wide range of demanding, longer texts and recognise implicit meaning",
      "Produce clear, well-structured, detailed text on complex subjects",
      "Use language precisely without much obvious searching for expressions",
    ],
    nextSteps: [
      "Refine register and style for formal and informal contexts",
      "Study inversion, cleft sentences and other advanced structures",
      "Engage with academic or professional material in your field",
    ],
  },
  C2: {
    code: "C2",
    name: "Proficient",
    band: "Proficient user",
    summary:
      "You can understand virtually everything you hear or read with ease, and express yourself spontaneously, very fluently and precisely, even in complex situations.",
    canDo: [
      "Summarise information from different sources into a coherent presentation",
      "Distinguish finer shades of meaning in complex situations",
      "Use idiomatic and colloquial expressions naturally and accurately",
    ],
    nextSteps: [
      "Maintain your level through regular reading of literature and specialist texts",
      "Polish nuance, tone and stylistic variety in your writing",
      "Consider an official certificate such as Cambridge C2 Proficiency or IELTS",
    ],
  },
};
