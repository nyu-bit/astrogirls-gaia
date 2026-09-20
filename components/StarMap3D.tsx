"use client";

import { LocateFixed, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { Config, Data, Layout, PlotMouseEvent } from "plotly.js";
import Plot from "react-plotly.js";
import { useRef, useState } from "react";
import { categoryColors, type StarCategory, type StarPoint } from "./star-data";

type Props = { stars: StarPoint[]; showClusterMatches: boolean; onSelect: (star: StarPoint) => void };

const initialCamera = { center: { x: 0, y: 0, z: 0 }, eye: { x: 1.22, y: 1.22, z: 0.9 }, up: { x: 0, y: 0, z: 1 } };
const solarCamera = { center: { x: 0, y: 0, z: 0 }, eye: { x: 0.78, y: 0.78, z: 0.48 }, up: { x: 0, y: 0, z: 1 } };

export default function StarMap3D({ stars, showClusterMatches, onSelect }: Props) {
  const [camera, setCamera] = useState(initialCamera);
  const cameraRef = useRef(initialCamera);
  const [cameraRevision, setCameraRevision] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const categories = Object.keys(categoryColors) as StarCategory[];
  const traces: Data[] = categories.map((category) => {
    const categoryStars = stars.filter((star) => star.category === category);
    return { type: "scatter3d", mode: "markers", name: category, x: categoryStars.map((star) => star.x), y: categoryStars.map((star) => star.y), z: categoryStars.map((star) => star.z), customdata: categoryStars.map((star) => star.source), text: categoryStars.map(hoverText), hovertemplate: "%{text}<extra></extra>", marker: { color: categoryColors[category], size: 3, opacity: 0.84, line: { color: "rgba(255,255,255,.48)", width: 0.3 } } };
  });
  if (showClusterMatches) {
    const matches = stars.filter((star) => star.clusterMembership);
    traces.push({ type: "scatter3d", mode: "markers", name: "Coincidencia con agrupación", x: matches.map((star) => star.x), y: matches.map((star) => star.y), z: matches.map((star) => star.z), customdata: matches.map((star) => star.source), text: matches.map(hoverText), hovertemplate: "%{text}<extra></extra>", marker: { color: "#F5F1F2", symbol: "diamond-open", size: 6, opacity: 0.95, line: { color: "#E7BDD4", width: 2 } } });
  }
  traces.push({ type: "scatter3d", mode: "markers+text", name: "Sol — origen", x: [0], y: [0], z: [0], text: ["Sol"], textposition: "middle right", hovertemplate: "Sol — origen del sistema de coordenadas<extra></extra>", marker: { color: "#FFF8E7", size: 9, line: { color: "#FFC66D", width: 4 } } });

  const layout: Partial<Layout> = { autosize: true, paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", margin: { l: 2, r: 2, t: 2, b: 2 }, font: { family: "var(--font-geist-sans)", color: "#B9B8C5", size: 11 }, legend: { orientation: "h", x: 0, y: 1, bgcolor: "rgba(0,0,0,0)", font: { size: 10 } }, scene: { bgcolor: "rgba(0,0,0,0)", domain: { x: [0, 1], y: [0, 1] }, aspectmode: "data", camera, dragmode: "orbit", xaxis: axis("X (pc)"), yaxis: axis("Y (pc)"), zaxis: axis("Z (pc)") }, uirevision: `astrogirls-map-${cameraRevision}`, showlegend: true };
  const config: Partial<Config> = { responsive: true, displaylogo: false, scrollZoom: false, modeBarButtonsToRemove: ["toImage", "sendChartToCloud", "resetCameraLastSave3d"] };

  function handleClick(event: PlotMouseEvent) {
    const source = event.points[0]?.customdata;
    const selected = stars.find((star) => star.source === source);
    if (selected) {
      setInteracted(true);
      onSelect(selected);
    }
  }

  function setView(nextCamera: typeof initialCamera) {
    cameraRef.current = nextCamera;
    setCamera(nextCamera);
    setCameraRevision((current) => current + 1);
    setInteracted(true);
  }

  function adjustZoom(factor: number) {
    const current = cameraRef.current;
    const distance = Math.hypot(current.eye.x, current.eye.y, current.eye.z);
    const nextDistance = Math.min(5, Math.max(0.38, distance * factor));
    const scale = nextDistance / distance;
    setView({
      ...current,
      eye: { x: current.eye.x * scale, y: current.eye.y * scale, z: current.eye.z * scale },
    });
  }

  function handleRelayout(event: Record<string, unknown>) {
    const updatedCamera = event["scene.camera"] as typeof initialCamera | undefined;
    if (updatedCamera?.eye) cameraRef.current = updatedCamera;
    setInteracted(true);
  }

  return <>
    <Plot data={traces} layout={layout} config={config} revision={cameraRevision} onClick={handleClick} onRelayout={handleRelayout} useResizeHandler className="plot" />
    <div className="map-camera-controls" aria-label="Controles de cámara del mapa 3D">
      <button className="camera-icon-button" type="button" onClick={() => adjustZoom(0.8)} aria-label="Acercar mapa 3D" title="Acercar"><ZoomIn size={16} /></button>
      <button className="camera-icon-button" type="button" onClick={() => adjustZoom(1.25)} aria-label="Alejar mapa 3D" title="Alejar"><ZoomOut size={16} /></button>
      <button type="button" onClick={() => setView(initialCamera)} aria-label="Restablecer la vista inicial del mapa 3D"><RotateCcw size={14} />Restablecer vista</button>
      <button type="button" onClick={() => setView(solarCamera)} aria-label="Centrar la cámara del mapa 3D en el Sol"><LocateFixed size={14} />Centrar en el Sol</button>
    </div>
    <p className={`map-interaction-hint${interacted ? " is-muted" : ""}`}>Arrastra para rotar · usa los controles para zoom</p>
  </>;
}

function hoverText(star: StarPoint) {
  return [
    `Source ID: ${star.source}`,
    `BP-RP: ${star.bpRp.toFixed(3)}`,
    `Gmag: ${star.gmag.toFixed(2)}`,
    `Distancia: ${star.distance.toFixed(2)} pc`,
    `RA: ${star.ra.toFixed(3)}°`,
    `DEC: ${star.dec.toFixed(3)}°`,
    `Categoría aproximada: ${star.category}`,
    ...(star.clusterMembership ? [`Agrupación: ${star.clusterMembership.name}`, `Prob.: ${star.clusterMembership.probability.toFixed(3)}`] : []),
  ].join("<br>");
}

function axis(title: string) {
  return { title: { text: title, font: { color: "#EEEAF2", size: 12 } }, backgroundcolor: "rgba(10,9,20,.28)", gridcolor: "rgba(190,160,238,.22)", zerolinecolor: "rgba(245,241,242,.58)", color: "#9995A7", showbackground: true, showspikes: false };
}
