import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "pointer network",
    aliases: ["pointer networks", "pointer", "pointing"],
    definition:
      "A pointer network is a sequence model whose output is a choice of position in its own input rather than a word from a fixed vocabulary. At each step it points back at one of the input items, which suits problems whose answer is a selection or reordering of the inputs.",
  },
  {
    term: "attention",
    aliases: ["attention mechanism"],
    definition:
      "Attention computes a relevance weight for each input element given the current step. Pointer networks reuse these attention weights directly as the output, treating the most attended input position as the thing being pointed to.",
  },
  {
    term: "encoder-decoder",
    aliases: ["sequence to sequence", "seq2seq", "encoder", "decoder"],
    definition:
      "An encoder-decoder model reads an input sequence into an internal representation and then generates an output sequence from it. Pointer networks keep this shape but change what the decoder emits, making it point at inputs instead of producing fixed symbols.",
  },
  {
    term: "variable-sized output",
    aliases: ["variable output", "output dictionary", "variable length"],
    definition:
      "Ordinary sequence models predict from a fixed list of possible outputs, but problems like sorting a set need an output range that grows with the input. Pointer networks solve this by pointing into the input, so the set of possible outputs is exactly as large as the current input.",
  },
  {
    term: "combinatorial optimization",
    aliases: ["combinatorial problems", "convex hull", "travelling salesman", "TSP"],
    definition:
      "Combinatorial optimization problems ask for the best arrangement or selection from a finite set, such as the shortest tour through a list of cities. The paper shows pointer networks can learn approximate solutions to several of these directly from examples.",
  },
  {
    term: "softmax",
    definition:
      "Softmax turns a list of scores into positive weights that sum to one. A pointer network applies it over the input positions so the weights form a probability distribution over which input to point at next.",
  },
];

export default terms;
