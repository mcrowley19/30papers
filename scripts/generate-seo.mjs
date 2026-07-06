#!/usr/bin/env node
// Generates robots.txt and sitemap.xml, then prerenders route-specific HTML
// shells so crawlers and link previews see per-page meta tags without JS.
//
// Run after `vite build`. Set VITE_SITE_URL (or SITE_URL) to your production origin.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const papersTs = readFileSync(path.join(root, "src/data/papers.ts"), "utf8");

const SITE = {
  name: "30 papers",
  tagline: "The reading list Ilya Sutskever gave John Carmack",
  description:
    "A curated reading list of foundational AI and deep learning papers, hosted in full with plain-language explanations of difficult terms.",
};

const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://30papers.com").replace(
  /\/$/,
  ""
);

function parsePapers(source) {
  return source
    .split(/\{\s*slug:/)
    .slice(1)
    .map((block) => {
      const slug = block.match(/^\s*"([^"]+)"/)?.[1];
      const title = block.match(/title:\s*"([^"]+)"/)?.[1];
      const authors = block.match(/authors:\s*"([^"]+)"/)?.[1];
      const year = Number(block.match(/year:\s*(\d+)/)?.[1]);
      const blurb =
        block.match(/blurb:\s*\n\s*"([^"]+)"/)?.[1] ?? block.match(/blurb:\s*"([^"]+)"/)?.[1];
      return { slug, title, authors, year, blurb };
    })
    .filter((p) => p.slug && p.title && p.blurb);
}

function absoluteUrl(origin, pathname) {
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function homeMeta(origin) {
  return {
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    path: "/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      description: SITE.description,
      url: absoluteUrl(origin, "/"),
    },
  };
}

function paperMeta(origin, paper) {
  const path = `/papers/${paper.slug}`;
  const description = `${paper.blurb} Read the full text with beginner-friendly term explanations.`;
  const image = `/thumbnails/${paper.slug}.webp`;

  return {
    title: `${paper.title} · ${SITE.name}`,
    description,
    path,
    image,
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: absoluteUrl(origin, "/") },
          { "@type": "ListItem", position: 2, name: paper.title, item: absoluteUrl(origin, path) },
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
        url: absoluteUrl(origin, path),
        isPartOf: { "@type": "WebSite", name: SITE.name, url: absoluteUrl(origin, "/") },
        image: absoluteUrl(origin, image),
      },
    ],
  };
}

function headTags(origin, meta) {
  const url = absoluteUrl(origin, meta.path);
  const image = meta.image ? absoluteUrl(origin, meta.image) : null;
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:locale" content="en_US" />`,
  ];

  if (image) {
    lines.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
    lines.push(`<meta name="twitter:image" content="${escapeHtml(image)}" />`);
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  } else {
    lines.push(`<meta name="twitter:card" content="summary" />`);
  }

  lines.push(`<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  lines.push(
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  );

  if (meta.jsonLd) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`
    );
  }

  return lines.join("\n    ");
}

function injectHead(html, headContent) {
  return html.replace(/<head>\s*([\s\S]*?)<\/head>/, (_match, inner) => {
    let cleaned = inner
      .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
      .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/gi, "")
      .replace(/<meta\s+name="robots"[\s\S]*?\/>\s*/gi, "");
    return `<head>\n    ${headContent}\n${cleaned.trim()}\n  </head>`;
  });
}

function writeRouteHtml(distPath, html) {
  mkdirSync(path.dirname(distPath), { recursive: true });
  writeFileSync(distPath, html);
}

function writePublicSeo(origin, papers) {
  const publicDir = path.join(root, "public");
  const robots = siteUrl
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : "User-agent: *\nAllow: /\n";
  writeFileSync(path.join(publicDir, "robots.txt"), robots);

  const urls = [
    { loc: absoluteUrl(origin, "/"), priority: "1.0" },
    ...papers.map((paper) => ({
      loc: absoluteUrl(origin, `/papers/${paper.slug}`),
      priority: "0.8",
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
}

function main() {
  const mode = process.argv.includes("--prerender")
    ? "prerender"
    : process.argv.includes("--public")
      ? "public"
      : "all";

  const papers = parsePapers(papersTs);
  const origin = siteUrl;

  if (mode === "public" || mode === "all") {
    writePublicSeo(origin, papers);
  }

  if (mode === "public") return;

  if (!existsSync(path.join(distDir, "index.html"))) {
    if (mode === "prerender") {
      console.error("generate-seo: dist/index.html not found");
      process.exit(1);
    }
    console.warn("generate-seo: dist/index.html not found; skipping prerender shells");
    return;
  }

  const baseHtml = readFileSync(path.join(distDir, "index.html"), "utf8");
  const homeHtml = injectHead(baseHtml, headTags(origin, homeMeta(origin)));
  writeFileSync(path.join(distDir, "index.html"), homeHtml);

  for (const paper of papers) {
    const html = injectHead(baseHtml, headTags(origin, paperMeta(origin, paper)));
    writeRouteHtml(path.join(distDir, "papers", paper.slug, "index.html"), html);
  }

  console.log(
    `generate-seo: ${mode === "all" ? "wrote public files and " : ""}prerendered ${papers.length + 1} HTML shells`
  );
}

main();
