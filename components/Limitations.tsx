const limitations = ["La muestra no cubre uniformemente desde 0 a 200 pc.", "Está concentrada aproximadamente entre 199,82 y 200 pc.", "La clasificación basada en BP-RP es aproximada por color.", "No representa una clasificación espectral exacta."];

export function Limitations() {
  return <section className="section-shell limitations final-starfield"><div className="section-heading compact-heading"><p className="eyebrow">Alcance científico</p><h2>Limitaciones</h2></div><div className="limitation-grid">{limitations.map((text, index) => <div key={text}><span>0{index + 1}</span><p>{text}</p></div>)}</div></section>;
}
