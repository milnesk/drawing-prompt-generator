export const subjects = [
  "astronaut", "octopus", "grandma", "robot", "wizard", "pigeon", "ghost",
  "mailman", "dragon", "toaster", "mermaid", "detective", "sloth", "snowman",
  "librarian", "alien", "knight", "frog prince", "scarecrow", "garden gnome",
];

export const actions = [
  "floating with", "arguing with", "hiding behind", "chasing", "balancing on",
  "pointing at", "emerging from", "dancing with", "whispering to", "wrestling",
  "befriending", "painting", "juggling", "riding", "ignoring",
];

export const moods = [
  "eerie", "whimsical", "melancholy", "chaotic", "dreamy", "absurd",
  "tense", "cozy", "mischievous", "serene", "ominous", "joyful",
];

export const settings = [
  "in outer space", "at a bus stop", "underwater", "in a dream",
  "at a funeral", "inside a vending machine", "on a rooftop",
  "in a haunted library", "at the DMV", "in a cereal bowl", "on the moon",
  "in a cathedral", "at a laundromat", "inside a snow globe",
  "at the bottom of a well",
];

export const styleHints = [
  "in the style of a 90s cartoon", "like a tarot card", "as a Renaissance painting",
  "like a newspaper comic strip", "as a children's book illustration",
  "like a woodblock print", "in the style of a Saturday morning cartoon",
  "as a stained glass window", "like a noir film still", "as a Studio Ghibli scene",
  "like a botanical sketch", "as graffiti",
];

export type PromptParts = {
  subject: string;
  action: string;
  subject2: string;
  mood: string;
  setting: string;
  styleHint: string;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function rollPrompt(): PromptParts {
  const subject = pick(subjects);
  let subject2 = pick(subjects);
  while (subject2 === subject) subject2 = pick(subjects);
  return {
    subject,
    action: pick(actions),
    subject2,
    mood: pick(moods),
    setting: pick(settings),
    styleHint: pick(styleHints),
  };
}

export function assembleSentence(p: PromptParts): string {
  return `A ${p.subject} ${p.action} a ${p.subject2}, ${p.mood}, ${p.setting}, ${p.styleHint}.`;
}

export const categoryWords = {
  subject: subjects,
  action: actions,
  subject2: subjects,
  mood: moods,
  setting: settings,
  styleHint: styleHints,
} as const;

export type CategoryKey = keyof typeof categoryWords;
