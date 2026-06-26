import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "residual learning",
    aliases: ["residual", "residual function", "residual mapping"],
    definition:
      "Instead of asking a group of layers to learn a full transformation, residual learning asks them to learn only the difference between the input and the desired output. If the best thing to do is leave the input unchanged, the layers only need to learn zero, which turns out to be much easier to optimize.",
  },
  {
    term: "residual block",
    aliases: ["building block", "residual unit"],
    definition:
      "A residual block is the repeating unit of a ResNet. It sends the input through a couple of weight layers and then adds the original input back on at the end, so the block computes the input plus a learned change to it.",
  },
  {
    term: "shortcut connection",
    aliases: ["shortcut connections", "skip connection", "identity shortcut"],
    definition:
      "A shortcut connection is a wire that carries the input of a block straight to its output, skipping over the layers in between. It lets information and gradients pass through unchanged, which is what makes very deep networks trainable.",
  },
  {
    term: "identity mapping",
    aliases: ["identity mappings"],
    definition:
      "An identity mapping is a function that returns its input untouched. ResNet uses identity shortcuts so that, in the worst case, a deep network can simply copy earlier features forward rather than degrading them.",
  },
  {
    term: "degradation problem",
    aliases: ["degradation"],
    definition:
      "The degradation problem is the surprising finding that adding more layers to a plain deep network can make both training and test accuracy worse, even though a deeper model should be able to do at least as well. Residual connections were introduced to fix it.",
  },
  {
    term: "vanishing gradient",
    aliases: ["vanishing gradients", "vanishing and exploding gradients"],
    definition:
      "During training, error signals are passed backward through the network and multiplied at every layer. In a very deep network these signals can shrink toward zero before they reach the early layers, so those layers learn extremely slowly. This is the vanishing gradient problem.",
  },
  {
    term: "batch normalization",
    aliases: ["batch normalisation", "batch norm"],
    definition:
      "Batch normalization rescales the outputs of a layer using the mean and variance measured across the current mini-batch, keeping the values in a stable range. It speeds up training and makes deep networks less sensitive to how their weights are initialized.",
  },
  {
    term: "convolutional neural network",
    aliases: ["convolutional networks", "convolutional", "CNN", "ConvNet"],
    definition:
      "A convolutional neural network processes images by sliding small learnable filters across the picture to detect patterns such as edges and textures. Stacking these layers lets the network build up from simple local features to complex shapes and objects.",
  },
  {
    term: "ImageNet",
    definition:
      "ImageNet is a large benchmark dataset of over a million labeled photographs spread across a thousand categories. Annual competitions on it drove much of the progress in deep learning for vision, and strong ImageNet accuracy became a standard measure of an architecture.",
  },
  {
    term: "bottleneck",
    aliases: ["bottleneck design", "bottleneck block"],
    definition:
      "A bottleneck block first uses a small one by one convolution to reduce the number of channels, does the expensive work on this thinner representation, then expands back out. It keeps very deep networks affordable to compute.",
  },
];

export default terms;
