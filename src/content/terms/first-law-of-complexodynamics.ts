import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "entropy",
    aliases: ["entropy", "second law", "second law of thermodynamics"],
    definition:
      "Entropy is a measure of disorder that, by the second law of thermodynamics, only increases in a closed system until it reaches equilibrium. The puzzle the essay raises is that complexity does not behave this way, since it rises and then falls while entropy keeps climbing.",
  },
  {
    term: "complexity",
    aliases: ["complexity", "complexodynamics", "interestingness"],
    definition:
      "Complexity here means how intricate or interesting a system's structure is, as opposed to how disordered it is. The essay asks for a formal quantity that starts low, peaks in the middle as interesting patterns form, and falls again as the system settles into bland equilibrium.",
  },
  {
    term: "Kolmogorov complexity",
    aliases: ["Kolmogorov complexity", "algorithmic information"],
    definition:
      "Kolmogorov complexity is the length of the shortest program that produces an object. It is a natural starting point for measuring structure, but on its own it keeps rising with disorder, so it does not capture the rise and fall of interesting complexity.",
  },
  {
    term: "sophistication",
    aliases: ["sophistication", "logical depth"],
    definition:
      "Sophistication and the related idea of logical depth try to separate meaningful structure from sheer randomness, by measuring the complexity of the patterns in an object rather than its random details. These are the candidate tools for defining a complexity that peaks and then declines.",
  },
  {
    term: "coarse-graining",
    aliases: ["coarse graining", "coarse-grained"],
    definition:
      "Coarse-graining describes a system at a blurred, lower resolution, ignoring microscopic detail. The essay suggests that the interesting complexity appears only when you look at a coarse-grained view, which is what lets structure rise and then fade as mixing completes.",
  },
  {
    term: "closed system",
    aliases: ["closed system", "isolated system"],
    definition:
      "A closed system exchanges nothing with its surroundings, so its total entropy can only increase over time. The essay is about how complexity evolves within such a system as it marches from order toward equilibrium.",
  },
];

export default terms;
