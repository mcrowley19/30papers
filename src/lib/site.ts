/** Site-wide copy and URL used for canonical links, sitemaps, and social cards. */
export const SITE = {
  name: "30 papers",
  tagline: "The reading list Ilya Sutskever gave John Carmack",
  description:
    "A curated reading list of foundational AI and deep learning papers, hosted in full with plain-language explanations of difficult terms.",
  /** Production origin for canonical links, sitemaps, and social cards. */
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? "https://30papers.com",
} as const;

export function absoluteUrl(path: string): string {
  const base = SITE.url || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
