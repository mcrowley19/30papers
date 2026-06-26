import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "relational reasoning",
    aliases: ["relational reasoning", "relations", "relational"],
    definition:
      "Relational reasoning is figuring out how things relate to one another, for example which object is larger or nearer, rather than just recognizing each thing on its own. The paper builds a module that gives neural networks this ability in a simple, reusable way.",
  },
  {
    term: "relation network",
    aliases: ["relation networks", "RN", "relation module"],
    definition:
      "A relation network is a small plug-in module that considers every pair of objects, passes each pair through the same little neural network, and adds up the results. By construction it forces the model to think in terms of relationships between objects.",
  },
  {
    term: "object",
    aliases: ["objects"],
    definition:
      "In this work an object is just one of the items the model reasons over, such as a region of an image or an entry in a list. The objects are not labeled as such in advance; the network learns to treat parts of its input as the things to relate.",
  },
  {
    term: "visual question answering",
    aliases: ["VQA", "question answering"],
    definition:
      "Visual question answering is the task of answering a natural language question about an image, such as asking what is in front of the red cube. It often demands relational reasoning, which is why it is used to test the relation network.",
  },
  {
    term: "convolutional neural network",
    aliases: ["CNN", "convolutional"],
    definition:
      "A convolutional neural network scans an image with learnable filters to produce a grid of feature vectors. In this paper its output cells become the set of objects that the relation network then reasons about.",
  },
  {
    term: "multi-layer perceptron",
    aliases: ["MLP", "multilayer perceptron"],
    definition:
      "A multi-layer perceptron is a basic neural network of fully connected layers. The relation network uses small perceptrons both to process each pair of objects and to turn the combined result into an answer.",
  },
];

export default terms;
