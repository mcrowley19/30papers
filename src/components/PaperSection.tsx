import { useState, type ReactNode } from "react";
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
 * A full-viewport section for one paper: an ASCII backdrop with the paper's
 * thumbnail on top, title and blurb on the right, contributors on the left.
 */
export default function PaperSection({
  paper,
  background,
}: {
  paper: Paper;
  background: ReactNode | null;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const credit = creditFor(paper);
  const more = credit.openEnded
    ? "many other researchers"
    : credit.extra > 0
      ? `${credit.extra} more researcher${credit.extra > 1 ? "s" : ""}`
      : null;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-0 lg:py-0">
      {background}

      <div
        className="margin-plate pointer-events-none absolute left-6 top-[42%] z-10 hidden w-[16rem] -translate-y-1/2 lg:block xl:left-14"
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

      <div className="margin-plate pointer-events-none absolute right-6 top-[42%] z-10 hidden w-[18rem] -translate-y-1/2 lg:block xl:right-14 xl:w-[20rem]">
        <h2 className="font-serif text-2xl leading-tight text-cover">{paper.title}</h2>
        <p className="mt-4 font-serif text-sm leading-relaxed text-ink-soft">{paper.blurb}</p>
      </div>

      <Link to={`/papers/${paper.slug}`} className="group relative z-10 block w-full max-w-[22rem] sm:max-w-sm lg:w-auto lg:max-w-none">
        <div className="relative aspect-[3/4] h-[60vh] max-h-[36rem] min-h-[22rem] overflow-hidden bg-neutral-100 shadow-2xl ring-1 ring-ink/10 transition-[box-shadow,filter] duration-300 group-hover:shadow-[0_32px_64px_-24px_rgba(16,31,92,0.45)] group-hover:brightness-[1.02] sm:h-[68vh] lg:h-[82vh] lg:max-h-none lg:min-h-0">
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

      <div className="margin-plate pointer-events-none absolute bottom-6 left-1/2 z-10 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 text-pretty lg:hidden">
        <h2 className="font-serif text-xl leading-snug text-cover">{paper.title}</h2>
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
