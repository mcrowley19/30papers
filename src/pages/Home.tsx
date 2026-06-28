import Hero from "../components/Hero";
import Colophon from "../components/Colophon";
import PaperGrid from "../components/PaperGrid";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#f3f0ea]">
      <Hero />
      <Colophon />
      <PaperGrid />
    </main>
  );
}
