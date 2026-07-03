import { useEffect, type ComponentType } from "react";
import { papers } from "../data/papers";
import PaperSection from "../components/PaperSection";
import TitleAscii from "../components/TitleAscii";
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

type Bg = ComponentType<{ className?: string; dark?: boolean }>;

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

// From ResNet (paper 10) down, every backdrop gets a small upward spill so each
// pattern rises across the seam and links into the section above.
const FIELD_SPILL = "pointer-events-none absolute bottom-0 left-0 w-full h-[116vh]";
const SPILL_FROM_INDEX = 9;

export default function Home() {
  // Snap on the landing page only: every scroll settles on the hero or a
  // paper (never between two), and a hard fling still has to pass through
  // each section, so nothing gets skipped by accident.
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollSnapType = "y mandatory";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, []);

  return (
    // overflow-x-clip, not hidden: hidden would make <main> a scroll
    // container and capture the sections' snap points away from the page.
    <main className="landing-paper min-h-screen overflow-x-clip">
      <header className="relative w-full snap-start px-4 pt-10 sm:pt-14">
        <h1 className="relative block h-[30vh] min-h-[12rem] w-full sm:h-[44vh]">
          <span className="sr-only">30 papers</span>
          <TitleAscii className="absolute inset-0 h-full w-full" />
        </h1>
      </header>

      {papers.map((paper, i) => {
        const Background = BACKGROUNDS[paper.slug];
        const spill = SPILL[paper.slug] ?? (i >= SPILL_FROM_INDEX ? FIELD_SPILL : undefined);
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
