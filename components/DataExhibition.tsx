"use client";

import dynamic from "next/dynamic";
import type { Config, Data, Layout } from "plotly.js";
import { useGaiaData } from "@/hooks/useGaiaData";
import { categoryColors, type StarCategory, type StarPoint } from "./star-data";
import { BarChart3, Network, Orbit, Database } from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const categories = Object.keys(categoryColors) as StarCategory[];

const exhibitionColors = {
  azul: "#6aa8ff",
  rosa: "#f38ac9",
  lila: "#bb86ff",
  dorado: "#f4c56a",
  texto: "#f5f1f7",
  tenue: "#b7adc9",
  borde: "rgba(212, 172, 255, 0.16)",
  grid: "rgba(194,165,243,.12)",
};

const config: Partial<Config> = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    "toImage",
    "sendChartToCloud",
    "lasso2d",
    "select2d",
    "autoScale2d",
    "resetScale2d",
  ],
};

const axis = {
  color: exhibitionColors.tenue,
  gridcolor: exhibitionColors.grid,
  zerolinecolor: "rgba(231,189,212,.18)",
  tickfont: { size: 10 },
};

const findings = [
  {
    title: "Concentración del índice BP-RP",
    copy: "La mayor parte de los valores BP-RP se concentra aproximadamente entre 1 y 3.",
    icon: BarChart3,
    tone: "pink",
  },
  {
    title: "Mezcla espacial de grupos",
    copy: "Las fuentes más azuladas, intermedias y más rojizas aparecen ampliamente mezcladas, sin una separación espacial evidente.",
    icon: Network,
    tone: "blue",
  },
  {
    title: "Concentración en el plano galáctico",
    copy: "El 49,0 % de la muestra está dentro de |b| ≤ 10° y el 64,2 % dentro de |b| ≤ 20°.",
    icon: Orbit,
    tone: "violet",
  },
  {
    title: "Coincidencias catalogadas",
    copy: "30 fuentes coinciden con miembros del catálogo consultado y se distribuyen entre 20 agrupaciones diferentes.",
    icon: Database,
    tone: "rose",
  },
];

const gaiaVariables = [
  ["RA_ICRS", "Ascensión recta. Una de las coordenadas que permite ubicar una fuente en el cielo."],
  ["DE_ICRS", "Declinación. Completa la posición de la fuente en el sistema celeste."],
  ["Plx", "Paralaje, medida en milisegundos de arco (mas). Se utiliza para estimar distancia."],
  ["e_Plx", "Incertidumbre asociada a la medición de paralaje."],
  ["Gmag", "Magnitud observada en la banda G de Gaia. Valores menores indican mayor brillo aparente."],
  ["BP-RP", "Índice de color calculado a partir de las bandas BP y RP. Valores menores corresponden a fuentes relativamente más azuladas y valores mayores a fuentes más rojizas."],
  ["RV", "Velocidad radial, expresada en km/s. Indica el movimiento de la fuente a lo largo de la línea de visión."],
  ["distancia_pc", "Distancia aproximada expresada en parsecs."],
] as const;

export function DataExhibition() {
  const gaia = useGaiaData();

  if (gaia.status === "loading") {
    return <section className="data-exhibition-state">Preparando visualizaciones científicas...</section>;
  }

  if (gaia.status === "error") {
    return <section className="data-exhibition-state">No fue posible cargar las visualizaciones.</section>;
  }

  return <Exhibition stars={gaia.data.stars} />;
}

function Exhibition({ stars }: { stars: StarPoint[] }) {
  return (
    <div className="visual-story final-starfield">
      <section id="datos" className="secondary-visuals">
        <header className="story-heading story-heading-compact">
          <div className="story-heading-left">
            <p className="eyebrow">OTRAS VISUALIZACIONES</p>
            <p className="story-kicker">Diferentes perspectivas de nuestro vecindario estelar.</p>
          </div>
        </header>

        <div className="secondary-grid">
          <article className="chart-panel">
            <div className="chart-panel-heading">
              <div className="chart-panel-title">
                <span className="chart-icon" aria-hidden="true">⌘</span>
                <h3>Distribución del índice de color BP-RP</h3>
              </div>
            </div>
            <Histogram stars={stars} />
          </article>

          <article className="chart-panel">
            <div className="chart-panel-heading">
              <div className="chart-panel-title">
                <span className="chart-icon" aria-hidden="true">✦</span>
                <h3>Mapa del cielo: coordenadas galácticas</h3>
              </div>
            </div>
            <GalacticMap stars={stars} />
          </article>
        </div>

        <section className="gaia-variable-guide" aria-labelledby="gaia-variable-guide-title">
          <header>
            <p className="eyebrow">GUÍA DEL DATASET</p>
            <h2 id="gaia-variable-guide-title">Cómo leer las variables de Gaia</h2>
          </header>

          <dl className="gaia-variable-grid">
            {gaiaVariables.map(([name, description]) => (
              <div className="gaia-variable-card" key={name}>
                <dt>{name}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>

          <aside className="stellar-color-note" aria-labelledby="stellar-color-note-title">
            <h3 id="stellar-color-note-title">Color y tipo estelar</h3>
            <p>En astronomía, las estrellas suelen clasificarse en tipos espectrales O, B, A, F, G, K y M, relacionados con su temperatura y color. En este proyecto no asignamos tipos espectrales exactos a partir de BP-RP. Nuestra clasificación “más azulada / intermedia / más rojiza” es relativa a la distribución de nuestra propia muestra.</p>
          </aside>

          <section className="astronomy-context" aria-labelledby="astronomy-context-title">
            <h3 id="astronomy-context-title">Contexto astronómico</h3>
            <div className="astronomy-context-grid">
              <article>
                <h4>Gaia</h4>
                <p>Misión de la ESA que mide posiciones, movimientos, distancias y propiedades fotométricas de estrellas.</p>
              </article>
              <article>
                <h4>Parsec</h4>
                <p>Unidad de distancia astronómica.<br />1 pc ≈ 3,26 años luz.</p>
              </article>
              <article>
                <h4>BP-RP</h4>
                <p>Índice de color de Gaia.<br />Valores menores → relativamente más azuladas.<br />Valores mayores → relativamente más rojizas.</p>
              </article>
            </div>
          </section>
        </section>
      </section>

      <section id="hallazgos" className="key-findings">
        <header className="story-heading">
          <div>
            <p className="eyebrow">HALLAZGOS CLAVE</p>
            <h2>Lo que nos cuenta la muestra</h2>
          </div>
          <p>Una lectura breve de los patrones visibles en los datos procesados.</p>
        </header>

        <div className="findings-grid">
          {findings.map((finding, index) => {
            const Icon = finding.icon;

            return (
              <article
                key={finding.title}
                className={`finding-card finding-${finding.tone}`}
              >
                <div className="finding-top">
                  <span className="finding-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon
                    className="finding-small-icon"
                    aria-hidden="true"
                    strokeWidth={1.7}
                  />
                </div>

                <Icon
                  className="finding-main-icon"
                  aria-hidden="true"
                  strokeWidth={1.45}
                />

                <h3>{finding.title}</h3>
                <p>{finding.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Histogram({ stars }: { stars: StarPoint[] }) {
  const allValues = stars.map((star) => star.bpRp);

  const data: Data[] = [
    {
      type: "histogram",
      x: allValues,
      autobinx: false,
      xbins: { start: -0.5, end: 4, size: 0.12 },
      marker: {
        color: allValues,
        colorscale: [
          [0.0, "#8FA2FF"],
          [0.45, "#D8A6EA"],
          [0.70, "#E9A6D2"],
          [1.0, "#FF6F9F"],
        ],
        line: { width: 0 },
      },
      hovertemplate: "BP-RP: %{x:.2f}<br>Fuentes: %{y}<extra></extra>",
      opacity: 0.96,
      nbinsx: 36,
      showscale: false,
    } as Data,
  ];

  const layout: Partial<Layout> = baseLayout({
    barmode: "overlay",
    showlegend: false,
    xaxis: {
      ...axis,
      title: { text: "Índice de color BP-RP" },
      range: [-0.5, 4],
    },
    yaxis: {
      ...axis,
      title: { text: "Número de fuentes" },
    },
  });

  return <Plot data={data} layout={layout} config={config} useResizeHandler className="story-plot" />;
}

function GalacticMap({ stars }: { stars: StarPoint[] }) {
  const data: Data[] = categories.map((category) => {
    const group = stars.filter((star) => star.category === category);

    return {
      type: "scattergl",
      mode: "markers",
      name: category,
      x: group.map((star) => star.lGal),
      y: group.map((star) => star.bGal),
      text: group.map((star) => `Gaia DR3 ${star.source}<br>BP-RP: ${star.bpRp.toFixed(3)}`),
      hovertemplate: "%{text}<br>l: %{x:.2f}°<br>b: %{y:.2f}°<extra></extra>",
      marker: {
        color: categoryColors[category],
        size: 2.1,
        opacity: 0.42,
      },
    } as Data;
  });

  const layout: Partial<Layout> = baseLayout({
    xaxis: {
      ...axis,
      title: { text: "Longitud galáctica l (°)" },
      range: [0, 360],
      tickmode: "array",
      tickvals: [0, 60, 120, 180, 240, 300, 360],
      ticktext: ["180°", "120°", "60°", "0°", "300°", "240°", "180°"],
    },
    yaxis: {
      ...axis,
      title: { text: "Latitud galáctica b (°)" },
      range: [-90, 90],
      tickmode: "array",
      tickvals: [-60, -30, 0, 30, 60],
      ticktext: ["−60°", "−30°", "0°", "+30°", "+60°"],
    },
    legend: {
      orientation: "v",
      x: 0.985,
      xanchor: "right",
      y: 0.98,
      yanchor: "top",
      font: { size: 11, color: "#f3dff1" },
      bgcolor: "rgba(10, 13, 28, 0.82)",
      bordercolor: "rgba(233, 170, 220, 0.28)",
      borderwidth: 1,
    },
    shapes: [
      {
        type: "line",
        x0: 0,
        x1: 360,
        y0: 0,
        y1: 0,
        line: { color: "rgba(255, 171, 214, 0.55)", width: 1.2 },
      },
      {
        type: "circle",
        xref: "paper",
        yref: "paper",
        x0: 0.08,
        x1: 0.92,
        y0: 0.14,
        y1: 0.86,
        line: { color: "rgba(236, 157, 220, 0.55)", width: 1.5 },
      },
    ],
  });

  return <Plot data={data} layout={layout} config={config} useResizeHandler className="story-plot" />;
}

function baseLayout(overrides: Partial<Layout>): Partial<Layout> {
  return {
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 58, r: 20, t: 34, b: 54 },
    font: {
      family: "Plus Jakarta Sans, Segoe UI, sans-serif",
      color: exhibitionColors.tenue,
      size: 10,
    },
    legend: {
      orientation: "h",
      x: 1,
      xanchor: "right",
      y: 1.12,
      font: { size: 10, color: "#ead8f7" },
      bgcolor: "rgba(0,0,0,0)",
    },
    hoverlabel: {
      bgcolor: "#10111d",
      bordercolor: "#e7bdd4",
      font: { color: "#f5f1f2" },
    },
    ...overrides,
  };
}

