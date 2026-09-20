import { Sparkle } from "lucide-react";

const links = [["Datos", "#datos"], ["Visualizaciones", "#visualizaciones"], ["Hallazgos", "#hallazgos"], ["Proyecto", "#proyecto"]];

export function Header() {
  return <header className="site-header">
    <nav aria-label="Navegación principal">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <div className="catalog-mark"><Sparkle size={13} aria-hidden="true" /><span>Gaia DR3</span></div>
  </header>;
}
