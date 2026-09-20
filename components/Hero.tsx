import { ArrowDownRight, Box } from "lucide-react";

export function Hero() {
  return <section id="inicio" className="hero">
    <div className="hero-copy">
      <div className="hero-wordmark" aria-label="AstroGirls">Astrogirls</div>
      <p className="hero-brand-note">Astronomía y ciencia de datos</p>
      <h1>Nuestro vecindario estelar en 3D</h1>
      <p className="hero-description">Exploramos y visualizamos las estrellas más cercanas al Sol a partir de los datos de Gaia DR3.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#datos">Explorar datos <ArrowDownRight size={17} /></a>
        <a className="button button-secondary" href="#visualizaciones"><Box size={17} /> Ver mapa 3D</a>
      </div>
    </div>
  </section>;
}
