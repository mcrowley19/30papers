import { useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { notFoundMeta } from "../lib/seo";

export default function NotFound() {
  const seo = useMemo(() => notFoundMeta(), []);

  return (
    <main className="mx-auto flex min-h-screen max-w-reading flex-col justify-center px-6">
      <Seo {...seo} />
      <p className="font-sans text-sm uppercase tracking-[0.2em] text-muted">
        Not found
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink">
        This page is not in the list.
      </h1>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 font-sans text-accent hover:text-accent-ink"
      >
        Back to the 30 papers
      </Link>
    </main>
  );
}
