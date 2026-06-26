import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "convolutional neural network",
    aliases: ["convolutional neural networks", "convolutional", "CNN", "ConvNet"],
    definition:
      "A convolutional neural network processes images by sliding small learnable filters across the picture to detect local patterns such as edges and textures. Stacking these layers lets the network build from simple local features up to whole objects, which suits images far better than treating every pixel independently.",
  },
  {
    term: "ReLU",
    aliases: ["rectified linear unit", "rectified linear units", "non-saturating nonlinearity"],
    definition:
      "ReLU stands for rectified linear unit, an activation that outputs the input when it is positive and zero otherwise. It is simple and does not flatten out for large values, so networks using it train several times faster than ones using older S-shaped activations.",
  },
  {
    term: "dropout",
    definition:
      "Dropout is a regularization trick that randomly switches off a fraction of the neurons on each training step. Because the network cannot rely on any single neuron, it learns more robust, redundant features and overfits less.",
  },
  {
    term: "overfitting",
    aliases: ["overfit", "over-fitting"],
    definition:
      "Overfitting happens when a model memorizes quirks and noise in its training data instead of the general pattern, so it does well on examples it has seen but poorly on new ones. Large models on limited data are especially prone to it.",
  },
  {
    term: "data augmentation",
    definition:
      "Data augmentation artificially enlarges the training set by applying label preserving changes to the inputs, such as cropping, flipping, or shifting the colors of an image. The model sees more variety and learns features that do not depend on those incidental details.",
  },
  {
    term: "max pooling",
    aliases: ["pooling", "overlapping pooling"],
    definition:
      "Max pooling shrinks a feature map by dividing it into small regions and keeping only the largest value in each. This reduces the amount of computation and makes the representation a little less sensitive to exactly where a feature appears.",
  },
  {
    term: "softmax",
    definition:
      "Softmax turns a list of raw scores into positive numbers that add up to one, so they can be read as class probabilities. The final layer of AlexNet uses it to spread one unit of probability across the thousand possible categories.",
  },
  {
    term: "local response normalization",
    aliases: ["response normalization", "brightness normalization"],
    definition:
      "Local response normalization rescales each neuron's output relative to its neighbors, encouraging competition between feature detectors that fire at the same location. It gave a small accuracy boost in AlexNet, though later architectures mostly dropped it in favor of batch normalization.",
  },
  {
    term: "GPU",
    aliases: ["GPUs", "graphics processing unit"],
    definition:
      "A GPU is a processor built to perform many simple calculations in parallel, originally for rendering graphics. Training AlexNet across two GPUs is what made it practical to fit and run such a large network in a reasonable time, and it set the pattern for modern deep learning hardware.",
  },
];

export default terms;
