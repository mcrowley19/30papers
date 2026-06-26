import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { paperBySlug } from "../data/papers";
import { loadPaperContent, type PaperContent } from "../lib/content";
import { renderWithTerms } from "../lib/renderWithTerms";
import { useTermPanel } from "../context/TermPanelContext";
import NotFound from "./NotFound";

export default function Paper() {
  const { slug = "" } = useParams();
  const paper = paperBySlug(slug);
  const { activeTerm, closeTerm } = useTermPanel();

  const [content, setContent] = useState<PaperContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Close any open panel when navigating between papers.
  useEffect(() => {
    closeTerm();
  }, [slug, closeTerm]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setContent(null);
    loadPaperContent(slug).then((c) => {
      if (!cancelled) {
        setContent(c);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // A handful of papers (notably the 80-page MDL tutorial) are very large once
  // their math is included. Parsing those into a React tree to inject bubbles
  // would stall the tab, so above a size threshold we render the raw HTML
  // directly and skip in-line terms for that page only.
  const HUGE = 1_500_000;
  const body = useMemo(() => {
    if (!content?.html) return null;
    if (content.html.length > HUGE) {
      return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
    }
    return renderWithTerms(content.html, content.terms);
  }, [content]);

  if (!paper) return <NotFound />;

  return (
    <main className={`transition-[margin] duration-300 ${activeTerm ? "lg:mr-[26rem]" : ""}`}>
      <article className="mx-auto w-full max-w-[88rem] px-6 pb-32 pt-12 sm:px-12 lg:px-20">
        <header className="border-b border-rule pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M13 8H4M7 4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            30 papers
          </Link>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">{paper.title}</h1>
          <p className="mt-4 font-sans text-base text-muted">
            {paper.authors} · {paper.year}
          </p>
          <a
            href={paper.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm text-accent hover:text-accent-ink"
          >
            View the original source
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M5 3h6v6M11 3L4 10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </header>

        {loading ? (
          <ReaderSkeleton />
        ) : body ? (
          <div className="prose-paper mt-10">{body}</div>
        ) : (
          <ComingSoon sourceUrl={paper.sourceUrl} />
        )}
      </article>
    </main>
  );
}

function ReaderSkeleton() {
  return (
    <div className="mt-10 space-y-4" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-rule/60" style={{ width: `${85 - (i % 3) * 12}%` }} />
      ))}
    </div>
  );
}

function ComingSoon({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div className="mt-12 rounded-md border border-rule bg-rule/20 px-6 py-10 text-center">
      <p className="font-serif text-xl text-ink">The full text for this paper is being prepared.</p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm text-accent hover:text-accent-ink"
      >
        Read it at the original source for now
      </a>
    </div>
  );
}
