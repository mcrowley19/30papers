import { useEffect, useMemo, type ComponentType } from "react";
import { papers } from "../data/papers";
import Seo from "../components/Seo";
import PaperSection from "../components/PaperSection";
import { homeMeta } from "../lib/seo";
import HeroWordmark from "../components/HeroWordmark";
import LandingMotionToggle from "../components/LandingMotionToggle";
import { LandingMotionProvider } from "../context/LandingMotionContext";
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

export default function Home() {
  const seo = useMemo(() => homeMeta(), []);

  // Snap on the landing page only: every scroll settles on the hero or a
  // paper (never between two), and a hard fling still has to pass through
  // each section, so nothing gets skipped by accident.
  useEffect(() => {
    const root = document.documentElement;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    root.style.scrollSnapType = desktop ? "y mandatory" : "y proximity";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, []);

  return (
    <LandingMotionProvider>
      {/* overflow-x-clip, not hidden: hidden would make <main> a scroll
          container and capture the sections' snap points away from the page. */}
      <main className="landing-paper min-h-screen overflow-x-clip">
        <Seo {...seo} />
        <LandingMotionToggle />
        <header className="relative w-full snap-start px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-0 sm:pt-0">
          <h1 className="relative flex min-h-[17rem] h-[50vh] w-full items-center justify-center sm:block sm:h-[58vh] sm:min-h-[22rem]">
            <span className="sr-only">30 papers</span>
            <HeroWordmark />
          </h1>
          <div className="margin-plate mr-auto ml-0 mt-4 w-[min(24rem,100%)] text-pretty sm:ml-12 sm:mt-2 sm:w-[min(22rem,88vw)]">
            <p className="font-serif text-sm leading-relaxed text-ink-soft">
              This website is based on a rumoured list of papers that Ilya Sutskever gave to John Carmack. We currently
              only have a list of 27. If you or anyone you know has the full, canonical list please{" "}
              <a
                href="https://michaelcrowley.dev"
                className="text-cover underline decoration-from-font underline-offset-2 transition-colors hover:text-ink"
              >
                feel free to reach out
              </a>
              .
            </p>
          </div>
        </header>

        {papers.map((paper) => {
          const Background = BACKGROUNDS[paper.slug];
          return (
            <PaperSection
              key={paper.slug}
              paper={paper}
              background={<Background className={INSET} />}
            />
          );
        })}
      </main>
    </LandingMotionProvider>
  );
}
