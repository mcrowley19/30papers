import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import Seo from "../components/Seo";
import ReadingProgress from "../components/ReadingProgress";
import SelectionAskPopup from "../components/SelectionAskPopup";
import { Link, useParams } from "react-router-dom";
import { paperBySlug } from "../data/papers";
import { loadPaperContent, type PaperContent } from "../lib/content";
import { renderWithTerms } from "../lib/renderWithTerms";
import { useTermPanel } from "../context/TermPanelContext";
import { useBackgroundsHidden } from "../context/LandingMotionContext";
import { paperMeta } from "../lib/seo";
import NotFound from "./NotFound";
import BottleneckBackground from "../components/BottleneckBackground";
import CodeLengthBackground from "../components/CodeLengthBackground";
import CoffeeAutomatonBackground from "../components/CoffeeAutomatonBackground";
import ComplexodynamicsBackground from "../components/ComplexodynamicsBackground";
import KolmogorovBackground from "../components/KolmogorovBackground";
import {
  MdlBackground,
  MachineSuperIntelligenceBackground,
  Cs231nBackground,
  AlexNetBackground,
  ResNetBackground,
  DilatedBackground,
} from "../components/PaperBackgroundsA";
import {
  IdentityMappingsBackground,
  RnnRegularizationBackground,
  CharRnnBackground,
  LstmBackground,
  DeepSpeechBackground,
  AnnotatedTransformerBackground,
} from "../components/PaperBackgroundsB";
import {
  RelationalReasoningBackground,
  NeuralTuringBackground,
  OrderMattersBackground,
  RelationalRecurrentBackground,
  AttentionBackground,
} from "../components/PaperBackgroundsC";
import {
  NeuralMtBackground,
  PointerNetworksBackground,
  MessagePassingBackground,
  ScalingLawsBackground,
  GPipeBackground,
} from "../components/PaperBackgroundsD";

type Bg = ComponentType<{ className?: string }>;

const BACKGROUNDS: Record<string, Bg> = {
  "variational-lossy-autoencoder": BottleneckBackground,
  "keeping-neural-networks-simple": CodeLengthBackground,
  "coffee-automaton": CoffeeAutomatonBackground,
  "first-law-of-complexodynamics": ComplexodynamicsBackground,
  "kolmogorov-complexity": KolmogorovBackground,
  "mdl-principle-tutorial": MdlBackground,
  "machine-super-intelligence": MachineSuperIntelligenceBackground,
  cs231n: Cs231nBackground,
  alexnet: AlexNetBackground,
  "deep-residual-learning": ResNetBackground,
  "dilated-convolutions": DilatedBackground,
  "identity-mappings-resnets": IdentityMappingsBackground,
  "rnn-regularization": RnnRegularizationBackground,
  "unreasonable-effectiveness-of-rnns": CharRnnBackground,
  "understanding-lstms": LstmBackground,
  "deep-speech-2": DeepSpeechBackground,
  "annotated-transformer": AnnotatedTransformerBackground,
  "relational-reasoning": RelationalReasoningBackground,
  "neural-turing-machines": NeuralTuringBackground,
  "order-matters": OrderMattersBackground,
  "relational-recurrent-networks": RelationalRecurrentBackground,
  "attention-is-all-you-need": AttentionBackground,
  "neural-machine-translation": NeuralMtBackground,
  "pointer-networks": PointerNetworksBackground,
  "neural-message-passing": MessagePassingBackground,
  "scaling-laws": ScalingLawsBackground,
  gpipe: GPipeBackground,
};

export default function Paper() {
  const { slug = "" } = useParams();
  const paper = paperBySlug(slug);
  const { activeTerm, closeTerm } = useTermPanel();
  const backgroundsHidden = useBackgroundsHidden();

  const [content, setContent] = useState<PaperContent | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);

  // Close any open panel when navigating between papers.
  useEffect(() => {
    closeTerm();
  }, [slug, closeTerm]);

  useEffect(() => {
    if (paper?.risk === "review") {
      setLoading(false);
      return;
    }
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
  }, [slug, paper?.risk]);

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

  const pdfExtracted = useMemo(() => {
    const html = content?.html;
    if (!html) return false;
    return (
      !html.includes("katex") &&
      !html.includes('class="math ') &&
      !html.includes("ltx_Math") &&
      !html.includes("ltx_document")
    );
  }, [content?.html]);

  const seo = useMemo(() => (paper ? paperMeta(paper) : null), [paper]);

  if (!paper) return <NotFound />;

  const Background = BACKGROUNDS[paper.slug];

  return (
    <main className={`paper-reader min-h-screen bg-paper/50 pb-[env(safe-area-inset-bottom)] transition-[margin] duration-300 ${activeTerm ? "lg:mr-[26rem]" : ""}`}>
      {seo && <Seo {...seo} />}
      <ReadingProgress targetRef={articleRef} />
      {/* Monograph/Landing page inspired hero header */}
      <div className="relative w-full overflow-hidden border-b border-rule bg-white py-8 sm:py-16">
        {Background && !backgroundsHidden && (
          <Background className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30" />

        <header className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-col-reverse justify-between gap-6 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-12 lg:px-20">
          <div className="flex-1 min-w-0">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-ink"
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
            <h1 className="mt-3 max-w-3xl text-pretty font-serif text-2xl leading-snug text-ink sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl">
              {paper.title}
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft sm:mt-4 sm:text-base">
              {paper.authors} · {paper.year}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={paper.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 font-sans text-sm text-accent hover:text-accent-deep"
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
            </div>
          </div>

          {/* Miniature version of the paper's thumbnail */}
          <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden border border-rule/50 bg-neutral-100 shadow-xl self-end sm:w-36">
            <img
              src={`/thumbnails/${paper.slug}.webp`}
              alt={paper.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        </header>
      </div>

      <div className="mx-auto w-full max-w-5xl px-0 py-0 sm:px-6 sm:py-12 lg:px-8">
        {loading ? (
          <div className="reader-sheet sm:rounded-sm sm:border sm:border-rule/60 sm:bg-white sm:px-8 sm:py-12 sm:shadow-xl md:px-16 md:py-20">
            <ReaderSkeleton />
          </div>
        ) : paper.risk === "review" ? (
          <CopyrightNotice sourceUrl={paper.sourceUrl} />
        ) : body ? (
          <article
            ref={articleRef}
            className="prose-paper reader-sheet relative sm:rounded-sm sm:border sm:border-rule/60 sm:bg-white sm:px-8 sm:py-12 sm:shadow-xl md:px-16 md:py-20"
          >
            {pdfExtracted && <PdfExtractNotice sourceUrl={paper.sourceUrl} />}
            {body}
            <SelectionAskPopup paper={paper} containerRef={articleRef} />
          </article>
        ) : (
          <div className="reader-sheet sm:rounded-sm sm:border sm:border-rule/60 sm:bg-white sm:px-8 sm:py-12 sm:shadow-xl md:px-16 md:py-20">
            <ComingSoon sourceUrl={paper.sourceUrl} />
          </div>
        )}
      </div>
    </main>
  );
}

function PdfExtractNotice({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div className="mb-8 rounded-md border border-rule bg-paper-raised px-4 py-3 font-sans text-sm leading-relaxed text-ink-soft">
      This text was extracted from a PDF. Equations, figures, and tables may not display correctly here.{" "}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline decoration-from-font underline-offset-2 hover:text-accent-deep"
      >
        Read the original for the full formatting
      </a>
      .
    </div>
  );
}

function CopyrightNotice({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div className="mt-12 rounded-md border border-rule bg-rule/20 px-6 py-10 text-center">
      <p className="font-serif text-xl text-ink">
        This paper is subject to copyright restrictions and cannot be hosted directly.
      </p>
      <p className="mt-2 font-sans text-sm text-muted">
        You can read the original version at the official external source.
      </p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm text-accent hover:text-accent-ink"
      >
        Read at the original source
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
    </div>
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
