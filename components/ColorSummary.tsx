import { categoryColors, type StarCategory } from "./star-data";

const rows: { name: StarCategory; count: string }[] = [{ name: "Más azulada", count: "2.161" }, { name: "Intermedia", count: "4.321" }, { name: "Más rojiza", count: "2.161" }];

export function ColorSummary({ variant = "panel", counts }: { variant?: "panel" | "wide"; counts?: Record<StarCategory, number> }) {
  const displayRows = rows.map((row) => ({ ...row, count: counts ? new Intl.NumberFormat("es-CL").format(counts[row.name]) : row.count }));
  if (variant === "wide") return <div className="color-summary-wide">{displayRows.map(({ name, count }, index) => <div key={name}><span className="metric-index">0{index + 1}</span><i style={{ background: categoryColors[name] }} /><strong>{count}</strong><span>{name}s</span></div>)}</div>;
  return <section className="side-block"><div className="side-block-title"><span className="panel-number">02</span><h3>Resumen por color</h3></div><div className="color-rows">{displayRows.map(({ name, count }) => <div key={name}><i style={{ background: categoryColors[name] }} /><span>{name}s</span><b>{count}</b></div>)}</div></section>;
}
