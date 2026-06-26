import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "minimum description length",
    aliases: ["minimum description length", "MDL", "description length"],
    definition:
      "The minimum description length principle says the best model is the one that, together with the data it explains, can be described in the fewest bits. This paper applies that idea to neural networks, treating a good network as one whose weights are cheap to describe.",
  },
  {
    term: "description length of the weights",
    aliases: ["description length of the weights", "coding cost", "bits to describe"],
    definition:
      "This is the number of bits it would take to communicate the network's weights. The paper argues that keeping this small leads to better generalization, since a network that needs few bits to specify has not memorized the training data.",
  },
  {
    term: "noisy weights",
    aliases: ["noisy weights", "weight noise", "noise"],
    definition:
      "Instead of exact numbers, the weights are treated as having added random noise. A noisier weight can be communicated in fewer bits, so deliberately allowing noise is how the method keeps the description length of the weights low.",
  },
  {
    term: "generalization",
    aliases: ["generalization", "generalisation", "generalize"],
    definition:
      "Generalization is how well a model performs on new data it was not trained on. The central claim is that simpler networks, those whose weights carry little information, generalize better, which is why minimizing description length helps.",
  },
  {
    term: "free energy",
    aliases: ["free energy", "variational", "expected description length"],
    definition:
      "The quantity being minimized can be written as a free energy, a sum of the data misfit and a penalty for the information in the weights. This is an early example of the variational ideas that later became central to training probabilistic models.",
  },
  {
    term: "prior",
    aliases: ["prior", "prior distribution", "coding distribution"],
    definition:
      "A prior is an assumed distribution over the weights, used to decide how many bits each weight value costs to encode. Weights that agree with the prior are cheap, so the choice of prior shapes which networks the method considers simple.",
  },
  {
    term: "overfitting",
    aliases: ["overfitting", "overfit"],
    definition:
      "Overfitting is when a network fits the noise in its training data and so does poorly on new data. Charging bits for the information stored in the weights discourages the overly precise weights that overfitting requires.",
  },
];

export default terms;
