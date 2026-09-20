"use client";

import { Check, Copy, Crosshair, Layers3, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { clusterContext } from "@/lib/cluster-context";
import { SkySurveyView } from "./SkySurveyView";
import type { StarPoint } from "./star-data";

type Props = {
  star: StarPoint | null;
  q1: number;
  q3: number;
  clusterSampleCount?: number;
};

const readings = {
  "Más azulada":
    "Esta fuente pertenece al grupo más azulado de nuestra muestra. Su índice BP-RP se encuentra por debajo del primer cuartil utilizado en nuestra clasificación aproximada.",
  Intermedia:
    "Esta fuente pertenece al grupo intermedio de nuestra muestra. Su índice BP-RP se encuentra entre el primer y tercer cuartil.",
  "Más rojiza":
    "Esta fuente pertenece al grupo más rojizo de nuestra muestra. Su índice BP-RP se encuentra por encima del tercer cuartil utilizado en nuestra clasificación aproximada.",
};

export function StarDetailsPanel({ star, q1, q3, clusterSampleCount }: Props) {
  const [copied, setCopied] = useState(false);
  const [clusterOpen, setClusterOpen] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const context = star?.clusterMembership ? clusterContext[star.clusterMembership.name] : undefined;

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  // Reset internal scroll when star changes
  useEffect(() => {
    if (!panelRef.current) return;
    // scroll to top when star changes
    panelRef.current.scrollTo({ top: 0 });
  }, [star?.source]);

  async function copyData() {
    if (!star) return;
    const text = [
      `Gaia Source: ${star.source}`,
      `BP-RP: ${star.bpRp.toFixed(3)}`,
      `Gmag: ${star.gmag.toFixed(2)}`,
      `Distancia: ${star.distance.toFixed(2)} pc`,
      `RA: ${star.ra.toFixed(3)}°`,
      `DEC: ${star.dec.toFixed(3)}°`,
      `X: ${star.x.toFixed(2)} pc`,
      `Y: ${star.y.toFixed(2)} pc`,
      `Z: ${star.z.toFixed(2)} pc`,
      `Clasificación aproximada: ${star.category}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("No fue posible copiar los datos de la fuente.", error);
    }
  }

  return (
    <section ref={(el) => { panelRef.current = el; }} className="side-block source-details">
      <div className="source-details-sticky">
        <div className="side-block-title">
          <Crosshair size={16} />
          <h3>Fuente seleccionada</h3>
        </div>
        {star && <div className="source-identity">
          <span>Fuente Gaia</span>
          <strong>{star.source}</strong>
        </div>}
      </div>
      {!star ? (
        <div className="empty-selection">
          <span className="target-mark" aria-hidden="true" />
          <p>Selecciona un punto del mapa para explorar sus datos.</p>
        </div>
      ) : (
        <>
          <SkySurveyView ra={star.ra} dec={star.dec} />

          <dl className="detail-list">
            <div><dt>Source ID</dt><dd>{star.source}</dd></div>
            <div><dt>Clasificación aproximada</dt><dd>{star.category}</dd></div>
            <div><dt>BP-RP</dt><dd>{star.bpRp.toFixed(3)}</dd></div>
            <div><dt>Gmag</dt><dd>{star.gmag.toFixed(2)}</dd></div>
            <div><dt>Distancia</dt><dd>{star.distance.toFixed(2)} pc</dd></div>
            <div><dt>X</dt><dd>{star.x.toFixed(2)} pc</dd></div>
            <div><dt>Y</dt><dd>{star.y.toFixed(2)} pc</dd></div>
            <div><dt>Z</dt><dd>{star.z.toFixed(2)} pc</dd></div>
            <div><dt>RA_ICRS</dt><dd>{star.ra.toFixed(3)}°</dd></div>
            <div><dt>DE_ICRS</dt><dd>{star.dec.toFixed(3)}°</dd></div>
          </dl>

          <div className="source-reading">
            <p className="source-reading-label">Lectura de la fuente</p>
            <p>{readings[star.category]} Se encuentra a {star.distance.toFixed(2)} pc del origen utilizado en esta visualización.</p>
            <dl>
              <div><dt>Rango de clasificación de esta muestra</dt></div>
              <div><dt>Q1</dt><dd>{q1.toFixed(3)}</dd></div>
              <div><dt>Q3</dt><dd>{q3.toFixed(3)}</dd></div>
            </dl>
          </div>

          <div className={`cluster-membership${star.clusterMembership ? " has-match" : ""}`}>
            <div className="cluster-membership-title"><Layers3 size={14} /><span>Agrupación catalogada</span></div>
            {star.clusterMembership ? (
              <>
                <strong>{star.clusterMembership.name}</strong>
                <dl><div><dt>Probabilidad de membresía</dt><dd>{star.clusterMembership.probability.toFixed(3)}</dd></div></dl>
                <p>Esta fuente aparece como miembro de {star.clusterMembership.name} en el catálogo de agrupaciones consultado.</p>
                <button type="button" onClick={() => setClusterOpen(true)}>Explorar agrupación</button>
              </>
            ) : (
              <p>Sin coincidencia en el catálogo de agrupaciones consultado.</p>
            )}
          </div>

          <button className="copy-source-button" type="button" onClick={copyData}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Datos copiados" : "Copiar datos"}
          </button>

          {clusterOpen && star.clusterMembership && typeof document !== "undefined" && createPortal(
            <div className="cluster-modal-backdrop" role="presentation" onMouseDown={() => setClusterOpen(false)}>
              <section className="cluster-modal" role="dialog" aria-modal="true" aria-labelledby="cluster-modal-title" onMouseDown={(event) => event.stopPropagation()}>
                <button className="cluster-modal-close" type="button" aria-label="Cerrar información de agrupación" onClick={() => setClusterOpen(false)}><X size={16} /></button>
                <p className="eyebrow">Contexto catalogado</p>
                <h3 id="cluster-modal-title">{context?.displayName ?? star.clusterMembership.name}</h3>
                {context?.aliases && <p className="cluster-aliases">{context.aliases.join(" · ")}</p>}
                {context ? (
                  <>
                    <dl className="cluster-modal-data contextual-data">
                      <div><dt>Tipo</dt><dd>{context.type}</dd></div>
                      <div className="context-copy"><dt>Contexto</dt><dd>{context.context}</dd></div>
                      {context.distance && <div><dt>Distancia aproximada</dt><dd>{context.distance}</dd></div>}
                      {context.age && <div><dt>Edad aproximada</dt><dd>{context.age}</dd></div>}
                      {context.parallax && <div><dt>Paralaje aproximada</dt><dd>{context.parallax}</dd></div>}
                      <div><dt>Probabilidad de membresía de esta fuente</dt><dd>{star.clusterMembership.probability.toFixed(3)}</dd></div>
                      <div><dt>Coincidencias en nuestra muestra</dt><dd>{clusterSampleCount ?? 0}</dd></div>
                    </dl>
                    <p className="context-caution">Los parámetros mostrados son valores aproximados reportados en literatura y pueden variar según el estudio.</p>
                    <div className="cluster-sources"><span>Fuentes</span>{context.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}{context.visualUrl && <a className="visual-source-link" href={context.visualUrl} target="_blank" rel="noreferrer">{context.visualLabel ?? "Ver campo astronómico"} ↗</a>}</div>
                  </>
                ) : (
                  <>
                    <dl className="cluster-modal-data">
                      <div><dt>Nombre</dt><dd>{star.clusterMembership.name}</dd></div>
                      <div><dt>Probabilidad de membresía de esta fuente</dt><dd>{star.clusterMembership.probability.toFixed(3)}</dd></div>
                      <div><dt>Fuentes de nuestra muestra asociadas</dt><dd>{clusterSampleCount ?? 0}</dd></div>
                    </dl>
                    <p>Esta agrupación aparece en el catálogo de membresías utilizado para el cruce de nuestra muestra.</p>
                  </>
                )}
                <div className="future-cluster-context" data-future-context-image={star.clusterMembership.name} hidden />
              </section>
            </div>
          , document.body)}
        </>
      )}
    </section>
  );
}
