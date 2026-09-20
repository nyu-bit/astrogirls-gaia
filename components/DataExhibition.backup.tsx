"use client";

import dynamic from "next/dynamic";
import type { Config, Data, Layout } from "plotly.js";
import { useGaiaData } from "@/hooks/useGaiaData";
import { categoryColors, type StarCategory, type StarPoint } from "./star-data";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
const categories = Object.keys(categoryColors) as StarCategory[];

const exhibitionColors: Record<StarCategory, string> = {
  "Más azulada": "#9B8CFF",
  "Intermedia": "#E8A4C8",
  "Más rojiza": "#F06292",
};
const config: Partial<Config> = { responsive: true, displaylogo: false, modeBarButtonsToRemove: ["toImage", "sendChartToCloud", "lasso2d", "select2d"] };
const axis = { color: "#b8afbd", gridcolor: "rgba(232,164,200,.12)", zerolinecolor: "rgba(240,98,146,.28)", tickfont: { size: 9 } };

const findings = [
  ["ConcentraciÃ³n del Ã­ndice BP-RP", "La mayorÃ­a de las fuentes se encuentran entre 1 y 3."],
  ["Mezcla espacial de grupos", "Los grupos mÃ¡s azulados, intermedios y mÃ¡s rojizos aparecen ampliamente mezclados."],
  ["ConcentraciÃ³n en el plano galÃ¡ctico", "La muestra se distribuye preferentemente cerca del plano de la VÃ­a LÃ¡ctea."],
  ["Baja coincidencia catalogada", "Solo 30 fuentes presentan coincidencias en el catÃ¡logo consultado."],
];

export function DataExhibition() {
  const gaia = useGaiaData();
  if (gaia.status === "loading") return <section className="data-exhibition-state">Preparando visualizaciones cientÃ­ficas...</section>;
  if (gaia.status === "error") return <section className="data-exhibition-state">No fue posible cargar las visualizaciones.</section>;
  return <Exhibition stars={gaia.data.stars} />;
}

function Exhibition({ stars }: { stars: StarPoint[] }) {
  return <div className="visual-story final-starfield">
    <section id="datos" className="secondary-visuals">
      <header className="story-heading"><div><p className="eyebrow">Otras visualizaciones</p><h2>Dos lecturas de la muestra</h2></div><p>Color relativo y posiciÃ³n galÃ¡ctica de las 8.643 fuentes analizadas.</p></header>
      <div className="secondary-grid">
        <article className="chart-panel"><h3>DistribuciÃ³n del Ã­ndice de color BP-RP</h3><Histogram stars={stars} /></article>
        <article className="chart-panel"><h3>Mapa del cielo: coordenadas galÃ¡cticas</h3><GalacticMap stars={stars} /></article>
      </div>
    </section>
    <section id="hallazgos" className="key-findings">
      <header className="story-heading"><div><p className="eyebrow">Hallazgos clave</p><h2>Lo que nos cuenta la muestra</h2></div><p>Una lectura breve de los patrones visibles en los datos procesados.</p></header>
      <div className="findings-grid">{findings.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
  </div>;
}

function Histogram({ stars }: { stars: StarPoint[] }) {
  const data: Data[] = categories.map((category) => ({ type: "histogram", name: category, x: stars.filter((star) => star.category === category).map((star) => star.bpRp), autobinx: false, xbins: { start: -0.5, end: 4, size: 0.12 }, marker: { color: categoryColors[category], line: { width: 0 } }, opacity: 0.72, hovertemplate: `${category}<br>BP-RP: %{x}<br>Fuentes: %{y}<extra></extra>` }));
  const layout: Partial<Layout> = baseLayout({ barmode: "overlay", xaxis: { ...axis, title: { text: "Ãndice de color BP-RP" } }, yaxis: { ...axis, title: { text: "NÃºmero de fuentes" } } });
  return <Plot data={data} layout={layout} config={config} useResizeHandler className="story-plot" />;
}

function GalacticMap({ stars }: { stars: StarPoint[] }) {
  const data: Data[] = categories.map((category) => {
    const group = stars.filter((star) => star.category === category);
    return { type: "scattergl", mode: "markers", name: category, x: group.map((star) => star.lGal), y: group.map((star) => star.bGal), text: group.map((star) => `Source ID: ${star.source}`), hovertemplate: `%{text}<br>l: %{x:.2f}Â°<br>b: %{y:.2f}Â°<extra>${category}</extra>`, marker: { color: exhibitionColors[category], size: 3, opacity: 0.62 } };
  });
  const layout: Partial<Layout> = baseLayout({ xaxis: { ...axis, title: { text: "Longitud galÃ¡ctica l (Â°)" }, range: [0, 360] }, yaxis: { ...axis, title: { text: "Latitud galÃ¡ctica b (Â°)" }, range: [-90, 90] }, shapes: [{ type: "rect", x0: 0, x1: 360, y0: -10, y1: 10, fillcolor: "rgba(232,164,200,.08)", line: { width: 0 }, layer: "below" }, { type: "line", x0: 0, x1: 360, y0: 0, y1: 0, line: { color: "rgba(245,241,242,.48)", width: 1 } }] });
  return <Plot data={data} layout={layout} config={config} useResizeHandler className="story-plot" />;
}

function baseLayout(overrides: Partial<Layout>): Partial<Layout> {
  return { autosize: true, paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", margin: { l: 58, r: 20, t: 40, b: 54 }, font: { family: "Plus Jakarta Sans, Segoe UI, sans-serif", color: "#aaa7b3", size: 9 }, legend: { orientation: "h", x: 1, xanchor: "right", y: 1.14, font: { size: 8 }, bgcolor: "rgba(0,0,0,0)" }, hoverlabel: { bgcolor: "#10111d", bordercolor: "#e7bdd4", font: { color: "#f5f1f2" } }, ...overrides };
}

