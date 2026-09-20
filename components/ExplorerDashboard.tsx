"use client";

import dynamic from "next/dynamic";
import { Box, Maximize2, Minimize2, MousePointer2, Rotate3D, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGaiaData } from "@/hooks/useGaiaData";
import { ColorSummary } from "./ColorSummary";
import { FiltersPanel, type NumericRange } from "./FiltersPanel";
import { ReferenceMap } from "./ReferenceMap";
import { StarDetailsPanel } from "./StarDetailsPanel";
import type { GaiaStats, StarCategory, StarPoint } from "./star-data";

const StarMap3D = dynamic(() => import("./StarMap3D"), {
  ssr: false,
  loading: () => <div className="plot-loading">Cargando catálogo Gaia...</div>,
});
const allCategories: StarCategory[] = ["Más azulada", "Intermedia", "Más rojiza"];

export function ExplorerDashboard() {
  const gaia = useGaiaData();
  if (gaia.status === "loading") return <ExplorerState message="Cargando catálogo Gaia..." />;
  if (gaia.status === "error") return <ExplorerState message="No fue posible cargar el dataset." />;
  return <LoadedExplorer stars={gaia.data.stars} stats={gaia.data.stats} />;
}

function LoadedExplorer({ stars, stats }: { stars: StarPoint[]; stats: GaiaStats }) {
  const fullBpRp = useMemo<NumericRange>(() => [stats.bpRpMin, stats.bpRpMax], [stats]);
  const fullDistance = useMemo<NumericRange>(() => [stats.distanceMin, stats.distanceMax], [stats]);
  const [active, setActive] = useState<StarCategory[]>(allCategories);
  const [selected, setSelected] = useState<StarPoint | null>(null);
  const [bpRpRange, setBpRpRange] = useState<NumericRange>(fullBpRp);
  const [distanceRange, setDistanceRange] = useState<NumericRange>(fullDistance);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showClusterMatches, setShowClusterMatches] = useState(false);
  const [onlyClusterMatches, setOnlyClusterMatches] = useState(false);
  const visibleStars = useMemo(
    () => stars.filter((star) => active.includes(star.category) && star.bpRp >= bpRpRange[0] && star.bpRp <= bpRpRange[1] && star.distance >= distanceRange[0] && star.distance <= distanceRange[1] && (!onlyClusterMatches || Boolean(star.clusterMembership))),
    [active, bpRpRange, distanceRange, onlyClusterMatches, stars],
  );
  const clusterCounts = useMemo(() => stars.reduce<Map<string, number>>((counts, star) => {
    const name = star.clusterMembership?.name;
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    return counts;
  }, new Map()), [stars]);

  useEffect(() => {
    function leavePresentation(event: KeyboardEvent) {
      if (event.key === "Escape") setPresentationMode(false);
    }
    window.addEventListener("keydown", leavePresentation);
    const firstResize = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
    const finalResize = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 420);
    return () => {
      window.removeEventListener("keydown", leavePresentation);
      window.clearTimeout(firstResize);
      window.clearTimeout(finalResize);
    };
  }, [presentationMode]);

  function toggleCategory(category: StarCategory) {
    setActive((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
    setSelected(null);
  }
  function reset() {
    setActive(allCategories);
    setBpRpRange(fullBpRp);
    setDistanceRange(fullDistance);
    setShowClusterMatches(false);
    setOnlyClusterMatches(false);
    setSelected(null);
  }

  return <section id="visualizaciones" className={`explorer-section${presentationMode ? " presentation-mode" : ""}`}>
    <div className="explorer-heading"><div><p className="eyebrow"><Box size={14} /> Explorador tridimensional</p><h2>Distribución 3D de la muestra Gaia DR3</h2></div><div className="explorer-heading-actions"><p>Cada punto representa una fuente astronómica real de nuestra muestra.</p><button className="presentation-button" type="button" aria-label={presentationMode ? "Salir del modo presentación" : "Activar modo presentación"} aria-pressed={presentationMode} onClick={() => setPresentationMode((current) => !current)}>{presentationMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}{presentationMode ? "Salir de presentación" : "Modo presentación"}</button></div></div>
    <div className="explorer-grid">
      <FiltersPanel active={active} onToggle={toggleCategory} onReset={reset} bpRpRange={bpRpRange} distanceRange={distanceRange} fullBpRp={fullBpRp} fullDistance={fullDistance} onBpRpChange={setBpRpRange} onDistanceChange={setDistanceRange} stats={stats} visibleCount={visibleStars.length} showClusterMatches={showClusterMatches} onlyClusterMatches={onlyClusterMatches} onShowClusterMatches={setShowClusterMatches} onOnlyClusterMatches={setOnlyClusterMatches} />
      <div className="map-stage">
        <div className="map-console-header">
          <div><span>VISUALIZACIÓN 01</span><h3>Distribución tridimensional de la muestra</h3><p>Cada punto representa una fuente astronómica del catálogo procesado.</p></div>
          <div className="map-console-tags"><span>Gaia DR3</span><span>XYZ · PC</span></div>
        </div>
        <div className="map-visual">
          <div className="map-toolbar"><span><span className="live-dot" /> ESPACIO CARTESIANO · PC</span><div><Search size={15} /><Rotate3D size={16} /><MousePointer2 size={15} /></div></div>
          <StarMap3D stars={visibleStars} showClusterMatches={showClusterMatches} onSelect={setSelected} />
          <div className="presentation-signature"><strong>Astrogirls</strong><span>Gaia DR3 · {new Intl.NumberFormat("es-CL").format(stats.analyzedCount)} fuentes analizadas · {stats.distanceMean.toFixed(2)} pc distancia media</span></div>
          <div className="map-help"><span>Arrastra para rotar</span><span>Rueda para acercar</span><span>Selecciona un punto</span></div>
        </div>
      </div>
      <aside className="right-rail"><StarDetailsPanel key={selected?.source ?? "empty"} star={selected} q1={stats.q1} q3={stats.q3} clusterSampleCount={selected?.clusterMembership ? clusterCounts.get(selected.clusterMembership.name) : undefined} /><ColorSummary counts={stats.categoryCounts} /><ReferenceMap stars={visibleStars} /></aside>
    </div>
  </section>;
}

function ExplorerState({ message }: { message: string }) {
  return <section id="visualizaciones" className="explorer-section"><div className="explorer-heading"><div><p className="eyebrow"><Box size={14} /> Explorador tridimensional</p><h2>Distribución 3D de la muestra Gaia DR3</h2></div></div><div className="explorer-state">{message}</div></section>;
}
