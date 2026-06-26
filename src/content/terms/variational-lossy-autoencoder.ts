import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "variational autoencoder",
    aliases: ["variational autoencoder", "VAE", "autoencoder"],
    definition:
      "A variational autoencoder learns to compress data into a small random latent code and then reconstruct it. It is trained so that the codes follow a simple distribution, which means you can sample new codes and decode them into fresh, realistic examples.",
  },
  {
    term: "latent variable",
    aliases: ["latent variables", "latent code", "latent", "latent representation"],
    definition:
      "A latent variable is a hidden, compressed description of a data point that the model infers rather than observes. In an autoencoder it is the code the encoder produces, meant to capture the essential content of the input in far fewer numbers.",
  },
  {
    term: "autoregressive",
    aliases: ["autoregressive model", "autoregressive decoder", "PixelCNN"],
    definition:
      "An autoregressive model generates data one piece at a time, with each piece conditioned on the ones already produced. Pairing such a powerful decoder with a VAE is central to this paper, because it changes what the latent code ends up representing.",
  },
  {
    term: "lossy compression",
    aliases: ["lossy", "lossy code"],
    definition:
      "Lossy compression keeps only some information and discards the rest, like a JPEG that drops fine detail. The paper shows how to make the latent code lossy on purpose, so it captures global structure while leaving local texture to the decoder.",
  },
  {
    term: "information preference",
    aliases: ["information preference", "what information"],
    definition:
      "The paper analyzes which information a latent variable model prefers to store in its code versus model directly in the decoder. Understanding this lets the designer steer the code toward the high-level features they care about.",
  },
  {
    term: "bits-back",
    aliases: ["bits back", "bits-back coding", "minimum description length"],
    definition:
      "Bits-back is an information-theoretic view that connects the autoencoder's training objective to the number of bits needed to encode the data. It explains the cost of using the latent code and why a strong decoder may push the model to ignore it.",
  },
  {
    term: "prior",
    aliases: ["prior distribution", "autoregressive prior"],
    definition:
      "The prior is the simple distribution the latent codes are expected to follow, which you sample from to generate new data. The paper improves results by giving the prior its own learned, autoregressive structure rather than a plain fixed shape.",
  },
];

export default terms;
