import { Database, FileText, Network, Sparkles } from "lucide-react";

const metrics = [[Sparkles, "10.000", "Fuentes iniciales"], [FileText, "8.643", "Fuentes analizadas"], [Network, "13", "Variables"], [Database, "30", "Coincidencias catalogadas"]] as const;

export function Metrics() {
  return <section className="metrics" aria-label="Resumen de la muestra">{metrics.map(([Icon, value, label]) => <div className="metric" key={label}><span className="metric-icon"><Icon size={23} /></span><div><strong>{value}</strong><span>{label}</span></div></div>)}</section>;
}
