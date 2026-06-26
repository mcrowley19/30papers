# 30 papers

A reading list site for getting current with modern AI, based on the well-known
Sutskever reading list. The landing page greets you with **"30 papers"** on a
pure white page; scrolling reveals a minimised image of each paper that extends
a black panel with a short description on hover. Clicking opens a full reader
page hosted on this site, where difficult terms are wrapped in a bubble that
opens a side panel explaining them in plain language.

Built with **Vite + React (TypeScript) + Tailwind**.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Because it is a single-page app, configure your static host to fall back to
`index.html` for unknown routes so deep links like `/papers/gpipe` resolve.

## How content works

Each paper is two files keyed by its slug (see `src/data/papers.ts`):

- `src/content/papers/<slug>.html` — the full paper body, self-hosted.
- `src/content/terms/<slug>.ts` — the curated hard terms and their beginner
  friendly definitions.

Both are loaded lazily per route via `import.meta.glob`, so a reader page only
downloads the paper it shows. Term bubbles are injected at render time by
`src/lib/renderWithTerms.tsx`, which wraps the first occurrence of each term in
the body and leaves math, code, and headings untouched.

Term definitions must not contain em-dashes:

```bash
npm run check:emdash
```

## Refreshing paper text

The full text and first-page thumbnails are produced by an ingestion pipeline:

```bash
npm run fetch:papers                 # all papers, skip ones already present
npm run fetch:papers -- --force      # re-ingest everything
npm run fetch:papers -- --only=gpipe # a single paper
```

It pulls arXiv papers as HTML (via ar5iv, falling back to PDF text), scrapes the
blog and course-note sources, extracts text from PDF-only papers, self-hosts all
images under `public/figures/<slug>/`, and renders thumbnails into
`public/thumbnails/<slug>.png`. Sources live in `scripts/lib/manifest.mjs`.

## Notes

- Two-column PDF-only papers (AlexNet, the Hinton 1993 paper, the Kolmogorov
  chapter) are extracted with pdfjs and have some reading-order artifacts.
- Re-hosting full paper text has copyright implications for several items on the
  list; the highest-risk ones are the textbook chapter, the ACM paper, the
  NeurIPS paper, the Stanford notes, and the three personal blog posts.
