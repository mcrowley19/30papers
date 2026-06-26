import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "end-to-end",
    aliases: ["end to end", "end-to-end learning"],
    definition:
      "An end-to-end system learns to map raw input straight to the final output with a single trained model, instead of being built from many separately engineered stages. Deep Speech 2 turns audio directly into text, replacing the hand-built pipeline of traditional speech recognizers.",
  },
  {
    term: "connectionist temporal classification",
    aliases: ["CTC", "connectionist temporal classification (CTC)"],
    definition:
      "CTC is a training method that lets the model output text without being told exactly which audio frame lines up with which letter. It sums over all the ways the letters could be aligned to the audio, so the network can learn from just the audio and its transcript.",
  },
  {
    term: "recurrent neural network",
    aliases: ["recurrent neural networks", "RNN", "RNNs", "recurrent"],
    definition:
      "A recurrent neural network processes a sequence step by step while carrying a hidden state, which makes it well suited to audio that unfolds over time. Deep Speech 2 stacks many recurrent layers to turn a stream of sound features into characters.",
  },
  {
    term: "spectrogram",
    aliases: ["spectrograms", "log spectrogram", "audio features"],
    definition:
      "A spectrogram is a picture of sound that shows how much energy is present at each frequency over time. It is the standard input to the model, summarizing the raw waveform in a form that highlights the patterns of speech.",
  },
  {
    term: "language model",
    aliases: ["language modeling", "n-gram language model"],
    definition:
      "A language model scores how likely a sequence of words is, capturing what natural sentences look like. Deep Speech 2 combines its acoustic predictions with a language model during decoding to favor transcriptions that read like real language.",
  },
  {
    term: "beam search",
    definition:
      "Beam search is a decoding strategy that keeps the several most promising partial transcriptions at each step rather than committing to just one. This widens the search for the best overall sentence without the cost of considering every possibility.",
  },
  {
    term: "batch normalization",
    aliases: ["batch norm", "batch normalisation"],
    definition:
      "Batch normalization rescales the signals inside the network using statistics from the current batch, keeping them in a stable range. The paper adapts it to recurrent networks to make their many layers train faster and more reliably.",
  },
];

export default terms;
