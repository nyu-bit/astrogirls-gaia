"use client";

import { useState } from "react";

const SURVEY_LABEL = "DSS2 color · CDS HiPS2FITS";

export function SkySurveyView({ ra, dec }: { ra: number; dec: number }) {
  const params = new URLSearchParams({
    ra: String(ra),
    dec: String(dec),
  });
  const imageUrl = `/api/dss2?${params.toString()}`;

  return (
    <figure className="sky-survey">
      <div className="sky-survey-heading">
        <span>Vista del cielo centrada en esta fuente</span>
        <small>{SURVEY_LABEL}</small>
      </div>

      <div className="sky-survey-frame">
        <SurveyImage key={imageUrl} imageUrl={imageUrl} ra={ra} dec={dec} />
      </div>

      <figcaption>
        Imagen del campo DSS2 alrededor de las coordenadas seleccionadas.
        No implica que la fuente Gaia individual esté resuelta visualmente.
      </figcaption>
    </figure>
  );
}

function SurveyImage({ imageUrl, ra, dec }: { imageUrl: string; ra: number; dec: number }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  if (failed) return <p>No fue posible cargar el campo DSS2.</p>;

  return <>
    {loading && <p className="sky-survey-loading">Consultando DSS2...</p>}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imageUrl}
      alt={`Campo DSS2 centrado en RA ${ra.toFixed(3)}°, DEC ${dec.toFixed(3)}°`}
      onLoad={() => setLoading(false)}
      onError={() => {
        setLoading(false);
        setFailed(true);
      }}
    />
    {!loading && <span className="survey-crosshair" aria-hidden="true" />}
  </>;
}
