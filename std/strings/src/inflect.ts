// Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
// MIT Licensed
// https://github.com/dreamerslab/node.inflection/blob/master/LICENSE

const uncountableWords = [
  "accommodation",
  "adulthood",
  "advertising",
  "advice",
  "aggression",
  "aid",
  "air",
  "aircraft",
  "alcohol",
  "anger",
  "applause",
  "arithmetic",
  "assistance",
  "athletics",
  "bacon",
  "baggage",
  "beef",
  "biology",
  "blood",
  "botany",
  "bread",
  "butter",
  "carbon",
  "cardboard",
  "cash",
  "chalk",
  "chaos",
  "chess",
  "crossroads",
  "countryside",
  "dancing",
  "deer",
  "dignity",
  "dirt",
  "dust",
  "economics",
  "education",
  "electricity",
  "engineering",
  "enjoyment",
  "envy",
  "equipment",
  "ethics",
  "evidence",
  "evolution",
  "fame",
  "fiction",
  "flour",
  "flu",
  "food",
  "fuel",
  "fun",
  "furniture",
  "gallows",
  "garbage",
  "garlic",
  "genetics",
  "gold",
  "golf",
  "gossip",
  "gratitude",
  "grief",
  "guilt",
  "gymnastics",
  "happiness",
  "hardware",
  "harm",
  "hate",
  "hatred",
  "health",
  "heat",
  "help",
  "homework",
  "honesty",
  "honey",
  "hospitality",
  "housework",
  "humour",
  "hunger",
  "hydrogen",
  "ice",
  "importance",
  "inflation",
  "information",
  "innocence",
  "iron",
  "irony",
  "jam",
  "jewelry",
  "judo",
  "karate",
  "knowledge",
  "lack",
  "laughter",
  "lava",
  "leather",
  "leisure",
  "lightning",
  "linguine",
  "linguini",
  "linguistics",
  "literature",
  "litter",
  "livestock",
  "logic",
  "loneliness",
  "luck",
  "luggage",
  "macaroni",
  "machinery",
  "magic",
  "management",
  "mankind",
  "marble",
  "mathematics",
  "mayonnaise",
  "measles",
  "methane",
  "milk",
  "minus",
  "money",
  "mud",
  "music",
  "mumps",
  "nature",
  "news",
  "nitrogen",
  "nonsense",
  "nurture",
  "nutrition",
  "obedience",
  "obesity",
  "oxygen",
  "pasta",
  "patience",
  "physics",
  "poetry",
  "pollution",
  "poverty",
  "pride",
  "psychology",
  "publicity",
  "punctuation",
  "quartz",
  "racism",
  "relaxation",
  "reliability",
  "research",
  "respect",
  "revenge",
  "rice",
  "rubbish",
  "rum",
  "safety",
  "scenery",
  "seafood",
  "seaside",
  "series",
  "shame",
  "sheep",
  "shopping",
  "sleep",
  "smoke",
  "smoking",
  "snow",
  "soap",
  "software",
  "soil",
  "spaghetti",
  "species",
  "steam",
  "stuff",
  "stupidity",
  "sunshine",
  "symmetry",
  "tennis",
  "thirst",
  "thunder",
  "timber",
  "traffic",
  "transportation",
  "trust",
  "underwear",
  "unemployment",
  "unity",
  "validity",
  "veal",
  "vegetation",
  "vegetarianism",
  "vengeance",
  "violence",
  "vitality",
  "warmth",
  "wealth",
  "weather",
  "welfare",
  "wheat",
  "wildlife",
  "wisdom",
  "yoga",
  "zinc",
  "zoology",
];

const regex = {
  plural: {
    men: /^(m|wom)en$/gi,
    people: /(pe)ople$/gi,
    children: /(child)ren$/gi,
    tia: /([ti])a$/gi,
    analyses: /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi,
    databases: /(database)s$/gi,
    drives: /(drive)s$/gi,
    hives: /(hi|ti)ves$/gi,
    curves: /(curve)s$/gi,
    lrves: /([lr])ves$/gi,
    aves: /([a])ves$/gi,
    foves: /([^fo])ves$/gi,
    movies: /(m)ovies$/gi,
    aeiouyies: /([^aeiouy]|qu)ies$/gi,
    series: /(s)eries$/gi,
    xes: /(x|ch|ss|sh)es$/gi,
    mice: /([m|l])ice$/gi,
    buses: /(bus)es$/gi,
    oes: /(o)es$/gi,
    shoes: /(shoe)s$/gi,
    crises: /(cris|ax|test)es$/gi,
    octopuses: /(octop|vir)uses$/gi,
    aliases: /(alias|canvas|status|campus)es$/gi,
    summonses: /^(summons|bonus)es$/gi,
    oxen: /^(ox)en/gi,
    matrices: /(matr)ices$/gi,
    vertices: /(vert|ind)ices$/gi,
    feet: /^feet$/gi,
    teeth: /^teeth$/gi,
    geese: /^geese$/gi,
    quizzes: /(quiz)zes$/gi,
    whereases: /^(whereas)es$/gi,
    criteria: /^(criteri)a$/gi,
    genera: /^genera$/gi,
    ss: /ss$/gi,
    s: /s$/gi,
  },
  singular: {
    man: /^(m|wom)an$/gi,
    person: /(pe)rson$/gi,
    child: /(child)$/gi,
    drive: /(drive)$/gi,
    ox: /^(ox)$/gi,
    axis: /(ax|test)is$/gi,
    octopus: /(octop|vir)us$/gi,
    alias: /(alias|status|canvas|campus)$/gi,
    summons: /^(summons|bonus)$/gi,
    bus: /(bu)s$/gi,
    buffalo: /(buffal|tomat|potat)o$/gi,
    tium: /([ti])um$/gi,
    sis: /sis$/gi,
    ffe: /(?:([^f])fe|([lr])f)$/gi,
    focus: /^(focus)$/gi,
    hive: /(hi|ti)ve$/gi,
    aeiouyy: /([^aeiouy]|qu)y$/gi,
    x: /(x|ch|ss|sh)$/gi,
    matrix: /(matr)ix$/gi,
    vertex: /(vert|ind)ex$/gi,
    mouse: /([m|l])ouse$/gi,
    foot: /^foot$/gi,
    tooth: /^tooth$/gi,
    goose: /^goose$/gi,
    quiz: /(quiz)$/gi,
    whereas: /^(whereas)$/gi,
    criterion: /^(criteri)on$/gi,
    genus: /^genus$/gi,
    s: /s$/gi,
    common: /$/gi,
  },
};

const pluralRules: [RegExp, string?][] = [
  [regex.plural.men],
  [regex.plural.people],
  [regex.plural.children],
  [regex.plural.tia],
  [regex.plural.analyses],
  [regex.plural.databases],
  [regex.plural.drives],
  [regex.plural.hives],
  [regex.plural.curves],
  [regex.plural.lrves],
  [regex.plural.foves],
  [regex.plural.aeiouyies],
  [regex.plural.series],
  [regex.plural.movies],
  [regex.plural.xes],
  [regex.plural.mice],
  [regex.plural.buses],
  [regex.plural.oes],
  [regex.plural.shoes],
  [regex.plural.crises],
  [regex.plural.octopuses],
  [regex.plural.aliases],
  [regex.plural.summonses],
  [regex.plural.oxen],
  [regex.plural.matrices],
  [regex.plural.vertices],
  [regex.plural.feet],
  [regex.plural.teeth],
  [regex.plural.geese],
  [regex.plural.quizzes],
  [regex.plural.whereases],
  [regex.plural.criteria],
  [regex.plural.genera],
  [regex.singular.man, "$1en"],
  [regex.singular.person, "$1ople"],
  [regex.singular.child, "$1ren"],
  [regex.singular.drive, "$1s"],
  [regex.singular.ox, "$1en"],
  [regex.singular.axis, "$1es"],
  [regex.singular.octopus, "$1uses"],
  [regex.singular.alias, "$1es"],
  [regex.singular.summons, "$1es"],
  [regex.singular.bus, "$1ses"],
  [regex.singular.buffalo, "$1oes"],
  [regex.singular.tium, "$1a"],
  [regex.singular.sis, "ses"],
  [regex.singular.ffe, "$1$2ves"],
  [regex.singular.focus, "$1es"],
  [regex.singular.hive, "$1ves"],
  [regex.singular.aeiouyy, "$1ies"],
  [regex.singular.matrix, "$1ices"],
  [regex.singular.vertex, "$1ices"],
  [regex.singular.x, "$1es"],
  [regex.singular.mouse, "$1ice"],
  [regex.singular.foot, "feet"],
  [regex.singular.tooth, "teeth"],
  [regex.singular.goose, "geese"],
  [regex.singular.quiz, "$1zes"],
  [regex.singular.whereas, "$1es"],
  [regex.singular.criterion, "$1a"],
  [regex.singular.genus, "genera"],
  [regex.singular.s, "s"],
  [regex.singular.common, "s"],
];

const singularRules: [RegExp, string?][] = [
  [regex.singular.man],
  [regex.singular.person],
  [regex.singular.child],
  [regex.singular.drive],
  [regex.singular.ox],
  [regex.singular.axis],
  [regex.singular.octopus],
  [regex.singular.alias],
  [regex.singular.summons],
  [regex.singular.bus],
  [regex.singular.buffalo],
  [regex.singular.tium],
  [regex.singular.sis],
  [regex.singular.ffe],
  [regex.singular.focus],
  [regex.singular.hive],
  [regex.singular.aeiouyy],
  [regex.singular.x],
  [regex.singular.matrix],
  [regex.singular.vertex],
  [regex.singular.mouse],
  [regex.singular.foot],
  [regex.singular.tooth],
  [regex.singular.goose],
  [regex.singular.quiz],
  [regex.singular.whereas],
  [regex.singular.criterion],
  [regex.singular.genus],
  [regex.plural.men, "$1an"],
  [regex.plural.people, "$1rson"],
  [regex.plural.children, "$1"],
  [regex.plural.databases, "$1"],
  [regex.plural.drives, "$1"],
  [regex.plural.genera, "genus"],
  [regex.plural.criteria, "$1on"],
  [regex.plural.tia, "$1um"],
  [regex.plural.analyses, "$1$2sis"],
  [regex.plural.hives, "$1ve"],
  [regex.plural.curves, "$1"],
  [regex.plural.lrves, "$1f"],
  [regex.plural.aves, "$1ve"],
  [regex.plural.foves, "$1fe"],
  [regex.plural.movies, "$1ovie"],
  [regex.plural.aeiouyies, "$1y"],
  [regex.plural.series, "$1eries"],
  [regex.plural.xes, "$1"],
  [regex.plural.mice, "$1ouse"],
  [regex.plural.buses, "$1"],
  [regex.plural.oes, "$1"],
  [regex.plural.shoes, "$1"],
  [regex.plural.crises, "$1is"],
  [regex.plural.octopuses, "$1us"],
  [regex.plural.aliases, "$1"],
  [regex.plural.summonses, "$1"],
  [regex.plural.oxen, "$1"],
  [regex.plural.matrices, "$1ix"],
  [regex.plural.vertices, "$1ex"],
  [regex.plural.feet, "foot"],
  [regex.plural.teeth, "tooth"],
  [regex.plural.geese, "goose"],
  [regex.plural.quizzes, "$1"],
  [regex.plural.whereases, "$1"],
  [regex.plural.ss, "ss"],
  [regex.plural.s, ""],
];

function applyRules(
  str: string,
  rules: [RegExp, string?][],
  skip: string[],
  override?: string,
): string {
  if (override) {
    return override;
  }

  if (skip.includes(str.toLocaleLowerCase())) {
    return str;
  }

  for (const rule of rules) {
    if (str.match(rule[0])) {
      if (rule[1] !== undefined) {
        return str.replace(rule[0], rule[1]);
      }

      return str;
    }
  }

  return str;
}

/**
 * Converts a singular English noun to its plural form.
 * @param str The word to pluralize.
 * @param plural Optional override returned instead of applying rules.
 * @returns The pluralized word.
 * @example
 * ```typescript
 * import { pluralize } from "@neostd/strings";
 *
 * pluralize("person"); // "people"
 * pluralize("person", "folks"); // "folks"
 * ```
 */
export function pluralize(str: string, plural?: string): string {
  return applyRules(str, pluralRules, uncountableWords, plural);
}

/**
 * Converts a plural English noun to its singular form.
 * @param str The word to singularize.
 * @param singular Optional override returned instead of applying rules.
 * @returns The singularized word.
 * @example
 * ```typescript
 * import { singularize } from "@neostd/strings";
 *
 * singularize("people"); // "person"
 * singularize("people", "human"); // "human"
 * ```
 */
export function singularize(str: string, singular?: string): string {
  return applyRules(str, singularRules, uncountableWords, singular);
}

/**
 * Converts a word to singular or plural form based on a count.
 * @param str The word to inflect.
 * @param count The count used to choose singular (`1`) or plural (all other numbers).
 * @param singular Optional singular override.
 * @param plural Optional plural override.
 * @returns The inflected word.
 * @example
 * ```typescript
 * import { inflect } from "@neostd/strings";
 *
 * inflect("people", 1); // "person"
 * inflect("person", 2); // "people"
 * ```
 */
export function inflect(str: string, count: number, singular?: string, plural?: string): string {
  if (Number.isNaN(count)) {
    return str;
  }

  if (count === 1) {
    return applyRules(str, singularRules, uncountableWords, singular);
  }

  return applyRules(str, pluralRules, uncountableWords, plural);
}
