import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "pipeline parallelism",
    aliases: ["pipeline parallel", "pipelining"],
    definition:
      "Pipeline parallelism splits a deep network into consecutive groups of layers and places each group on a different accelerator. As data flows through, each device works on a different stage at the same time, much like stations on an assembly line, so a model too big for one device can still be trained.",
  },
  {
    term: "model parallelism",
    aliases: ["model parallel"],
    definition:
      "Model parallelism means splitting a single model across several devices because it is too large to fit on one. It contrasts with data parallelism, where each device holds a full copy of the model and processes different examples.",
  },
  {
    term: "mini-batch",
    aliases: ["mini batch", "minibatch", "batch"],
    definition:
      "A mini-batch is the group of training examples processed together before the model's weights are updated once. Its size affects both how stable the learning is and how much work can be done in parallel.",
  },
  {
    term: "micro-batch",
    aliases: ["micro batch", "micro-batches", "batch-splitting"],
    definition:
      "GPipe's key trick is to chop each mini-batch into smaller micro-batches and push them through the pipeline one after another. This keeps every device busy on a different micro-batch instead of sitting idle, which is what makes the speedup nearly linear in the number of devices.",
  },
  {
    term: "accelerator",
    aliases: ["accelerators", "device", "devices"],
    definition:
      "An accelerator is a specialized chip such as a GPU or TPU built to run the heavy matrix arithmetic of neural networks quickly. GPipe is about training one network across many accelerators at once.",
  },
  {
    term: "re-materialization",
    aliases: ["rematerialization", "gradient checkpointing", "recomputation"],
    definition:
      "Re-materialization saves memory by discarding the intermediate activations from the forward pass and recomputing them when they are needed during the backward pass. Trading a little extra computation for much less memory lets GPipe fit far larger models.",
  },
  {
    term: "backward pass",
    aliases: ["backpropagation", "backward"],
    definition:
      "The backward pass is the stage of training where the model works out how each weight contributed to the error and computes the gradients used to update them. It needs the values from the forward pass, which is why memory and scheduling across the pipeline matter.",
  },
  {
    term: "bubble",
    aliases: ["pipeline bubble", "idle time"],
    definition:
      "A bubble is idle time on a device while it waits for data from an earlier or later pipeline stage, especially at the start and end of each batch. Using many micro-batches shrinks the bubble's share of the total time.",
  },
];

export default terms;
