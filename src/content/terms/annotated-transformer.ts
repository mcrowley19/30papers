import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "Transformer",
    aliases: ["transformer"],
    definition:
      "The Transformer is a sequence model built entirely from attention, with no recurrence. This walkthrough rebuilds it in code, so each idea from the original paper appears next to the lines that implement it.",
  },
  {
    term: "self-attention",
    aliases: ["self attention", "scaled dot-product attention", "attention"],
    definition:
      "Self-attention lets every position in a sequence look at every other position and pull in what is relevant. The annotated version shows the exact matrix operations, where queries are compared with keys to weight the values.",
  },
  {
    term: "multi-head attention",
    aliases: ["multi head attention", "heads"],
    definition:
      "Multi-head attention runs several attention operations in parallel on different learned projections, then joins them. The code makes clear how the data is split into heads and recombined.",
  },
  {
    term: "positional encoding",
    aliases: ["positional encodings"],
    definition:
      "Because attention ignores order, a positional encoding is added to each token so the model knows where it sits in the sequence. The walkthrough plots the sine and cosine signals used and shows where they are added.",
  },
  {
    term: "encoder",
    aliases: ["encoder-decoder", "decoder"],
    definition:
      "The encoder turns the input into context-aware representations, and the decoder generates the output while attending to them. The annotation builds each as a stack of identical layers you can read one at a time.",
  },
  {
    term: "masking",
    aliases: ["mask", "masked attention", "subsequent mask"],
    definition:
      "Masking hides certain positions from attention. In the decoder a mask stops each position from peeking at future tokens, so the model only uses what it has generated so far, which the code demonstrates directly.",
  },
  {
    term: "layer normalization",
    aliases: ["layer norm", "residual connection"],
    definition:
      "Each sub-layer is wrapped with a residual connection that adds its input back on, followed by layer normalization that keeps the signal in a stable range. The walkthrough implements this wrapper once and reuses it throughout.",
  },
  {
    term: "label smoothing",
    definition:
      "Label smoothing trains the model toward slightly softened targets instead of full confidence on the correct token. It discourages overconfidence and tends to improve accuracy, and the annotation shows the small change it requires.",
  },
];

export default terms;
