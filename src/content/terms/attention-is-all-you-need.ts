import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "self-attention",
    aliases: ["self attention", "intra-attention"],
    definition:
      "Self-attention lets every position in a sequence look at every other position in the same sequence and decide how much to take from each one. Instead of passing information along step by step, a word can directly gather what it needs from any other word, which is how the model relates distant parts of a sentence.",
  },
  {
    term: "attention mechanism",
    aliases: ["attention", "attention function"],
    definition:
      "An attention mechanism computes a weighted average of some values, where the weights say how relevant each value is to the current position. The model learns to put more weight on the parts of the input that matter, so it can focus on the right context rather than treating everything equally.",
  },
  {
    term: "query",
    aliases: ["queries"],
    definition:
      "In attention, a query is the vector that represents what the current position is looking for. It is compared against every key to decide how much attention to pay to each value. You can think of the query as the question a position asks about the rest of the sequence.",
  },
  {
    term: "key",
    aliases: ["keys"],
    definition:
      "A key is a vector attached to each position that advertises what information that position holds. The model compares a query against all the keys, and positions whose keys match the query best receive the most attention.",
  },
  {
    term: "value",
    aliases: ["values"],
    definition:
      "A value is the actual content that gets passed along once attention has decided where to look. After the query and keys set the weights, the output is a weighted sum of the values, so the value is the information a position contributes when it is attended to.",
  },
  {
    term: "scaled dot-product attention",
    aliases: ["scaled dot product attention"],
    definition:
      "This is the specific attention used in the Transformer. It takes the dot product of a query with each key to score relevance, divides those scores by the square root of the key dimension to keep them from growing too large, applies a softmax to turn them into weights, and uses those weights to average the values.",
  },
  {
    term: "multi-head attention",
    aliases: ["multi head attention", "attention heads", "heads"],
    definition:
      "Rather than running attention once, the model runs several attention operations in parallel, each called a head, on different learned projections of the data. Each head can focus on a different kind of relationship, and their outputs are combined, which lets the model attend to several patterns at the same time.",
  },
  {
    term: "positional encoding",
    aliases: ["positional encodings"],
    definition:
      "Because attention has no built in sense of order, the Transformer adds a positional encoding to each input so the model knows where each token sits in the sequence. The original paper uses fixed sine and cosine waves of different frequencies, giving every position a distinct signature the model can read.",
  },
  {
    term: "encoder",
    definition:
      "The encoder is the half of the model that reads the input sequence and turns it into a set of rich, context aware representations. It is a stack of identical layers, each combining self-attention with a small feed-forward network.",
  },
  {
    term: "decoder",
    definition:
      "The decoder is the half of the model that produces the output one token at a time. It attends to what it has generated so far and also attends to the encoder's representations of the input, so each new token is informed by both.",
  },
  {
    term: "feed-forward network",
    aliases: ["feed forward network", "position-wise feed-forward"],
    definition:
      "Inside each layer, after attention, the model passes every position through the same small two layer neural network independently. This feed-forward network lets the model transform the gathered information in a more expressive, non linear way.",
  },
  {
    term: "softmax",
    definition:
      "Softmax turns a list of raw scores into positive numbers that add up to one, so they can be read as weights or probabilities. In attention it converts relevance scores into a distribution that decides how much each value contributes.",
  },
  {
    term: "residual connection",
    aliases: ["residual connections", "skip connection"],
    definition:
      "A residual connection adds a layer's input back onto its output, so the layer only has to learn the change it wants to make. This shortcut helps gradients flow during training and makes very deep stacks of layers much easier to optimize.",
  },
  {
    term: "layer normalization",
    aliases: ["layer normalisation", "layer norm"],
    definition:
      "Layer normalization rescales the values flowing through a layer so they have a consistent mean and spread for each example. Keeping the signal in a stable range makes training faster and more reliable.",
  },
];

export default terms;
