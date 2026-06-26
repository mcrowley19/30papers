import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "sequence to sequence",
    aliases: ["seq2seq", "sequence-to-sequence", "encoder-decoder"],
    definition:
      "Sequence to sequence models read an input sequence and produce an output sequence, using an encoder and a decoder. The paper examines how well this framework works when the data is not naturally a sequence, such as a set, and how much the chosen order matters.",
  },
  {
    term: "set",
    aliases: ["sets", "unordered"],
    definition:
      "A set is a collection of items with no inherent order, such as the points in a cloud. The paper studies how to feed sets into models that expect ordered sequences, and shows that the order you impose can noticeably change the result.",
  },
  {
    term: "attention",
    aliases: ["attention mechanism", "content-based attention"],
    definition:
      "Attention lets the model focus on the relevant parts of its input when producing each output. The paper uses an attention based reader that can process a set without committing to a fixed order for its elements.",
  },
  {
    term: "permutation invariance",
    aliases: ["permutation invariant", "order invariance", "ordering"],
    definition:
      "A model is permutation invariant when shuffling its inputs does not change its output, which is the proper behavior for a set. The paper designs encoders and decoders that respect this, so the answer does not depend on an arbitrary input order.",
  },
  {
    term: "content-based attention",
    aliases: ["content based attention"],
    definition:
      "Content-based attention selects what to focus on by matching a query against the contents of each item, rather than by its position. This is what allows a set to be read without first being arranged into a sequence.",
  },
  {
    term: "LSTM",
    aliases: ["long short-term memory"],
    definition:
      "An LSTM is a recurrent network with gated memory used here as the building block of the encoder and decoder. The paper augments it with attention so it can handle sets and choose useful orderings.",
  },
];

export default terms;
