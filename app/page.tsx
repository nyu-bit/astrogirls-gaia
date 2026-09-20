import { DataExhibition } from "@/components/DataExhibition";
import { ExplorerDashboard } from "@/components/ExplorerDashboard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Metrics />
      <ExplorerDashboard />
      <DataExhibition />
      <Footer />
    </main>
  );
}
