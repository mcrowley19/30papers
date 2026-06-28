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
- [x] 2. Line-art figure system: a `LineFigure` component + ~6 figure fns
      (attention, residual, recurrence, message-passing graph, scaling-law,
      memory-tape), crisp 1px strokes; map each paper slug to one (replace the
      `motifFor` map in `src/lib/motifs.ts`).
      DONE: added `src/lib/figures.ts` (`FigureKey` + `figureForSlug`/`figureFor`,
      all 27 slugs mapped) and `src/components/LineFigure.tsx` rendering 8 crisp
      SVG figures (attention, residual, recurrence, graph, scaling, memory, conv,
      compression) in `currentColor` with hairline `non-scaling-stroke`. Old
      dotty `motifs.ts`/`MotifCanvas` left in place; item 3 swaps the paper list
      onto `LineFigure` and removes them.
- [x] 3. Redesign the paper list (keep `public/thumbnails`): elegant typeset rows
      — serif title, mono author/year, blurb, per-paper line glyph, generous
      rhythm. Replace `PaperSection`/`PaperGrid`. Tasteful, not 27 full screens.
      DONE: new `src/components/PaperRow.tsx` sets each paper as a specimen row on
      warm paper (`#f3f0ea`): kept thumbnail left, CMU Serif title, Geist Mono
      author/year, serif blurb, a small per-paper `LineFigure` glyph in a warm
      sienna accent (`#a45a32`), with a "Read" link. `PaperGrid` is now a calm
      max-w-3xl column with hairline `#ddd7cc` rules between rows; `Home` body is
      light. Removed the old `PaperSection`, `MotifCanvas`, and dotty `motifs.ts`.
- [x] 4. Page structure: short intro/colophon under the hero; optional thematic
      dividers (Compression / Vision / Sequences / Attention / Scale) in line-art.
      DONE: new `src/components/Colophon.tsx` sits between `Hero` and `PaperGrid`
      on the warm paper. A mono sienna kicker ("The reading list"), a CMU Serif
      intro naming the threads (compression/complexity, vision, recurrence,
      attention, scale), then a hairline-ruled colophon note (the Computer Modern
      homage + line-art figures) beside a small `LineFigure`. Bridges the dark
      cover into the light list. Thematic dividers left optional/deferred.
- [x] 5. Palette + type tokens in `tailwind.config.js` (cover ink, warm paper,
      accent); apply consistently. Refine hero so arcs never sit under the
      subtitle text.
      DONE: replaced the stale pure-white/neutral tokens with the real monograph
      palette in `tailwind.config.js` — `cover` (`#0e0e0d` + `fg`/`soft`),
      `paper` (`#f3f0ea` + `raised`), `ink` (`#1a1916` + `soft`), `muted`,
      `faint`, `rule`, and `accent` (sienna `#a45a32` + `deep`; kept `accent.ink`
      alias so detail-page links still resolve). Swapped every hard-coded hex in
      `Hero`, `Colophon`, `PaperRow`, `PaperGrid` for these tokens and replaced
      the inline `CM`/`MONO` font styles with `font-serif`/`font-techmono`
      classes. This also unifies the detail pages onto the same warm palette.
      Refined the hero: `CoverFigure` baseline moved to `0.38h` with a lower arc
      cap so the attention arcs arch above the masthead, and the vignette is
      recentred to `50% 34%` so the lower half stays clean and the subtitle never
      reads over the arcs.
- [x] 6. Motion + interaction: scroll fade-ups (there is an `animate-fade-up`
      keyframe and `src/lib/useInView.ts`), hover states, full reduced-motion
      support.
      DONE: wired the unused `animate-fade-up` + `useInView` into a new
      `src/components/Reveal.tsx` that fades/rises blocks the first time they
      scroll into view (the `opacity-0` base sits under the animation so an
      optional `delay` holds it hidden instead of flashing). Each `PaperRow` now
      reveals on scroll and the `Colophon` reveals its kicker/intro/note in a
      gentle 0/90/180ms stagger. Added `usePrefersReducedMotion` and taught
      `useInView` to report in-view immediately under reduced motion; `Reveal`
      then renders the settled state with no entrance animation at all (belt and
      braces over the global reduced-motion CSS). Hover: thumbnail now deepens
      its shadow as it lifts (eased `transition` covering transform + shadow);
      title-colour and Read-arrow hovers already in place.
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
