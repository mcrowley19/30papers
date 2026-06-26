import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "universal intelligence",
    aliases: ["universal intelligence", "intelligence measure", "machine intelligence"],
    definition:
      "Universal intelligence is the dissertation's formal definition of intelligence as an agent's ability to achieve goals across a very wide range of environments. It scores an agent by its average performance over all computable environments, with simpler environments weighted more heavily.",
  },
  {
    term: "reinforcement learning",
    aliases: ["reinforcement learning", "agent", "reward"],
    definition:
      "Reinforcement learning is the setting where an agent takes actions in an environment and receives rewards, learning to act so as to maximize the reward it collects over time. It provides the agent-and-environment framework in which the thesis measures intelligence.",
  },
  {
    term: "AIXI",
    aliases: ["AIXI", "universal agent", "optimal agent"],
    definition:
      "AIXI is a theoretical agent that behaves optimally in any computable environment by combining reward maximization with a universal way of predicting what the environment will do. It is uncomputable and so cannot be built directly, but it serves as the ideal that defines perfect intelligence.",
  },
  {
    term: "Solomonoff induction",
    aliases: ["Solomonoff induction", "universal prediction", "universal prior"],
    definition:
      "Solomonoff induction is an idealized method of prediction that considers every possible computer program that could have generated the data and weights shorter programs more heavily. It is the gold standard of learning from experience and underlies how AIXI models its world.",
  },
  {
    term: "Kolmogorov complexity",
    aliases: ["Kolmogorov complexity", "algorithmic complexity"],
    definition:
      "Kolmogorov complexity is the length of the shortest program that produces an object, a measure of its simplicity. It supplies the formal version of Occam's razor used throughout the thesis, favoring simpler environments and hypotheses.",
  },
  {
    term: "Occam's razor",
    aliases: ["Occam's razor", "simplicity", "simplicity bias"],
    definition:
      "Occam's razor is the principle that simpler explanations should be preferred. The thesis turns this intuition into mathematics by using program length to define simplicity, which is how it weights environments when measuring intelligence.",
  },
];

export default terms;
