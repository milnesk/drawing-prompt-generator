export const subjects = [
  // people
  "astronaut", "grandma", "wizard", "mailman", "detective", "librarian", "knight",
  "lighthouse keeper", "tired barista", "circus clown", "retired pirate", "ballerina",
  "lonely chef", "door-to-door salesman", "fortune teller", "tax auditor",
  "substitute teacher", "park ranger", "mall santa", "competitive eater",
  // creatures
  "octopus", "pigeon", "ghost", "dragon", "mermaid", "sloth", "alien", "frog prince",
  "two-headed cat", "anxious werewolf", "tiny dinosaur", "philosophical moth",
  "bored cryptid", "swamp witch", "depressed vampire", "kraken",
  // objects / oddities
  "robot", "toaster", "snowman", "scarecrow", "garden gnome", "haunted teapot",
  "sentient lamp", "rubber duck army", "broken vending machine", "talking mailbox",
  "possessed bicycle", "ancient floppy disk", "self-aware sock", "rogue shopping cart",
  "cursed mirror", "melting clock",
];

export const actions = [
  "floating with", "arguing with", "hiding behind", "chasing", "balancing on",
  "pointing at", "emerging from", "dancing with", "whispering to", "wrestling",
  "befriending", "painting", "juggling", "riding", "ignoring",
  // expanded
  "interviewing", "stealing snacks from", "performing surgery on", "writing poetry about",
  "doing taxes with", "having a staring contest with", "selling insurance to",
  "trapped inside", "negotiating with", "carrying on its back", "knitting a sweater for",
  "translating for", "hypnotizing", "racing against", "marrying", "betraying",
  "delivering pizza to", "praying to", "crying in front of", "teaching yoga to",
  "cosplaying as", "ghosting", "haggling with", "babysitting", "filing a complaint against",
];

export const moods = [
  "eerie", "whimsical", "melancholy", "chaotic", "dreamy", "absurd",
  "tense", "cozy", "mischievous", "serene", "ominous", "joyful",
  // expanded
  "deeply confused", "suspiciously cheerful", "quietly menacing", "nostalgic",
  "feverish", "smug", "lovesick", "exhausted", "euphoric", "paranoid",
  "embarrassed", "triumphant", "haunted", "ridiculously dramatic", "hopeful",
  "pensive", "unhinged", "deadpan", "anxious", "blissfully ignorant",
  "righteously furious", "underwhelmed",
];

export const settings = [
  "in outer space", "at a bus stop", "underwater", "in a dream",
  "at a funeral", "inside a vending machine", "on a rooftop",
  "in a haunted library", "at the DMV", "in a cereal bowl", "on the moon",
  "in a cathedral", "at a laundromat", "inside a snow globe",
  "at the bottom of a well",
  // expanded
  "in a sketchy parking garage", "at a suburban birthday party", "inside a microwave",
  "at the edge of a volcano", "in a forgotten ball pit", "at an empty IKEA",
  "in a Victorian greenhouse", "on a sinking cruise ship", "in a kindergarten classroom",
  "at a roadside diner at 3am", "inside a pinball machine", "on a deserted island",
  "in a thrift store fitting room", "at the end of the universe", "in a giant teacup",
  "on top of a wedding cake", "inside an MRI machine", "at a haunted carnival",
  "in a Soviet-era apartment", "in the back of an empty bus", "inside a snow cave",
  "at a Renaissance fair", "on a tiny floating island", "in a forgotten subway tunnel",
  "at the gates of heaven (closed for renovations)", "in the cereal aisle at midnight",
  "inside a music box", "at a deeply awkward dinner party",
];

export const styleHints = [
  "in the style of a 90s cartoon", "like a tarot card", "as a Renaissance painting",
  "like a newspaper comic strip", "as a children's book illustration",
  "like a woodblock print", "in the style of a Saturday morning cartoon",
  "as a stained glass window", "like a noir film still", "as a Studio Ghibli scene",
  "like a botanical sketch", "as graffiti",
  // expanded
  "as a medieval tapestry", "like a vintage cereal box mascot", "as a Lisa Frank sticker",
  "in the style of cave paintings", "like a faded Polaroid", "as a Soviet propaganda poster",
  "like a charcoal life drawing", "as a kid's crayon drawing", "in the style of Hokusai",
  "like a 1950s pulp magazine cover", "as a low-poly video game model",
  "in the style of Edward Gorey", "like a punk zine", "as a Dutch still life",
  "like a watercolor postcard", "as ASCII art", "in the style of Where's Waldo",
  "like a Japanese ukiyo-e print", "as a tattoo flash sheet", "in pixel art",
  "like a New Yorker cartoon", "as an architectural blueprint", "like a fever dream",
  "as a museum diorama", "in the style of Bayeux Tapestry",
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
