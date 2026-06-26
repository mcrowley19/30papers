import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "identity mapping",
    aliases: ["identity mappings", "identity", "identity shortcut"],
    definition:
      "An identity mapping passes its input through unchanged. This paper studies why making the shortcut in a residual block a clean identity, with nothing added on the skip path, lets signals travel through very deep networks unimpeded.",
  },
  {
    term: "shortcut connection",
    aliases: ["shortcut", "skip connection", "skip path"],
    definition:
      "A shortcut connection carries a block's input directly to its output, bypassing the layers in between. The paper shows that keeping this path as a plain identity, rather than scaling or gating it, gives the best training of deep residual networks.",
  },
  {
    term: "residual block",
    aliases: ["residual unit", "residual function"],
    definition:
      "A residual block computes its input plus a learned change to it. The paper rearranges the pieces inside the block to make both the shortcut and the path back through the layers as clean as possible.",
  },
  {
    term: "pre-activation",
    aliases: ["pre activation", "pre-activation residual unit"],
    definition:
      "Pre-activation means applying batch normalization and the nonlinearity before the weight layers in a block, rather than after. This rearrangement gives a cleaner signal path and was found to train deeper networks more easily and with better accuracy.",
  },
  {
    term: "batch normalization",
    aliases: ["batch norm", "batch normalisation"],
    definition:
      "Batch normalization rescales a layer's outputs using the mean and variance of the current batch to keep them in a stable range. Where it sits inside a residual block turns out to matter for how cleanly information flows through the network.",
  },
  {
    term: "forward and backward propagation",
    aliases: ["forward propagation", "backward propagation", "signal propagation"],
    definition:
      "Forward propagation is how inputs flow through the network to produce a prediction, and backward propagation is how the error signal flows back to update the weights. The paper's analysis shows that identity shortcuts let both flow directly, which is why extremely deep networks train well.",
  },
];

export default terms;
