import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "external memory",
    aliases: ["memory matrix", "memory bank", "memory"],
    definition:
      "A Neural Turing Machine pairs a neural network with a separate bank of memory it can read from and write to, like a computer's RAM. Keeping data in this external memory lets the system store and recall information far beyond what fits in a network's own activations.",
  },
  {
    term: "controller",
    definition:
      "The controller is the neural network at the heart of the machine. It receives the inputs, decides what to read and write in memory, and produces the outputs, playing the role of a processor that has learned its own program.",
  },
  {
    term: "read head",
    aliases: ["read heads", "write head", "write heads", "head", "heads"],
    definition:
      "Heads are the components that actually access the memory. A read head pulls a blend of memory locations out, and a write head edits them, with their focus controlled by attention weights rather than by a fixed address.",
  },
  {
    term: "addressing",
    aliases: ["content-based addressing", "location-based addressing"],
    definition:
      "Addressing is how the machine decides which memory locations to attend to. Content-based addressing finds locations whose stored values resemble a query, while location-based addressing shifts the focus by relative position, and the two can be combined.",
  },
  {
    term: "differentiable",
    aliases: ["differentiable memory", "end-to-end differentiable"],
    definition:
      "A system is differentiable when you can compute how a small change in any part affects the output, which is what gradient based training needs. By making the memory reads and writes soft and blurred rather than sharp, the whole machine stays differentiable and can be trained with backpropagation.",
  },
  {
    term: "attention",
    aliases: ["attentional", "weighting", "blurry"],
    definition:
      "Instead of reading one exact memory cell, the machine spreads a set of weights over all locations and reads a weighted average. This soft attention is what allows learning by gradients, since the focus can be nudged smoothly rather than jumping discretely.",
  },
  {
    term: "Turing machine",
    definition:
      "A Turing machine is the classic theoretical model of computation, a controller that moves along an unbounded tape it can read and write. The paper borrows this picture, replacing the rigid rules with a trainable neural network.",
  },
];

export default terms;
