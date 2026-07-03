// Ingestion manifest. Mirrors src/data/papers.ts (slug + kind), and adds the
// concrete source URLs the pipeline needs. Kept here so the build script has no
// dependency on the TypeScript data module.

/**
 * @typedef {Object} Source
 * @property {string} slug
 * @property {"arxiv"|"blog"|"pdf"|"notes"} kind
 * @property {string} [arxivId]      // for kind === "arxiv"
 * @property {string} [pdfUrl]       // pdf used for text (pdf) and/or thumbnail
 * @property {string} [pageUrl]      // html page to scrape (blog/notes)
 * @property {string[]} [selectors]  // candidate content containers (blog/notes)
 */

/** @type {Source[]} */
export const sources = [
  { slug: "variational-lossy-autoencoder", kind: "arxiv", arxivId: "1611.02731" },
  {
    slug: "keeping-neural-networks-simple",
    kind: "pdf",
    pdfUrl: "https://www.cs.toronto.edu/~hinton/absps/colt93.pdf",
    risk: "review",
  },
  { slug: "coffee-automaton", kind: "arxiv", arxivId: "1405.6903" },
  {
    slug: "first-law-of-complexodynamics",
    kind: "blog",
    pageUrl: "https://scottaaronson.blog/?p=762",
    selectors: [".entry", ".post", "#content", "article"],
    risk: "review",
  },
  {
    slug: "kolmogorov-complexity",
    kind: "pdf",
    // Standalone scan of the Cover & Thomas "Kolmogorov Complexity" chapter.
    // High copyright risk (see plan), but it is the actual chapter text.
    pdfUrl:
      "https://ftp.esat.kuleuven.be/pub/pub/SISTA/decock/voor_xander/referenties/Cover&Thomas/7.pdf",
    risk: "review",
  },
  { slug: "mdl-principle-tutorial", kind: "arxiv", arxivId: "math/0406077" },
  {
    slug: "machine-super-intelligence",
    kind: "pdf",
    pdfUrl: "https://www.vetta.org/documents/Machine_Super_Intelligence.pdf",
  },
  {
    slug: "cs231n",
    kind: "notes",
    pageUrl: "https://cs231n.github.io/convolutional-networks/",
    selectors: [".post-content", ".page-content", "article", "#main_content"],
    risk: "review",
  },
  {
    slug: "alexnet",
    kind: "pdf",
    pdfUrl:
      "https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf",
    risk: "review",
  },
  { slug: "deep-residual-learning", kind: "arxiv", arxivId: "1512.03385" },
  { slug: "dilated-convolutions", kind: "arxiv", arxivId: "1511.07122" },
  { slug: "identity-mappings-resnets", kind: "arxiv", arxivId: "1603.05027" },
  { slug: "rnn-regularization", kind: "arxiv", arxivId: "1409.2329" },
  {
    slug: "unreasonable-effectiveness-of-rnns",
    kind: "blog",
    pageUrl: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/",
    selectors: [".post", "article", "#main"],
    risk: "review",
  },
  {
    slug: "understanding-lstms",
    kind: "blog",
    pageUrl: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
    selectors: [".post", "article", ".post-content"],
    risk: "review",
  },
  { slug: "deep-speech-2", kind: "arxiv", arxivId: "1512.02595" },
  {
    slug: "annotated-transformer",
    kind: "blog",
    pageUrl: "https://nlp.seas.harvard.edu/annotated-transformer/",
    selectors: ["main", "article", ".content", "body"],
  },
  { slug: "relational-reasoning", kind: "arxiv", arxivId: "1706.01427" },
  { slug: "neural-turing-machines", kind: "arxiv", arxivId: "1410.5401" },
  { slug: "order-matters", kind: "arxiv", arxivId: "1511.06391" },
  { slug: "relational-recurrent-networks", kind: "arxiv", arxivId: "1806.01822" },
  { slug: "attention-is-all-you-need", kind: "arxiv", arxivId: "1706.03762" },
  { slug: "neural-machine-translation", kind: "arxiv", arxivId: "1409.0473" },
  { slug: "pointer-networks", kind: "arxiv", arxivId: "1506.03134" },
  { slug: "neural-message-passing", kind: "arxiv", arxivId: "1704.01212" },
  { slug: "scaling-laws", kind: "arxiv", arxivId: "2001.08361" },
  { slug: "gpipe", kind: "arxiv", arxivId: "1811.06965" },
];

export const arxivHtmlUrl = (id) =>
  `https://ar5iv.labs.arxiv.org/html/${id}`;
export const arxivHtmlFallbackUrl = (id) => `https://arxiv.org/html/${id}`;
export const arxivPdfUrl = (id) => `https://arxiv.org/pdf/${id}`;
