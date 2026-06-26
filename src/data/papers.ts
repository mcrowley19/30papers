export type PaperKind = "arxiv" | "blog" | "pdf" | "notes";
export type RiskTag = "open" | "review";

export interface Paper {
  /** URL slug and content file key. */
  slug: string;
  /** Display title. */
  title: string;
  /** Short author credit for cards and reader header. */
  authors: string;
  year: number;
  /** One or two sentence description shown in the hover overlay. No em-dashes. */
  blurb: string;
  /** Source kind, used by the ingestion pipeline. */
  kind: PaperKind;
  /** arXiv id when kind === "arxiv" (used to build HTML + PDF urls). */
  arxivId?: string;
  /** Canonical source URL (official location, for reference). */
  sourceUrl: string;
  /** Internal note on hosting risk. Never rendered on the site. */
  risk: RiskTag;
}

/**
 * The canonical Sutskever reading list, in the order supplied by the user.
 * The hero says "30 papers" by request; the list itself has 27 entries.
 */
export const papers: Paper[] = [
  {
    slug: "variational-lossy-autoencoder",
    title: "Variational Lossy Autoencoder",
    authors: "Chen, Kingma, Salimans, Duan, Dhariwal, Schulman, Sutskever, Abbeel",
    year: 2016,
    blurb:
      "Combines variational autoencoders with autoregressive decoders, and shows how to control which information the latent code is forced to keep.",
    kind: "arxiv",
    arxivId: "1611.02731",
    sourceUrl: "https://arxiv.org/abs/1611.02731",
    risk: "open",
  },
  {
    slug: "keeping-neural-networks-simple",
    title: "Keeping Neural Networks Simple by Minimizing the Description Length of the Weights",
    authors: "Hinton, van Camp",
    year: 1993,
    blurb:
      "An early information-theoretic argument that good networks are ones whose weights can be described with few bits, linking generalization to compression.",
    kind: "pdf",
    sourceUrl: "https://www.cs.toronto.edu/~hinton/absps/colt93.pdf",
    risk: "review",
  },
  {
    slug: "coffee-automaton",
    title: "Quantifying the Rise and Fall of Complexity in Closed Systems: The Coffee Automaton",
    authors: "Aaronson, Carroll, Ouellette",
    year: 2014,
    blurb:
      "Uses a simple cellular automaton model of coffee mixing with cream to ask why complexity rises and then falls as a system moves toward equilibrium.",
    kind: "arxiv",
    arxivId: "1405.6903",
    sourceUrl: "https://arxiv.org/abs/1405.6903",
    risk: "open",
  },
  {
    slug: "first-law-of-complexodynamics",
    title: "The First Law of Complexodynamics",
    authors: "Scott Aaronson",
    year: 2011,
    blurb:
      "A blog essay asking for a formal law that explains why the complexity of a closed system rises, peaks, and falls, rather than simply tracking entropy.",
    kind: "blog",
    sourceUrl: "https://scottaaronson.blog/?p=762",
    risk: "review",
  },
  {
    slug: "kolmogorov-complexity",
    title: "Kolmogorov Complexity",
    authors: "Cover, Thomas (Elements of Information Theory, Ch. 14)",
    year: 2006,
    blurb:
      "The textbook treatment of the shortest program that produces a string, the formal backbone behind description length and algorithmic randomness.",
    kind: "pdf",
    sourceUrl: "https://onlinelibrary.wiley.com/doi/book/10.1002/047174882X",
    risk: "review",
  },
  {
    slug: "mdl-principle-tutorial",
    title: "A Tutorial Introduction to the Minimum Description Length Principle",
    authors: "Peter Grunwald",
    year: 2004,
    blurb:
      "A readable introduction to choosing models by how well they compress the data, treating learning as finding the shortest description.",
    kind: "arxiv",
    arxivId: "math/0406077",
    sourceUrl: "https://arxiv.org/abs/math/0406077",
    risk: "open",
  },
  {
    slug: "machine-super-intelligence",
    title: "Machine Super Intelligence",
    authors: "Shane Legg (PhD dissertation)",
    year: 2008,
    blurb:
      "A doctoral thesis that proposes a formal, universal measure of machine intelligence and explores its consequences for very capable agents.",
    kind: "pdf",
    sourceUrl: "https://www.vetta.org/documents/Machine_Super_Intelligence.pdf",
    risk: "open",
  },
  {
    slug: "cs231n",
    title: "CS231n: Convolutional Neural Networks for Visual Recognition",
    authors: "Karpathy, Li, Johnson, and others (Stanford)",
    year: 2016,
    blurb:
      "The course notes that teach convolutional networks from first principles, from linear classifiers up to deep architectures for images.",
    kind: "notes",
    sourceUrl: "https://cs231n.github.io/",
    risk: "review",
  },
  {
    slug: "alexnet",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    authors: "Krizhevsky, Sutskever, Hinton",
    year: 2012,
    blurb:
      "AlexNet. The convolutional network that won ImageNet by a wide margin and set off the modern deep learning era.",
    kind: "pdf",
    sourceUrl:
      "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
    risk: "review",
  },
  {
    slug: "deep-residual-learning",
    title: "Deep Residual Learning for Image Recognition",
    authors: "He, Zhang, Ren, Sun",
    year: 2015,
    blurb:
      "ResNet. Introduces residual connections that let networks grow to hundreds of layers by learning changes to the input rather than full transformations.",
    kind: "arxiv",
    arxivId: "1512.03385",
    sourceUrl: "https://arxiv.org/abs/1512.03385",
    risk: "open",
  },
  {
    slug: "dilated-convolutions",
    title: "Multi-Scale Context Aggregation by Dilated Convolutions",
    authors: "Yu, Koltun",
    year: 2015,
    blurb:
      "Shows how dilated convolutions expand the receptive field without losing resolution, which sharpened dense prediction tasks like segmentation.",
    kind: "arxiv",
    arxivId: "1511.07122",
    sourceUrl: "https://arxiv.org/abs/1511.07122",
    risk: "open",
  },
  {
    slug: "identity-mappings-resnets",
    title: "Identity Mappings in Deep Residual Networks",
    authors: "He, Zhang, Ren, Sun",
    year: 2016,
    blurb:
      "A follow up to ResNet that studies why identity shortcuts work so well and proposes a cleaner pre-activation residual block.",
    kind: "arxiv",
    arxivId: "1603.05027",
    sourceUrl: "https://arxiv.org/abs/1603.05027",
    risk: "open",
  },
  {
    slug: "rnn-regularization",
    title: "Recurrent Neural Network Regularization",
    authors: "Zaremba, Sutskever, Vinyals",
    year: 2014,
    blurb:
      "Shows how to apply dropout to LSTMs correctly, on the non-recurrent connections, so large recurrent models stop overfitting.",
    kind: "arxiv",
    arxivId: "1409.2329",
    sourceUrl: "https://arxiv.org/abs/1409.2329",
    risk: "open",
  },
  {
    slug: "unreasonable-effectiveness-of-rnns",
    title: "The Unreasonable Effectiveness of Recurrent Neural Networks",
    authors: "Andrej Karpathy",
    year: 2015,
    blurb:
      "A hands on blog post that trains character level RNNs to generate text and shows, with vivid examples, how much structure they capture.",
    kind: "blog",
    sourceUrl: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/",
    risk: "review",
  },
  {
    slug: "understanding-lstms",
    title: "Understanding LSTM Networks",
    authors: "Christopher Olah",
    year: 2015,
    blurb:
      "The clearest visual explanation of how LSTM gates carry information across long sequences, widely used as a first introduction.",
    kind: "blog",
    sourceUrl: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
    risk: "review",
  },
  {
    slug: "deep-speech-2",
    title: "Deep Speech 2: End-to-End Speech Recognition in English and Mandarin",
    authors: "Amodei, Ananthanarayanan, and others (Baidu)",
    year: 2015,
    blurb:
      "An end to end speech recognition system trained with connectionist temporal classification that worked across two very different languages.",
    kind: "arxiv",
    arxivId: "1512.02595",
    sourceUrl: "https://arxiv.org/abs/1512.02595",
    risk: "open",
  },
  {
    slug: "annotated-transformer",
    title: "The Annotated Transformer",
    authors: "Sasha Rush and others (Harvard NLP)",
    year: 2018,
    blurb:
      "A line by line, runnable reimplementation of the Transformer that turns the original paper into working, readable code.",
    kind: "blog",
    sourceUrl: "https://nlp.seas.harvard.edu/annotated-transformer/",
    risk: "open",
  },
  {
    slug: "relational-reasoning",
    title: "A Simple Neural Network Module for Relational Reasoning",
    authors: "Santoro, Raposo, Barrett, and others",
    year: 2017,
    blurb:
      "Introduces the relation network, a small plug in module that lets a network reason about how pairs of objects relate to each other.",
    kind: "arxiv",
    arxivId: "1706.01427",
    sourceUrl: "https://arxiv.org/abs/1706.01427",
    risk: "open",
  },
  {
    slug: "neural-turing-machines",
    title: "Neural Turing Machines",
    authors: "Graves, Wayne, Danihelka",
    year: 2014,
    blurb:
      "Couples a neural network to an external memory it can read and write with differentiable attention, learning simple algorithms from examples.",
    kind: "arxiv",
    arxivId: "1410.5401",
    sourceUrl: "https://arxiv.org/abs/1410.5401",
    risk: "open",
  },
  {
    slug: "order-matters",
    title: "Order Matters: Sequence to Sequence for Sets",
    authors: "Vinyals, Bengio, Kudlur",
    year: 2015,
    blurb:
      "Examines how the order of inputs and outputs affects sequence to sequence models, and how to handle data that is really a set.",
    kind: "arxiv",
    arxivId: "1511.06391",
    sourceUrl: "https://arxiv.org/abs/1511.06391",
    risk: "open",
  },
  {
    slug: "relational-recurrent-networks",
    title: "Relational Recurrent Neural Networks",
    authors: "Santoro, Faulkner, Raposo, and others",
    year: 2018,
    blurb:
      "Adds a self attention based memory to recurrent networks so that stored memories can interact, improving tasks that need relational reasoning over time.",
    kind: "arxiv",
    arxivId: "1806.01822",
    sourceUrl: "https://arxiv.org/abs/1806.01822",
    risk: "open",
  },
  {
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Vaswani, Shazeer, Parmar, and others",
    year: 2017,
    blurb:
      "The Transformer. Replaces recurrence entirely with self attention, the architecture that underpins almost every modern large language model.",
    kind: "arxiv",
    arxivId: "1706.03762",
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    risk: "open",
  },
  {
    slug: "neural-machine-translation",
    title: "Neural Machine Translation by Jointly Learning to Align and Translate",
    authors: "Bahdanau, Cho, Bengio",
    year: 2014,
    blurb:
      "Introduces the attention mechanism, letting a translation model look back at the relevant source words instead of a single fixed summary.",
    kind: "arxiv",
    arxivId: "1409.0473",
    sourceUrl: "https://arxiv.org/abs/1409.0473",
    risk: "open",
  },
  {
    slug: "pointer-networks",
    title: "Pointer Networks",
    authors: "Vinyals, Fortunato, Jaitly",
    year: 2015,
    blurb:
      "A sequence model whose outputs point back at positions in the input, which suits problems whose answer is a selection or ordering of the inputs.",
    kind: "arxiv",
    arxivId: "1506.03134",
    sourceUrl: "https://arxiv.org/abs/1506.03134",
    risk: "open",
  },
  {
    slug: "neural-message-passing",
    title: "Neural Message Passing for Quantum Chemistry",
    authors: "Gilmer, Schoenholz, Riley, Vinyals, Dahl",
    year: 2017,
    blurb:
      "Unifies many graph neural networks under a message passing framework and applies it to predicting molecular properties.",
    kind: "arxiv",
    arxivId: "1704.01212",
    sourceUrl: "https://arxiv.org/abs/1704.01212",
    risk: "open",
  },
  {
    slug: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    authors: "Kaplan, McCandlish, and others",
    year: 2020,
    blurb:
      "Measures how language model loss falls as a smooth power law in model size, data, and compute, the empirical basis for building ever larger models.",
    kind: "arxiv",
    arxivId: "2001.08361",
    sourceUrl: "https://arxiv.org/abs/2001.08361",
    risk: "open",
  },
  {
    slug: "gpipe",
    title: "GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism",
    authors: "Huang, Cheng, and others",
    year: 2018,
    blurb:
      "A pipeline parallelism library that splits a giant model across devices and keeps them busy, making it practical to train very large networks.",
    kind: "arxiv",
    arxivId: "1811.06965",
    sourceUrl: "https://arxiv.org/abs/1811.06965",
    risk: "open",
  },
];

export const paperBySlug = (slug: string): Paper | undefined =>
  papers.find((p) => p.slug === slug);
