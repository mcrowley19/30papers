import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "variational autoencoder",
    aliases: ["VAE", "VAEs", "autoencoder"],
    definition:
      "A neural network with two halves: an encoder that squeezes each input down to a short summary called a code, and a decoder that tries to rebuild the input from that summary. It is trained so the codes stay tidy and predictable, which makes it possible to invent new codes and decode them into new, realistic-looking data.",
  },
  {
    term: "latent variable",
    aliases: ["latent variables", "latent code", "latent representation", "latent"],
    definition:
      "The hidden summary a model creates for each data point: a short list of numbers meant to capture what matters about it. Latent just means hidden. These values never appear in the data itself; the model invents them, and this paper is about controlling what they store.",
  },
  {
    term: "encoder",
    definition:
      "The half of an autoencoder that reads an input, such as an image, and compresses it into the short latent code.",
  },
  {
    term: "decoder",
    aliases: ["decoding distribution"],
    definition:
      "The half of the model that goes the other way: given a latent code, it produces data. The paper's key move is making the decoder powerful but deliberately near-sighted, so it handles small details on its own while the code is forced to carry the big picture.",
  },
  {
    term: "autoregressive",
    aliases: ["autoregressive model", "autoregressive models", "autoregressive decoder"],
    definition:
      "Generating something one piece at a time, where each new piece looks at the pieces produced so far, the way you write a sentence one word at a time. Autoregressive models are excellent at fine detail, which is exactly why they tend to take over all the work when paired with a VAE.",
  },
  {
    term: "PixelCNN",
    aliases: ["PixelRNN", "PixelCNN++"],
    definition:
      "A neural network that generates images one pixel at a time, predicting each pixel from the ones above and to the left of it. In this paper it plays the role of the powerful decoder that fills in local texture.",
  },
  {
    term: "generative model",
    aliases: ["generative models", "generative modeling"],
    definition:
      "Any model that learns what data looks like well enough to produce new examples, rather than just labeling examples it is given. A generative model trained on handwritten digits can write new digits that nobody ever wrote.",
  },
  {
    term: "density estimation",
    aliases: ["density estimator", "density estimation tasks"],
    definition:
      "The task of learning how probable every possible data point is. A good density estimator assigns high probability to realistic images and low probability to noise, so it is a standard way to score how well a generative model has learned the data.",
  },
  {
    term: "log-likelihood",
    aliases: ["likelihood", "marginal likelihood"],
    definition:
      "A score for how strongly a model believes in the data it is shown. Higher means the model finds the real data more probable, which means it has learned the data better. The log part is just a mathematical convenience that keeps the numbers manageable.",
  },
  {
    term: "variational lower bound",
    aliases: ["lower bound"],
    definition:
      "The quantity a VAE actually maximizes during training. The true score, the likelihood, is too hard to compute directly, so the model optimizes a guaranteed underestimate of it instead. Raising the floor pushes the true score up with it.",
  },
  {
    term: "KL divergence",
    definition:
      "A measure of how different two probability distributions are: zero when they are identical, and larger the more they disagree. In a VAE it acts as the price the model pays for storing information in the latent code.",
  },
  {
    term: "posterior",
    aliases: ["approximate posterior"],
    definition:
      "The model's best guess, after seeing a data point, about which latent codes could have produced it. It is expressed as a probability distribution: the codes the model considers plausible for that particular input.",
  },
  {
    term: "prior",
    aliases: ["prior distribution"],
    definition:
      "What the model assumes latent codes look like before seeing any data, usually something simple like a bell curve. To generate new data you draw a code from the prior and decode it. This paper upgrades the prior into a small learned model of its own, which turns out to work much better.",
  },
  {
    term: "bits-back coding",
    aliases: ["bits-back"],
    definition:
      "An idea from data compression used here to explain VAE behavior. Storing information in the latent code has a cost, measured in bits. If the decoder can predict something on its own for free, paying bits to also put it in the code is wasteful, so a well-trained model refuses to. This accounting explains exactly when the code gets ignored.",
  },
  {
    term: "information preference",
    definition:
      "The paper's name for a VAE's habit of storing information wherever it is cheapest. Anything the decoder can work out on its own stays out of the latent code. The authors turn this from a bug into a dial: by choosing what the decoder can see, they choose what the code must keep.",
  },
  {
    term: "receptive field",
    definition:
      "The patch of the input that one part of a network can actually see. By giving the decoder a small receptive field, only a few nearby pixels, the authors force everything bigger than that patch, like the overall shape of an object, into the latent code.",
  },
  {
    term: "autoregressive flow",
    aliases: ["inverse autoregressive flow", "IAF", "normalizing flow"],
    definition:
      "A trick for reshaping a simple probability distribution into a complicated one by passing samples through a learned, reversible transformation. The paper uses it to give the prior a richer shape, and shows that doing so is mathematically the same as making the decoder stronger.",
  },
  {
    term: "MNIST",
    aliases: ["OMNIGLOT", "Caltech-101", "CIFAR10"],
    definition:
      "Standard collections of small images that researchers use to compare models fairly: MNIST is handwritten digits, OMNIGLOT is handwritten characters from many alphabets, Caltech-101 Silhouettes is black outlines of objects, and CIFAR10 is tiny color photos. Reporting scores on shared datasets lets papers be compared directly.",
  },
  {
    term: "free bits",
    definition:
      "A training trick that gives the model a small allowance of information it may store in the latent code at no cost. Without it, training often collapses to not using the code at all; the allowance keeps the code alive long enough to become useful.",
  },
  {
    term: "Gaussian",
    definition:
      "The bell curve, the most common probability distribution in statistics. VAEs usually assume latent codes follow a Gaussian because it is simple to sample from and easy to reason about.",
  },
  {
    term: "hyperparameter",
    aliases: ["hyperparameters"],
    definition:
      "A setting chosen by the researcher rather than learned by the model, such as how fast it learns or how big each layer is. Getting these right is a large part of making a model train well.",
  },
  {
    term: "stochastic",
    definition:
      "A formal word for involving randomness. A stochastic process can give a different outcome each time even when it starts from the same point.",
  },
  {
    term: "factorized",
    definition:
      "Built as a product of independent pieces. A factorized distribution over an image treats each pixel as its own separate guess, which is simple but ignores how neighboring pixels relate to each other.",
  },
  {
    term: "regularizer",
    aliases: ["regularization", "regularized"],
    definition:
      "Any extra pressure added during training that discourages a model from simply memorizing its data, nudging it toward simpler solutions that work on new examples too. In a VAE, the KL divergence term plays this role.",
  },
  {
    term: "dropout",
    definition:
      "A training technique that randomly switches off parts of the network at each step so it cannot lean too heavily on any single part. Earlier work weakened the decoder with dropout to force the latent code to be used; this paper offers a more principled alternative.",
  },
  {
    term: "Bayesian",
    definition:
      "An approach to statistics where you start with an assumption, called the prior, then observe data and update your beliefs into the posterior using the rules of probability. VAEs borrow this vocabulary directly.",
  },
];

export default terms;
