# 30 papers — landing-page redesign (autonomous build brief)

This file is the durable brief for an autonomous agent (local `/loop` or a Claude
cloud routine) continuing the landing-page redesign. Read it fully before each
iteration. It is intentionally in-repo so a cloud run with no access to local
memory or scratchpad still has the full context.

## Hard constraints (from the owner, 2026-06-28)
- NO photographic images, and NO halftones of photos. Do not use anything under
  `art-sources/`. The look must be drawn/typeset, not photographic.
- KEEP ONLY two things from the prior landing page: the name **"30 papers"**, and
  the idea of a **vertical list of the paper thumbnail images down the page**
  (thumbnails live in `public/thumbnails/<slug>.png`).
- Goal: extremely beautiful, tasteful, a Stripe-Press-tier homage to these AI
  papers. Full creative control within these rules.
- Avoid AI tropes: no purple gradients, no navy + gold, no wide letter-spacing,
  no "scroll" filler text, no arbitrary numbering, and no em-dashes anywhere in
  prose (run `npm run check:emdash`).

## Design direction (decided)
A "printed monograph / specimen." The site is set in **Computer Modern** (the
LaTeX typeface the papers themselves use; `"CMU Serif"` is loaded) — that shared
typeface IS the core homage. The visual language is **precise, thin line-art
figures drawn from the papers** (attention arcs, residual streams, recurrence
unrolls, message-passing graphs, scaling-law curves) — never dotty generative
noise (explicitly rejected) and never photos.
- Cover / hero: deep warm ink (`#0e0e0d`), warm paper-white Computer Modern
  "30 papers" revealed via the token-stream effect, a clean animated line-art
  attention figure behind it. (DONE — `src/components/Hero.tsx` +
  `src/components/CoverFigure.tsx`.)
- Body: warm off-white "paper", the existing paper thumbnails kept, restyled as
  elegant typeset rows (serif title, mono author/year, blurb, a small per-paper
  line-art glyph). One restrained warm accent. Cover dark, body light.

## To replace / remove
- `src/components/MotifCanvas.tsx` + `src/lib/motifs.ts` — the old dotty
  generative motifs. Replace with a thin line-art figure system.
- `src/components/PaperSection.tsx` (full-viewport-per-paper) is too heavy; the
  27 papers should become a calmer, elegant typeset list that keeps thumbnails.
- `src/pages/Home.tsx` currently renders `<Hero/>` + `<PaperGrid/>`.

## Iteration checklist (tick the box you complete, commit, then stop)
- [x] 1. Cover hero: CoverFigure line-art + Computer Modern + token-stream.
- [ ] 2. Line-art figure system: a `LineFigure` component + ~6 figure fns
      (attention, residual, recurrence, message-passing graph, scaling-law,
      memory-tape), crisp 1px strokes; map each paper slug to one (replace the
      `motifFor` map in `src/lib/motifs.ts`).
- [ ] 3. Redesign the paper list (keep `public/thumbnails`): elegant typeset rows
      — serif title, mono author/year, blurb, per-paper line glyph, generous
      rhythm. Replace `PaperSection`/`PaperGrid`. Tasteful, not 27 full screens.
- [ ] 4. Page structure: short intro/colophon under the hero; optional thematic
      dividers (Compression / Vision / Sequences / Attention / Scale) in line-art.
- [ ] 5. Palette + type tokens in `tailwind.config.js` (cover ink, warm paper,
      accent); apply consistently. Refine hero so arcs never sit under the
      subtitle text.
- [ ] 6. Motion + interaction: scroll fade-ups (there is an `animate-fade-up`
      keyframe and `src/lib/useInView.ts`), hover states, full reduced-motion
      support.
- [ ] 7. Responsive pass: mobile + desktop, `object-fit` on thumbnails, no
      horizontal scroll.
- [ ] 8. Final QA: `npm run build` (tsc + vite) clean, `npm run check:emdash`
      clean, a11y (alt/aria/contrast), and a visual review.

## How to verify each iteration (cloud-safe)
- Always run `npx tsc --noEmit` and fix all type errors before committing.
- Run `npm run build` to catch real build failures.
- For a visual check in a cloud environment (no chrome extension), you may build
  and serve (`npm run build && npm run preview`) and screenshot with a headless
  browser if one is available; otherwise rely on careful code + the build. A
  local run can instead screenshot the dev server (it serves on a Vite port,
  e.g. localhost:5173/5174).
- Keep each iteration self-contained: one checklist item, then commit with a
  clear message and stop.

## Working agreement for autonomous commits
- Commit after each completed iteration with a descriptive message; do not leave
  the build broken between commits. Small, reviewable commits.
