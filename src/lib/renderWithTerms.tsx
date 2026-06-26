import { Fragment, type ReactNode } from "react";
import parse, { type HTMLReactParserOptions } from "html-react-parser";
import type { Term } from "../content/types";
import TermBubble from "../components/TermBubble";

/** Tags whose text should never be turned into a term bubble. */
const EXCLUDED_TAGS = new Set([
  "a",
  "code",
  "pre",
  "script",
  "style",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "math",
  "button",
]);

/** Ancestor class fragments that signal rendered math we should leave alone. */
const EXCLUDED_CLASS_HINTS = ["katex", "ltx_Math", "mwe-math"];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Matcher {
  regex: RegExp | null;
  surfaceToTerm: Map<string, Term>;
}

function buildMatcher(terms: Term[]): Matcher {
  const surfaceToTerm = new Map<string, Term>();
  const surfaces: string[] = [];
  for (const t of terms) {
    for (const form of [t.term, ...(t.aliases ?? [])]) {
      const key = form.toLowerCase();
      if (!surfaceToTerm.has(key)) {
        surfaceToTerm.set(key, t);
        surfaces.push(form);
      }
    }
  }
  // Longest first so multi-word terms win over their substrings.
  surfaces.sort((a, b) => b.length - a.length);
  const pattern = surfaces.map(escapeRegExp).join("|");
  const regex = pattern
    ? new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, "giu")
    : null;
  return { regex, surfaceToTerm };
}

// domhandler nodes are loosely typed here to keep the traversal readable.
function hasExcludedAncestor(node: any): boolean {
  let current = node?.parent;
  while (current) {
    if (current.type === "tag") {
      if (EXCLUDED_TAGS.has(current.name)) return true;
      const cls: string = current.attribs?.class ?? "";
      if (EXCLUDED_CLASS_HINTS.some((h) => cls.includes(h))) return true;
    }
    current = current.parent;
  }
  return false;
}

function wrapText(
  text: string,
  matcher: Matcher,
  used: Set<string>
): ReactNode | null {
  const { regex, surfaceToTerm } = matcher;
  if (!regex) return null;
  regex.lastIndex = 0;
  const out: ReactNode[] = [];
  let last = 0;
  let changed = false;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const surface = m[1];
    const term = surfaceToTerm.get(surface.toLowerCase());
    if (!term || used.has(term.term)) continue;
    used.add(term.term);
    changed = true;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <TermBubble key={`${term.term}-${m.index}`} term={term}>
        {surface}
      </TermBubble>
    );
    last = m.index + surface.length;
  }
  if (!changed) return null;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Parse a paper's HTML body and wrap the first occurrence of each curated term
 * in an interactive bubble. Math, code, headings, and existing links are left
 * untouched. Returns React nodes ready to render inside `.prose-paper`.
 */
export function renderWithTerms(html: string, terms: Term[]): ReactNode {
  const matcher = buildMatcher(terms);
  const used = new Set<string>();

  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type !== "text") return undefined;
      if (hasExcludedAncestor(domNode)) return undefined;
      const wrapped = wrapText(domNode.data as string, matcher, used);
      if (wrapped === null) return undefined;
      return <Fragment>{wrapped}</Fragment>;
    },
  };

  return parse(html, options);
}
