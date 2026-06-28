/**
 * Line-art figure system.
 *
 * Every paper is paired with one precise, thin line drawing of its central
 * idea: an attention fan, a residual bypass, an unrolled recurrence, a
 * message-passing graph, a power-law on log-log axes, a memory tape, a
 * convolution receptive field, a compression funnel. These are the *figures*
 * of the papers rendered as clean specimen line art (drawn by `LineFigure`),
 * never dotty generative noise and never photographs.
 *
 * This module holds only the vocabulary of figure keys and the slug mapping;
 * the drawing lives in `src/components/LineFigure.tsx`.
 */
export type FigureKey =
  | "attention"
  | "residual"
  | "recurrence"
  | "graph"
  | "scaling"
  | "memory"
  | "conv"
  | "compression";

/** Which line figure stands for each paper. */
export const figureForSlug: Record<string, FigureKey> = {
  // Compression, complexity, minimum description length.
  "variational-lossy-autoencoder": "compression",
  "keeping-neural-networks-simple": "compression",
  "coffee-automaton": "compression",
  "first-law-of-complexodynamics": "compression",
  "kolmogorov-complexity": "compression",
  "mdl-principle-tutorial": "compression",
  "machine-super-intelligence": "scaling",
  // Vision and convolutions.
  cs231n: "conv",
  alexnet: "conv",
  "dilated-convolutions": "conv",
  // Residual streams and very deep stacks.
  "deep-residual-learning": "residual",
  "identity-mappings-resnets": "residual",
  gpipe: "residual",
  // Sequences and recurrence.
  "rnn-regularization": "recurrence",
  "unreasonable-effectiveness-of-rnns": "recurrence",
  "understanding-lstms": "recurrence",
  "deep-speech-2": "recurrence",
  // Attention.
  "annotated-transformer": "attention",
  "attention-is-all-you-need": "attention",
  "neural-machine-translation": "attention",
  // Sets, relations, message passing.
  "relational-reasoning": "graph",
  "relational-recurrent-networks": "graph",
  "pointer-networks": "graph",
  "neural-message-passing": "graph",
  "order-matters": "graph",
  // External memory.
  "neural-turing-machines": "memory",
  // Scaling.
  "scaling-laws": "scaling",
};

export const figureFor = (slug: string): FigureKey =>
  figureForSlug[slug] ?? "attention";
