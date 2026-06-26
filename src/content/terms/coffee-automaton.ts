import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "cellular automaton",
    aliases: ["cellular automaton", "cellular automata", "automaton"],
    definition:
      "A cellular automaton is a grid of cells that update together by simple local rules, each cell changing based on its neighbors. The paper uses one as a toy model of cream mixing into coffee, simple enough to measure yet rich enough to show complexity rise and fall.",
  },
  {
    term: "entropy",
    aliases: ["entropy", "second law"],
    definition:
      "Entropy measures disorder and, by the second law of thermodynamics, only increases in a closed system until everything is uniformly mixed. In the model it climbs steadily, which is why it cannot by itself explain why interesting structure appears only temporarily.",
  },
  {
    term: "complexity",
    aliases: ["complexity", "apparent complexity"],
    definition:
      "Complexity here is the amount of genuine structure in the pattern, the swirls and tendrils, as opposed to plain disorder. The paper's apparent complexity is defined to be low when the system is fully ordered or fully mixed, and high in between, matching intuition about the coffee.",
  },
  {
    term: "coarse-graining",
    aliases: ["coarse graining", "coarse-grained", "smoothing"],
    definition:
      "Coarse-graining blurs the grid to a lower resolution before measuring it, ignoring the finest details. This step is essential to the result, because the interesting complexity shows up only in the smoothed view and vanishes if you track every cell exactly.",
  },
  {
    term: "apparent complexity",
    aliases: ["apparent complexity", "structure"],
    definition:
      "Apparent complexity is the paper's proposed measure, the compressed size of the coarse-grained state. It captures how much structure a blurred snapshot contains, and it is what rises as the cream forms tendrils and falls once everything is uniformly mixed.",
  },
  {
    term: "equilibrium",
    aliases: ["equilibrium", "well-mixed", "well mixed"],
    definition:
      "Equilibrium is the final, well-mixed state where nothing interesting changes and the coffee looks uniform. Complexity is near zero both at the start, when the layers are cleanly separated, and at equilibrium, peaking only during the mixing in between.",
  },
];

export default terms;
