import type { Paper } from "./papers";

export interface Contributor {
  /** Display name: full name when known, otherwise the credit as written. */
  name: string;
  /** Image key: public/contributors/<slug>.jpg. */
  slug: string;
  initials: string;
}

export interface Credit {
  /** At most the first three listed contributors. */
  shown: Contributor[];
  /** How many further named contributors were cut, if any. */
  extra: number;
  /** The credit ended in "and others" (an unnamed longer author list). */
  openEnded: boolean;
}

/**
 * Surname (as written in papers.ts credits) to full name. Only people whose
 * identity is unambiguous in this list; the fetch script pulls their portrait
 * from Wikipedia under the full-name slug.
 */
const FULL_NAMES: Record<string, string> = {
  Chen: "Xi Chen",
  Kingma: "Diederik P. Kingma",
  Salimans: "Tim Salimans",
  "van Camp": "Drew van Camp",
  Ouellette: "Lauren Ouellette",
  Thomas: "Joy A. Thomas",
  Johnson: "Justin Johnson",
  Zhang: "Xiangyu Zhang",
  Ren: "Shaoqing Ren",
  Yu: "Fisher Yu",
  Koltun: "Vladlen Koltun",
  Ananthanarayanan: "Sundaram Ananthanarayanan",
  Santoro: "Adam Santoro",
  Raposo: "David Raposo",
  Barrett: "David G. T. Barrett",
  Wayne: "Greg Wayne",
  Danihelka: "Ivo Danihelka",
  Kudlur: "Manjunath Kudlur",
  Faulkner: "Ryan Faulkner",
  Parmar: "Niki Parmar",
  Bahdanau: "Dzmitry Bahdanau",
  Fortunato: "Meire Fortunato",
  Jaitly: "Navdeep Jaitly",
  Gilmer: "Justin Gilmer",
  Schoenholz: "Samuel S. Schoenholz",
  Riley: "Patrick F. Riley",
  McCandlish: "Sam McCandlish",
  Huang: "Yanping Huang",
  Cheng: "Youlong Cheng",
  Hinton: "Geoffrey Hinton",
  Aaronson: "Scott Aaronson",
  Carroll: "Sean M. Carroll",
  Cover: "Thomas M. Cover",
  Grunwald: "Peter Grunwald",
  Legg: "Shane Legg",
  Karpathy: "Andrej Karpathy",
  Li: "Fei-Fei Li",
  Krizhevsky: "Alex Krizhevsky",
  Sutskever: "Ilya Sutskever",
  He: "Kaiming He",
  Sun: "Jian Sun",
  Zaremba: "Wojciech Zaremba",
  Vinyals: "Oriol Vinyals",
  Amodei: "Dario Amodei",
  Graves: "Alex Graves",
  Bengio: "Yoshua Bengio",
  Vaswani: "Ashish Vaswani",
  Shazeer: "Noam Shazeer",
  Cho: "Kyunghyun Cho",
  Kaplan: "Jared Kaplan",
};

/** Same-surname people who differ by paper. */
const PER_PAPER: Record<string, Record<string, string>> = {
  "order-matters": { Bengio: "Samy Bengio" },
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toContributor(written: string, paperSlug: string): Contributor {
  // Credits written out in full ("Scott Aaronson") resolve to themselves.
  const name = PER_PAPER[paperSlug]?.[written] ?? FULL_NAMES[written] ?? written;
  return {
    name,
    slug: slugify(name),
    initials: name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };
}

/** Parse a paper's author credit into at most three contributors. */
export function creditFor(paper: Paper): Credit {
  // Drop parenthetical notes like "(Stanford)" or "(PhD dissertation)".
  const cleaned = paper.authors.replace(/\s*\([^)]*\)/g, "").trim();
  const parts = cleaned
    .split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const openEnded = /^others?$/i.test(parts[parts.length - 1] ?? "");
  const named = openEnded ? parts.slice(0, -1) : parts;
  return {
    shown: named.slice(0, 3).map((n) => toContributor(n, paper.slug)),
    extra: Math.max(0, named.length - 3),
    openEnded,
  };
}

/**
 * Names whose Wikipedia title belongs to a different, more famous person
 * (e.g. "Xi Chen" the politician, "Justin Johnson" the NFL player). The
 * fetch script must not pull portraits for these; they keep initials.
 */
const AMBIGUOUS_ON_WIKIPEDIA = new Set([
  "Xi Chen",
  "Justin Johnson",
  "Fisher Yu",
  "Xiangyu Zhang",
  "Shaoqing Ren",
  "Yanping Huang",
  "Youlong Cheng",
  "Joy A. Thomas",
  "Lauren Ouellette",
  "Greg Wayne",
  "Ryan Faulkner",
  "Patrick F. Riley",
]);

/** Everyone the fetch script should try to find a portrait for. */
export const PORTRAIT_NAMES: string[] = [
  ...new Set([
    ...Object.values(FULL_NAMES).filter((n) => !AMBIGUOUS_ON_WIKIPEDIA.has(n)),
    ...Object.values(PER_PAPER).flatMap((m) => Object.values(m)),
    // Credits written out in full in papers.ts.
    "Christopher Olah",
    "Sasha Rush",
    "Dzmitry Bahdanau",
  ]),
];
