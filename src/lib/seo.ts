import type { Paper } from "../data/papers";
import { SITE, absoluteUrl } from "./site";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function homeMeta(): PageMeta {
  return {
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      description: SITE.description,
      url: absoluteUrl("/"),
    },
  };
}

export function paperMeta(paper: Paper): PageMeta {
  const description = `${paper.blurb} Read the full text with beginner-friendly term explanations.`;
  const path = `/papers/${paper.slug}`;

  return {
    title: `${paper.title} · ${SITE.name}`,
    description,
    path,
    image: `/thumbnails/${paper.slug}.webp`,
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: paper.title, item: absoluteUrl(path) },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ScholarlyArticle",
        headline: paper.title,
        description: paper.blurb,
        author: paper.authors.split(",").map((name) => ({
          "@type": "Person",
          name: name.trim(),
        })),
        datePublished: String(paper.year),
        url: absoluteUrl(path),
        isPartOf: { "@type": "WebSite", name: SITE.name, url: absoluteUrl("/") },
        image: absoluteUrl(`/thumbnails/${paper.slug}.webp`),
      },
    ],
  };
}

export function notFoundMeta(): PageMeta {
  return {
    title: `Page not found · ${SITE.name}`,
    description: "This page is not in the reading list.",
    path: "/404",
    noindex: true,
  };
}
