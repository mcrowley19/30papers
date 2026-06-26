import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "recurrent neural network",
    aliases: ["recurrent neural networks", "RNN", "RNNs", "recurrent"],
    definition:
      "A recurrent neural network reads a sequence one piece at a time while keeping a hidden state that summarizes what it has seen. This loop lets it handle text, code, or any data where order matters, and it is the model the post explores.",
  },
  {
    term: "character-level",
    aliases: ["character level", "character-level model", "characters"],
    definition:
      "A character-level model predicts text one letter at a time rather than one word at a time. Karpathy trains such models to show how much structure, like spelling, punctuation, and syntax, an RNN can pick up from raw characters alone.",
  },
  {
    term: "language model",
    aliases: ["language modeling", "language modelling"],
    definition:
      "A language model predicts what comes next in a sequence of text, learning the patterns of a language in the process. By sampling from its predictions, the model can generate new text that imitates whatever it was trained on.",
  },
  {
    term: "hidden state",
    aliases: ["hidden vector", "state"],
    definition:
      "The hidden state is the vector of numbers the network carries from step to step, holding its memory of the sequence so far. The post visualizes individual cells in this state and finds some that track meaningful things like quotes or line length.",
  },
  {
    term: "sampling",
    aliases: ["sample", "temperature"],
    definition:
      "Sampling is generating text by repeatedly drawing the next character from the model's predicted probabilities and feeding it back in. A temperature setting controls how adventurous the choices are, trading off between safe and surprising output.",
  },
  {
    term: "LSTM",
    aliases: ["long short-term memory", "LSTMs"],
    definition:
      "An LSTM is a recurrent network with gated memory that helps it remember information over long stretches. It is the variant Karpathy mostly uses because it handles long-range structure in text far better than a plain RNN.",
  },
  {
    term: "backpropagation through time",
    aliases: ["backpropagation", "backprop"],
    definition:
      "Backpropagation through time is how recurrent networks learn. The sequence is unrolled into a chain of steps, and the error is propagated back through all of them to adjust the shared weights.",
  },
];

export default terms;
