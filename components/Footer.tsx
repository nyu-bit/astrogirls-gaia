export function Footer() {
  return (
    <footer id="proyecto" className="site-footer cosmic-footer">
      <div className="footer-bg" aria-hidden="true" />
      <div className="footer-overlay" aria-hidden="true" />

      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="brand-name">Astrogirls</span>
            <small>Astronomía y Ciencia de Datos</small>
          </div>

          <div className="footer-copy">
            <p className="footer-kicker">Proyecto final</p>
            <h3>Visualización del vecindario estelar</h3>
            <p>
              Proyecto final basado en datos de Gaia DR3 y visualización astronómica interactiva.
            </p>
            <small>Fuente de datos: Gaia DR3 — VizieR/CDS</small>
          </div>

          <nav className="footer-links" aria-label="Navegación del pie">
            <a href="#datos">Datos</a>
            <a href="#hallazgos">Hallazgos</a>
            <a href="#proyecto">Proyecto</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <small>© 2026 AstroGirls · Proyecto final de Astronomía y Ciencia de Datos</small>
        </div>
      </div>
    </footer>
  );
}