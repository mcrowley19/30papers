import type { ComponentType } from "react";
import { papers } from "../data/papers";
import PaperSection from "../components/PaperSection";
import BottleneckBackground from "../components/BottleneckBackground";
import CodeLengthBackground from "../components/CodeLengthBackground";
import CoffeeAutomatonBackground from "../components/CoffeeAutomatonBackground";
import ComplexodynamicsBackground from "../components/ComplexodynamicsBackground";
import KolmogorovBackground from "../components/KolmogorovBackground";
import {
  MdlBackground,
  MachineSuperIntelligenceBackground,
  Cs231nBackground,
  AlexNetBackground,
  ResNetBackground,
  DilatedBackground,
} from "../components/PaperBackgroundsA";
import {
  IdentityMappingsBackground,
  RnnRegularizationBackground,
  CharRnnBackground,
  LstmBackground,
  DeepSpeechBackground,
  AnnotatedTransformerBackground,
} from "../components/PaperBackgroundsB";
import {
  RelationalReasoningBackground,
  NeuralTuringBackground,
  OrderMattersBackground,
  RelationalRecurrentBackground,
  AttentionBackground,
} from "../components/PaperBackgroundsC";
import {
  NeuralMtBackground,
  PointerNetworksBackground,
  MessagePassingBackground,
  ScalingLawsBackground,
  GPipeBackground,
} from "../components/PaperBackgroundsD";

type Bg = ComponentType<{ className?: string }>;

// One animated backdrop per paper.
const BACKGROUNDS: Record<string, Bg> = {
  "variational-lossy-autoencoder": BottleneckBackground,
  "keeping-neural-networks-simple": CodeLengthBackground,
  "coffee-automaton": CoffeeAutomatonBackground,
  "first-law-of-complexodynamics": ComplexodynamicsBackground,
  "kolmogorov-complexity": KolmogorovBackground,
  "mdl-principle-tutorial": MdlBackground,
  "machine-super-intelligence": MachineSuperIntelligenceBackground,
  cs231n: Cs231nBackground,
  alexnet: AlexNetBackground,
  "deep-residual-learning": ResNetBackground,
  "dilated-convolutions": DilatedBackground,
  "identity-mappings-resnets": IdentityMappingsBackground,
  "rnn-regularization": RnnRegularizationBackground,
  "unreasonable-effectiveness-of-rnns": CharRnnBackground,
  "understanding-lstms": LstmBackground,
  "deep-speech-2": DeepSpeechBackground,
  "annotated-transformer": AnnotatedTransformerBackground,
  "relational-reasoning": RelationalReasoningBackground,
  "neural-turing-machines": NeuralTuringBackground,
  "order-matters": OrderMattersBackground,
  "relational-recurrent-networks": RelationalRecurrentBackground,
  "attention-is-all-you-need": AttentionBackground,
  "neural-machine-translation": NeuralMtBackground,
  "pointer-networks": PointerNetworksBackground,
  "neural-message-passing": MessagePassingBackground,
  "scaling-laws": ScalingLawsBackground,
  gpipe: GPipeBackground,
};

const INSET = "absolute inset-0 h-full w-full";

// Bespoke sections whose backdrop spills up across the seam into the one above.
const SPILL: Record<string, string> = {
  "coffee-automaton": "pointer-events-none absolute bottom-0 left-0 w-full h-[150vh]",
  "first-law-of-complexodynamics": "pointer-events-none absolute bottom-0 left-0 w-full h-[150vh]",
  "kolmogorov-complexity": "pointer-events-none absolute bottom-0 left-0 w-full h-[116vh]",
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-ink">
      <div className="mx-auto max-w-3xl px-6 pt-16 sm:pt-24">
        <h1 className="font-serif text-4xl sm:text-5xl">30 papers</h1>
      </div>

      {papers.map((paper) => {
        const Background = BACKGROUNDS[paper.slug];
        const spill = SPILL[paper.slug];
        return (
          <PaperSection
            key={paper.slug}
            paper={paper}
            overflowVisible={!!spill}
            background={<Background className={spill ?? INSET} />}
          />
        );
      })}
    </main>
  );
}
