import type { Term } from "../content/types";

// Lazily-loaded raw HTML bodies and term modules. Vite code-splits each one,
// so a reader page only downloads the paper it shows.
const htmlLoaders = import.meta.glob("../content/papers/*.html", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const termLoaders = import.meta.glob("../content/terms/*.ts") as Record<
  string,
  () => Promise<{ default: Term[] }>
>;

export interface PaperContent {
  html: string | null;
  terms: Term[];
}

export async function loadPaperContent(slug: string): Promise<PaperContent> {
  const htmlKey = Object.keys(htmlLoaders).find((k) =>
    k.endsWith(`/${slug}.html`)
  );
  const termKey = Object.keys(termLoaders).find((k) =>
    k.endsWith(`/${slug}.ts`)
  );

  const [html, terms] = await Promise.all([
    htmlKey ? htmlLoaders[htmlKey]() : Promise.resolve(null),
    termKey
      ? termLoaders[termKey]().then((m) => m.default)
      : Promise.resolve([] as Term[]),
  ]);

  return { html, terms };
}

export function hasPaperContent(slug: string): boolean {
  return Object.keys(htmlLoaders).some((k) => k.endsWith(`/${slug}.html`));
}
