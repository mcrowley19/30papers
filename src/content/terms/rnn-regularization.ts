import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "regularization",
    aliases: ["regularisation", "regularize", "regularizing"],
    definition:
      "Regularization is any technique that discourages a model from fitting the quirks of its training data so it generalizes better to new data. This paper is about how to regularize large recurrent networks without harming their ability to remember.",
  },
  {
    term: "dropout",
    definition:
      "Dropout randomly switches off a fraction of units during training, forcing the network to spread its knowledge across many units rather than relying on a few. The paper's main insight is how to apply it to recurrent networks correctly.",
  },
  {
    term: "LSTM",
    aliases: ["long short-term memory", "LSTMs"],
    definition:
      "An LSTM is a recurrent network with a protected memory cell and gates that control what it remembers, designed to carry information across many time steps. These are the models the paper regularizes.",
  },
  {
    term: "recurrent connection",
    aliases: ["recurrent connections", "recurrent", "non-recurrent connections"],
    definition:
      "Recurrent connections are the links that carry the hidden state from one time step to the next, forming the network's memory. The key recommendation is to apply dropout only to the non-recurrent connections, so the memory passing along the recurrent connections is left intact.",
  },
  {
    term: "overfitting",
    aliases: ["overfit"],
    definition:
      "Overfitting is when a model memorizes its training examples instead of the underlying pattern, so it does well in training but poorly on new data. Large recurrent networks overfit easily, which is the problem this paper addresses.",
  },
  {
    term: "hidden state",
    aliases: ["memory", "cell state"],
    definition:
      "The hidden state is the running summary a recurrent network carries forward as it reads a sequence. Disrupting it with dropout would erase memories, which is why dropout is kept off the path that carries it.",
  },
];

export default terms;
