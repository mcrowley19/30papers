import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "Kolmogorov complexity",
    aliases: ["Kolmogorov complexity", "algorithmic complexity", "descriptive complexity"],
    definition:
      "The Kolmogorov complexity of a string is the length of the shortest computer program that prints it. It measures how much genuine information the string contains, since a string with a short program is highly patterned and one needing a long program is essentially random.",
  },
  {
    term: "universal Turing machine",
    aliases: ["universal computer", "Turing machine", "reference machine"],
    definition:
      "A universal Turing machine is an idealized computer that can run any program. Kolmogorov complexity is defined with respect to one, which is fine because choosing a different universal machine changes the complexity by at most a fixed constant.",
  },
  {
    term: "incompressible",
    aliases: ["incompressibility", "random string", "randomness"],
    definition:
      "A string is incompressible, and in this sense random, when no program shorter than the string itself can produce it. Most strings are incompressible, which is a precise way of saying that genuine randomness cannot be summarized more briefly than by writing it out.",
  },
  {
    term: "invariance theorem",
    aliases: ["invariance theorem", "up to a constant"],
    definition:
      "The invariance theorem states that the complexity measured on any two universal machines differs only by an additive constant that does not depend on the string. This is what makes Kolmogorov complexity a well-defined property of a string rather than of a particular computer.",
  },
  {
    term: "entropy",
    aliases: ["Shannon entropy"],
    definition:
      "Entropy, from Shannon's information theory, is the average number of bits needed to encode outcomes from a known probability distribution. For data drawn from such a distribution, the expected Kolmogorov complexity per symbol matches the entropy, linking the two ideas of information.",
  },
  {
    term: "uncomputable",
    aliases: ["uncomputable", "noncomputable", "undecidable"],
    definition:
      "Kolmogorov complexity is uncomputable, meaning no algorithm can take any string and return its exact shortest program length. This follows from the same logic as the halting problem and is why practical methods only approximate it.",
  },
  {
    term: "prefix code",
    aliases: ["prefix-free", "prefix complexity"],
    definition:
      "A prefix code is one where no codeword is the start of another, so a stream of codewords can be read without ambiguity. Defining complexity with prefix-free programs makes the quantities add up cleanly and connects them tidily to probabilities.",
  },
];

export default terms;
