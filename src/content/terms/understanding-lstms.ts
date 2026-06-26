import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "recurrent neural network",
    aliases: ["recurrent neural networks", "recurrent", "RNN", "RNNs"],
    definition:
      "A recurrent neural network reads a sequence one element at a time while carrying a hidden state that summarizes what it has seen so far. This loop lets it handle inputs of any length, such as sentences or time series, where order matters.",
  },
  {
    term: "LSTM",
    aliases: ["long short-term memory", "long short term memory", "LSTMs"],
    definition:
      "An LSTM, or long short-term memory network, is a kind of recurrent network designed to remember information over many steps. It keeps a protected cell state and uses small gates to decide what to add, keep, or discard, which solves the problem of ordinary RNNs forgetting too quickly.",
  },
  {
    term: "cell state",
    aliases: ["cell"],
    definition:
      "The cell state is the LSTM's long term memory, a vector that runs straight along the chain of time steps with only minor, gated edits. Because information can travel along it almost unchanged, the network can carry context across long gaps.",
  },
  {
    term: "gate",
    aliases: ["gates", "forget gate", "input gate", "output gate", "gating"],
    definition:
      "A gate is a small learned component that outputs values between zero and one and multiplies them into the information flow, acting like an adjustable valve. LSTMs use a forget gate, an input gate, and an output gate to control what the cell state remembers, updates, and exposes.",
  },
  {
    term: "hidden state",
    definition:
      "The hidden state is the network's working summary of the sequence so far, updated at every step and passed to the next. In an LSTM it is the gated readout of the cell state, and it is what later layers or predictions are based on.",
  },
  {
    term: "sigmoid",
    aliases: ["sigmoid function", "logistic function"],
    definition:
      "The sigmoid is an S-shaped function that squashes any number into the range between zero and one. LSTM gates use it because that range is perfect for expressing how much of a signal to let through, from none to all of it.",
  },
  {
    term: "vanishing gradient",
    aliases: ["vanishing gradients", "long-term dependencies"],
    definition:
      "When an ordinary recurrent network is trained, the error signal is multiplied at every step as it travels back in time and tends to shrink toward zero, so the network struggles to connect events that are far apart. The protected cell state of the LSTM is what lets these long-term dependencies survive.",
  },
  {
    term: "tanh",
    aliases: ["hyperbolic tangent"],
    definition:
      "The tanh function squashes numbers into the range between minus one and one. LSTMs use it to create and read out candidate values for the cell state, keeping those values in a bounded, well behaved range.",
  },
];

export default terms;
