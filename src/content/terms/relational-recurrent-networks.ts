import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "relational memory",
    aliases: ["relational memory core", "RMC", "relational"],
    definition:
      "Relational memory is a memory whose stored items can interact with one another, not just sit side by side. The paper proposes a memory core that lets each remembered piece attend to the others, so the network can reason about how its memories relate over time.",
  },
  {
    term: "self-attention",
    aliases: ["self attention", "attention"],
    definition:
      "Self-attention lets each item in a set look at all the other items and pull in information from the relevant ones. Here it is applied among the slots of a memory, allowing stored memories to influence each other as the sequence unfolds.",
  },
  {
    term: "recurrent neural network",
    aliases: ["recurrent neural networks", "RNN", "recurrent"],
    definition:
      "A recurrent neural network carries a memory forward as it reads a sequence step by step. This paper upgrades that memory so its contents can interact, combining the sequence handling of recurrence with relational reasoning.",
  },
  {
    term: "memory slot",
    aliases: ["memory slots", "memory", "slots"],
    definition:
      "The memory is organized into a set of slots, each a vector that can hold a separate piece of information. Self-attention runs across the slots so each one can be updated using the contents of the others.",
  },
  {
    term: "multi-head attention",
    aliases: ["multi head attention", "attention heads"],
    definition:
      "Multi-head attention runs several attention operations in parallel, each able to focus on a different kind of relationship. Within the relational memory this lets the slots interact along multiple dimensions at once.",
  },
  {
    term: "gating",
    aliases: ["gates", "gated"],
    definition:
      "Gating uses learned values between zero and one to control how much new information replaces what is already stored. As in an LSTM, it lets the memory decide what to keep and what to overwrite at each step.",
  },
];

export default terms;
