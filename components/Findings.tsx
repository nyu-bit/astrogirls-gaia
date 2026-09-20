import { AlertTriangle } from "lucide-react";

const findings = ["Los valores BP-RP se concentran principalmente entre aproximadamente 1 y 3.", "Los grupos más azulados, intermedios y más rojizos aparecen ampliamente mezclados espacialmente.", "No se observa una separación espacial evidente entre los grupos en esta muestra.", "Las distancias se encuentran fuertemente concentradas alrededor de 200 pc.", "Esta concentración explica la forma de superficie esférica observada en el gráfico 3D."];

export function Findings() {
  return <section id="hallazgos" className="section-shell findings final-starfield"><div className="section-heading compact-heading"><p className="eyebrow">Lectura de resultados</p><h2>Hallazgos de la muestra</h2></div><ol className="finding-list">{findings.map((finding, index) => <li key={finding}><span>{String(index + 1).padStart(2, "0")}</span><p>{finding}</p></li>)}</ol><aside className="scientific-note"><AlertTriangle size={21} /><div><strong>Nota de interpretación</strong><p>La forma esférica refleja las características de la muestra y no implica que las estrellas cercanas al Sol se distribuyan físicamente formando una esfera.</p></div></aside></section>;
}
