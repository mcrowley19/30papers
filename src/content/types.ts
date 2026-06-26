/**
 * A curated hard term for a single paper. Definitions are written for a
 * beginner and must not contain em-dashes (enforced by scripts/check-emdash.mjs).
 */
export interface Term {
  /** The canonical phrase as it should appear in the side panel heading. */
  term: string;
  /**
   * Surface forms to match inside the paper body, case-insensitive. The first
   * matched occurrence (across term + aliases) becomes the clickable bubble.
   * If omitted, `term` itself is used.
   */
  aliases?: string[];
  /** Beginner-friendly, academically grounded explanation. No em-dashes. */
  definition: string;
}

export type TermList = Term[];
