import { ArrowRight, Database, Filter, Orbit, ScanSearch, Waypoints } from "lucide-react";

const steps = [[Database, "Gaia DR3"], [ScanSearch, "Exploración"], [Filter, "Limpieza"], [Waypoints, "BP-RP"], [Orbit, "Distancia"], [Waypoints, "Coordenadas X/Y/Z"], [Orbit, "Visualización 3D"]] as const;

export function Methodology() {
  return <section id="proyecto" className="section-shell methodology"><div className="section-heading"><p className="eyebrow">Metodología</p><h2>Del catálogo al espacio cartesiano</h2><p>Un recorrido reproducible desde la consulta inicial hasta la lectura espacial de la muestra.</p></div><div className="method-flow">{steps.map(([Icon, label], index) => <div className="method-pair" key={label}><div className="method-step"><span>0{index + 1}</span><Icon size={19} /><strong>{label}</strong></div>{index < steps.length - 1 && <ArrowRight className="method-arrow" size={17} />}</div>)}</div></section>;
}
