import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";
import { creditFor, type Contributor } from "../data/contributors";

function ContributorAvatar({ slug, name, initials }: Contributor) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-cover/25 ring-2 ring-cover">
      {!failed ? (
        <img
          src={`/contributors/${slug}.jpg`}
          alt={name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-serif text-base font-bold text-cover">{initials}</span>
      )}
    </span>
  );
}

function ContributorChip({ slug, name, initials }: Contributor) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-rule/80 bg-white/90 px-2.5 py-1.5 shadow-sm">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-cover/35">
        {!failed ? (
          <img src={`/contributors/${slug}.jpg`} alt={name} onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <span className="font-serif text-xs font-bold text-cover">{initials}</span>
        )}
      </span>
      <span className="font-serif text-xs leading-none text-ink">{name}</span>
    </span>
  );
}

/**
 * A full-viewport section for one paper: an animated ASCII backdrop (passed in,
 * one per paper) with the paper's thumbnail on top of it. As the section
 * scrolls toward the viewport center the thumbnail eases back a little,
 * letting the backdrop's detail read, while side panels fade in: the paper
 * title and blurb on the right, the contributors on the left. The backdrop
 * itself stays visible throughout.
 */
export default function PaperSection({
  paper,
  background,
}: {
  paper: Paper;
  background: ReactNode;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const viewCenter = window.innerHeight / 2;
      const offCenter = Math.abs(rect.top + rect.height / 2 - viewCenter);
      // 1 when the section sits at the viewport center, 0 a bit past a
      // half-viewport away. Eased so the focus settles gently.
      const raw = Math.max(0, 1 - offCenter / (window.innerHeight * 0.55));
      const t = reduced.matches ? 1 : raw * raw * (3 - 2 * raw);
      // The plates hold back until the paper is nearly focused, then arrive
      // quickly: at partial opacity their text would ghost over the backdrop.
      const pRaw = Math.max(0, Math.min(1, (raw - 0.45) / 0.4));
      const p = reduced.matches ? 1 : pRaw * pRaw * (3 - 2 * pRaw);

      if (thumbRef.current) {
        thumbRef.current.style.transform = `scale(${1.04 - 0.16 * t})`;
      }
      for (const [el, dir] of [
        [leftRef.current, -1],
        [rightRef.current, 1],
      ] as const) {
        if (!el) continue;
        el.style.opacity = String(p);
        el.style.transform = reduced.matches ? "none" : `translateX(${dir * 18 * (1 - p)}px)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const credit = creditFor(paper);
  const more = credit.openEnded
    ? "many other researchers"
    : credit.extra > 0
      ? `${credit.extra} more researcher${credit.extra > 1 ? "s" : ""}`
      : null;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen snap-start lg:snap-center lg:snap-always items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-0 lg:py-0"
    >
      {background}

      {/* Contributors, on a small marginalia plate left of the thumbnail. */}
      <div
        ref={leftRef}
        className="margin-plate pointer-events-none absolute left-6 top-[42%] z-10 hidden w-[16rem] -translate-y-1/2 opacity-0 lg:block xl:left-14"
        aria-hidden="true"
      >
        <p className="font-serif text-xs uppercase tracking-[0.25em] text-muted">
          Contributors
        </p>
        <ul className="mt-4 space-y-4">
          {credit.shown.map((p) => (
            <li key={p.slug} className="flex items-center gap-3">
              <ContributorAvatar {...p} />
              <span className="font-serif text-sm leading-snug text-ink">{p.name}</span>
            </li>
          ))}
          {more && (
            <li className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-lg shadow-cover/25 ring-2 ring-cover font-serif text-base font-bold text-cover">
                {credit.openEnded ? "+" : `+${credit.extra}`}
              </span>
              <span className="font-serif text-sm leading-snug text-ink">{more}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Title and description, on a plate right of the thumbnail. */}
      <div
        ref={rightRef}
        className="margin-plate pointer-events-none absolute right-6 top-[42%] z-10 hidden w-[18rem] -translate-y-1/2 opacity-0 lg:block xl:right-14 xl:w-[20rem]"
      >
        <h2 className="font-serif text-2xl leading-tight text-cover">{paper.title}</h2>
        <p className="mt-4 font-serif text-sm leading-relaxed text-ink-soft">{paper.blurb}</p>
      </div>

      <Link to={`/papers/${paper.slug}`} className="group relative z-10 block w-full max-w-[22rem] sm:max-w-sm lg:w-auto lg:max-w-none">
        <div
          ref={thumbRef}
          className="relative aspect-[3/4] h-[60vh] max-h-[36rem] min-h-[22rem] overflow-hidden bg-neutral-100 shadow-2xl ring-1 ring-ink/10 transition-[box-shadow,filter] duration-300 group-hover:shadow-[0_32px_64px_-24px_rgba(16,31,92,0.45)] group-hover:brightness-[1.02] will-change-transform sm:h-[68vh] lg:h-[82vh] lg:max-h-none lg:min-h-0"
        >
          {!imgFailed ? (
            <img
              src={`/thumbnails/${paper.slug}.webp`}
              alt={paper.title}
              onError={() => setImgFailed(true)}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-lg leading-snug">
              {paper.title}
            </span>
          )}
        </div>
      </Link>

      <div className="margin-plate pointer-events-none absolute bottom-6 left-1/2 z-10 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 lg:hidden">
        <h2 className="font-serif text-xl leading-tight text-cover">{paper.title}</h2>
        <p className="mt-3 font-serif text-sm leading-relaxed text-ink-soft">{paper.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {credit.shown.slice(0, 2).map((person) => (
            <ContributorChip key={person.slug} {...person} />
          ))}
          {more && (
            <span className="inline-flex items-center rounded-full border border-rule/80 bg-white/90 px-2.5 py-1.5 font-serif text-xs text-ink">
              {credit.openEnded ? "Plus many more" : `Plus ${credit.extra} more`}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
