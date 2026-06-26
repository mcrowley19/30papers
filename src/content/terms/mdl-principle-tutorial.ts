import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "minimum description length",
    aliases: ["minimum description length", "MDL", "MDL principle"],
    definition:
      "The minimum description length principle says the best model of some data is the one that lets you describe the data in the fewest bits, counting both the model and the data encoded with it. Learning becomes a search for the shortest overall description, which naturally balances fit against complexity.",
  },
  {
    term: "compression",
    aliases: ["compress", "coding", "code length"],
    definition:
      "Compression means encoding data in fewer bits by exploiting its regularities. MDL treats learning and compression as the same task, because any pattern a model finds is exactly what allows the data to be described more briefly.",
  },
  {
    term: "two-part code",
    aliases: ["two part code", "two-part description"],
    definition:
      "A two-part code describes data by first stating a model and then stating the data using that model. Its total length captures the MDL trade-off directly, since a more complex model costs more to state but may make the data cheaper to encode.",
  },
  {
    term: "model selection",
    aliases: ["model class", "choosing a model"],
    definition:
      "Model selection is the problem of choosing how complex a model to use, for example what degree of polynomial to fit. MDL answers it by picking whichever choice gives the shortest description of the data, with no need to set arbitrary thresholds.",
  },
  {
    term: "overfitting",
    aliases: ["overfit", "over-fitting"],
    definition:
      "Overfitting is when a model is so flexible that it fits the noise in the data rather than the underlying pattern. MDL guards against it automatically, because an overly complex model takes many bits to state and so rarely yields the shortest total description.",
  },
  {
    term: "Kolmogorov complexity",
    aliases: ["Kolmogorov complexity", "algorithmic complexity"],
    definition:
      "Kolmogorov complexity is the length of the shortest computer program that outputs a given object, the ultimate measure of how compressible it is. It is the ideal that MDL approximates with practical, computable codes.",
  },
  {
    term: "universal coding",
    aliases: ["universal code", "stochastic complexity", "normalized maximum likelihood"],
    definition:
      "Universal coding builds a single code that compresses data almost as well as the best model in a whole family, without knowing in advance which model is best. It gives modern MDL a principled way to measure a model class's complexity.",
  },
];

export default terms;
