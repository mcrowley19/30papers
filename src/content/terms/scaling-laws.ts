import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "scaling law",
    aliases: ["scaling laws", "power law", "power-law"],
    definition:
      "A scaling law is a simple mathematical relationship showing how one quantity changes as another grows. Here it means that a language model's error falls in a smooth, predictable way as you increase its size, its training data, or its compute, following a straight line on a log-log plot.",
  },
  {
    term: "test loss",
    aliases: ["loss", "cross-entropy loss"],
    definition:
      "The loss is a single number measuring how wrong the model's predictions are, with lower being better. For language models it is usually the cross-entropy of predicting the next token, and tracking it on held-out text is how the paper measures performance.",
  },
  {
    term: "compute",
    aliases: ["compute budget", "FLOPs", "training compute"],
    definition:
      "Compute is the total amount of arithmetic spent on training, often measured in floating point operations. It is roughly the model size multiplied by the amount of data processed, and it is one of the three resources whose increase reliably lowers the loss.",
  },
  {
    term: "parameters",
    aliases: ["model size", "number of parameters", "non-embedding parameters"],
    definition:
      "Parameters are the adjustable numbers inside a network that learning tunes, and their count is the main measure of model size. The paper finds that loss improves as a power law in the number of parameters, as long as the model is given enough data and compute.",
  },
  {
    term: "overfitting",
    aliases: ["overfit"],
    definition:
      "Overfitting is when a model starts fitting the noise in its training data rather than the general pattern, so it stops improving on new text. The paper shows overfitting depends on the ratio of model size to dataset size, which tells you how to grow them together.",
  },
  {
    term: "compute-efficient",
    aliases: ["compute efficient", "compute-optimal", "sample efficiency"],
    definition:
      "A training run is compute-efficient when it reaches a target loss with the least total computation. A key finding is that for a fixed compute budget it is best to train very large models and stop well before convergence, rather than training smaller models to the end.",
  },
  {
    term: "Transformer",
    aliases: ["transformer"],
    definition:
      "The Transformer is the neural network architecture, based on attention, that these language models use. The scaling laws are measured on Transformers and turn out to depend far more on scale than on the specific architectural details.",
  },
  {
    term: "token",
    aliases: ["tokens"],
    definition:
      "A token is a small chunk of text, such as a word or part of a word, that the model reads and predicts one at a time. Dataset size in this paper is counted in tokens, and the model's job is to predict the next token in a sequence.",
  },
];

export default terms;
