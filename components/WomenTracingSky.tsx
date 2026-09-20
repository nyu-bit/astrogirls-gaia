import {
  ArrowDown,
  Binary,
  BookOpen,
  Database,
  Orbit,
  Sparkle,
  Telescope,
} from "lucide-react";

const chapters = [
  {
    number: "01",
    label: "Pregunta",
    text: "¿Cómo transformar un catálogo astronómico en una experiencia visual que permita comprender mejor su distribución espacial?",
  },
  {
    number: "02",
    label: "Datos",
    text: "Partimos desde Gaia DR3, exploramos la muestra, limpiamos los datos necesarios y trabajamos con BP-RP, paralaje y coordenadas celestes.",
  },
  {
    number: "03",
    label: "Construcción",
    text: "Calculamos X, Y y Z, desarrollamos una visualización tridimensional interactiva y llevamos el análisis desde un notebook a una experiencia web.",
  },
  {
    number: "04",
    label: "Resultado",
    text: "Un observatorio digital construido a partir de datos reales.",
  },
];

const process = [
  { label: "Gaia DR3", icon: Database },
  { label: "Python + Pandas", icon: Binary },
  { label: "Limpieza y exploración", icon: BookOpen },
  { label: "Transformación X / Y / Z", icon: Orbit },
  { label: "Visualización 3D", icon: Telescope },
  { label: "Experiencia web interactiva", icon: Sparkle },
];

export function WomenTracingSky() {
  return (
    <section className="section-shell women-sky final-starfield" aria-labelledby="women-sky-title">
      <div className="women-sky-intro">
        <p className="eyebrow">
          <Sparkle size={13} />
          Astronomía · datos · tecnología
        </p>
        <h2 id="women-sky-title">Mujeres trazando el cielo</h2>
        <p className="women-sky-subtitle">
          No solo analizamos datos astronómicos.
          <span>Construimos una forma de explorarlos.</span>
        </p>
      </div>

      <div className="women-sky-chapters">
        {chapters.map((chapter) => (
          <article key={chapter.number}>
            <span>{chapter.number}</span>
            <div>
              <h3>{chapter.label}</h3>
              <p>{chapter.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="notebook-flow">
        <div className="flow-heading">
          <p className="eyebrow">Proceso de construcción</p>
          <h3>Del notebook al observatorio digital</h3>
        </div>
        <ol>
          {process.map(({ label, icon: Icon }, index) => (
            <li key={label}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon size={18} aria-hidden="true" />
                <strong>{label}</strong>
              </div>
              {index < process.length - 1 && <ArrowDown size={15} aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>

      <blockquote>
        <Sparkle size={16} aria-hidden="true" />
        <p>
          No solo analizamos datos astronómicos.
          <strong>Construimos una forma de explorarlos.</strong>
        </p>
      </blockquote>

      <div data-future-section="equipo" hidden />
    </section>
  );
}
