import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "encoder-decoder",
    aliases: ["encoder", "decoder", "encoder and decoder", "sequence to sequence"],
    definition:
      "An encoder-decoder model has two parts. The encoder reads the whole input sentence and turns it into an internal representation, and the decoder reads that representation and produces the output sentence one word at a time. It is the standard shape for translation and many other sequence tasks.",
  },
  {
    term: "attention",
    aliases: ["attention mechanism", "soft alignment", "alignment"],
    definition:
      "Attention lets the decoder look back at all of the encoder's word representations and focus on the ones most relevant to the word it is about to produce. This paper introduced it so that translation no longer had to squeeze the entire source sentence into a single fixed summary.",
  },
  {
    term: "context vector",
    aliases: ["context"],
    definition:
      "The context vector is a fresh summary of the source sentence computed for each output word, formed as a weighted blend of the encoder representations. The attention weights decide how much each source word contributes, so the context changes as the decoder moves along.",
  },
  {
    term: "fixed-length vector",
    aliases: ["fixed length vector", "single fixed vector"],
    definition:
      "Earlier translation models compressed the entire input sentence into one fixed-length vector before decoding. That bottleneck lost detail on long sentences, and removing it with attention is the central contribution of this paper.",
  },
  {
    term: "bidirectional RNN",
    aliases: ["bidirectional", "BiRNN"],
    definition:
      "A bidirectional recurrent network reads the sequence both forward and backward and combines the two passes. This way the representation of each word reflects both the words before it and the words after it, giving richer context.",
  },
  {
    term: "annotation",
    aliases: ["annotations"],
    definition:
      "In this paper an annotation is the encoder's vector for a particular source word, carrying information about that word and its surroundings. The decoder attends over the sequence of annotations to build each context vector.",
  },
  {
    term: "BLEU",
    aliases: ["BLEU score"],
    definition:
      "BLEU is a standard automatic score for machine translation. It compares the machine output against one or more human reference translations by counting how many short word sequences they share, giving a rough but convenient measure of quality.",
  },
  {
    term: "alignment model",
    aliases: ["alignment"],
    definition:
      "The alignment model is the small network that scores how well each source word matches the current decoding step. Its scores become the attention weights, and because it is trained jointly with the rest of the system, the model learns to align without being told the alignments in advance.",
  },
];

export default terms;
