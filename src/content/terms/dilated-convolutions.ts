import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "dilated convolution",
    aliases: ["dilated convolutions", "dilation", "dilated", "atrous convolution"],
    definition:
      "A dilated convolution spreads its filter out by skipping pixels between the points it looks at, so it covers a wider area without using more weights. Stacking dilated convolutions lets the receptive field grow quickly while keeping the image at full resolution.",
  },
  {
    term: "receptive field",
    definition:
      "The receptive field of a unit is the region of the input image that can influence its value. Dense prediction tasks need a large receptive field so each output pixel can take in broad context, which is exactly what dilation provides cheaply.",
  },
  {
    term: "semantic segmentation",
    aliases: ["dense prediction", "segmentation"],
    definition:
      "Semantic segmentation labels every pixel of an image with the category of the object it belongs to. It is a dense prediction task, meaning the output has the same resolution as the input, so preserving fine detail matters.",
  },
  {
    term: "convolution",
    aliases: ["convolutional", "convolutional layer"],
    definition:
      "A convolution slides a small learnable filter across an image, computing a weighted sum at each position to detect a local pattern. It is the basic operation of the networks used for vision.",
  },
  {
    term: "pooling",
    aliases: ["downsampling", "down-sampling"],
    definition:
      "Pooling shrinks a feature map by summarizing small regions, which enlarges the receptive field but throws away spatial detail. The paper's motivation is to gain that wider context through dilation instead, so resolution is not lost.",
  },
  {
    term: "context",
    aliases: ["context aggregation", "multi-scale context"],
    definition:
      "Context here means information from a wide surrounding area of the image, which helps decide what a pixel is. The dilated context module aggregates information across many scales so each prediction is informed by both fine detail and the broader scene.",
  },
];

export default terms;
