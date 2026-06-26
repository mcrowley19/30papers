import type { TermList } from "../types";

const terms: TermList = [
  {
    term: "message passing",
    aliases: ["message passing neural network", "MPNN", "messages"],
    definition:
      "Message passing is a way to process graphs where every node repeatedly gathers information from its neighbors. Each round, nodes send messages along their edges, combine the messages they receive, and update their own state, so information gradually spreads across the graph.",
  },
  {
    term: "graph neural network",
    aliases: ["graph neural networks", "GNN"],
    definition:
      "A graph neural network is a model that operates directly on data shaped as a graph of nodes and edges, such as a molecule. This paper shows that many such models are special cases of one shared message passing framework.",
  },
  {
    term: "node",
    aliases: ["nodes", "vertices", "atoms"],
    definition:
      "Nodes are the entities in a graph, for example the atoms in a molecule. Each node carries a feature vector that the network updates as messages arrive from its neighbors.",
  },
  {
    term: "edge",
    aliases: ["edges", "bonds"],
    definition:
      "Edges are the connections between nodes, such as the bonds between atoms. They define who can send messages to whom, and they can carry their own features that shape the messages.",
  },
  {
    term: "readout",
    aliases: ["readout function", "aggregation"],
    definition:
      "After several rounds of message passing, the readout step combines all the node states into a single vector that describes the whole graph. This graph-level summary is what gets mapped to a prediction, such as a molecule's energy.",
  },
  {
    term: "molecular property prediction",
    aliases: ["quantum chemistry", "molecular properties"],
    definition:
      "This is the task of predicting a molecule's physical or chemical properties directly from its structure, instead of running an expensive physics simulation. The paper applies message passing to predict quantities that normally require quantum chemistry calculations.",
  },
  {
    term: "invariance",
    aliases: ["invariant", "permutation invariance"],
    definition:
      "A model is invariant to a change when its output stays the same despite that change. Graph models should give the same answer no matter the order the nodes are listed in, a property called permutation invariance, which message passing naturally respects.",
  },
];

export default terms;
