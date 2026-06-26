import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "convolutional neural network",
    aliases: ["convolutional networks", "convolutional", "CNN", "ConvNet", "ConvNets"],
    definition:
      "A convolutional neural network is built for images. It slides small learnable filters across the picture to detect local patterns, and by stacking these layers it builds from simple edges up to whole objects, using far fewer weights than connecting every pixel to every neuron.",
  },
  {
    term: "filter",
    aliases: ["filters", "kernel", "kernels"],
    definition:
      "A filter is a small grid of weights that slides over the input looking for a particular pattern, such as an edge at a certain angle. Each convolutional layer learns many filters, and their responses form the layer's output.",
  },
  {
    term: "activation function",
    aliases: ["activation", "ReLU", "nonlinearity"],
    definition:
      "An activation function applies a simple nonlinear transformation to each neuron's output, which lets the network represent complex patterns rather than just straight lines. The most common choice, ReLU, keeps positive values and zeroes out negatives.",
  },
  {
    term: "pooling",
    aliases: ["max pooling", "pooling layer"],
    definition:
      "Pooling shrinks a feature map by summarizing small regions, usually by taking the maximum value in each. It reduces computation and makes the representation a little less sensitive to the exact position of a feature.",
  },
  {
    term: "backpropagation",
    aliases: ["backprop", "back-propagation"],
    definition:
      "Backpropagation is the algorithm that trains neural networks by working out how much each weight contributed to the error and nudging it to reduce that error. It applies the chain rule of calculus layer by layer from the output back to the input.",
  },
  {
    term: "gradient descent",
    aliases: ["stochastic gradient descent", "SGD"],
    definition:
      "Gradient descent improves a model by repeatedly stepping its weights in the direction that most reduces the error. The stochastic version estimates that direction from a small batch of examples at a time, which is what makes training large networks practical.",
  },
  {
    term: "loss function",
    aliases: ["loss", "cost function"],
    definition:
      "The loss function is a single number that measures how wrong the model's predictions are, with lower being better. Training is the process of adjusting the weights to make this number small.",
  },
  {
    term: "overfitting",
    aliases: ["overfit", "regularization"],
    definition:
      "Overfitting is when a model memorizes its training data, including the noise, instead of the general pattern, so it does poorly on new examples. Regularization methods such as weight decay and dropout are used to hold it back.",
  },
];

export default terms;
