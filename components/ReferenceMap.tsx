"use client";

import { useEffect, useRef } from "react";
import { categoryColors, type StarPoint } from "./star-data";

export function ReferenceMap({ stars }: { stars: StarPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "rgba(231,189,212,.16)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(width / 2, 8); context.lineTo(width / 2, height - 8);
    context.moveTo(8, height / 2); context.lineTo(width - 8, height / 2);
    context.stroke();
    const maxAbsolute = Math.max(1, ...stars.flatMap((star) => [Math.abs(star.x), Math.abs(star.y)]));
    for (const star of stars) {
      const x = width / 2 + (star.x / maxAbsolute) * width * 0.44;
      const y = height / 2 - (star.y / maxAbsolute) * height * 0.44;
      context.fillStyle = categoryColors[star.category];
      context.globalAlpha = 0.58;
      context.fillRect(x, y, 1.4, 1.4);
    }
    context.globalAlpha = 1;
    context.fillStyle = "#f5f1f2";
    context.beginPath();
    context.arc(width / 2, height / 2, 2.5, 0, Math.PI * 2);
    context.fill();
  }, [stars]);
  return <section className="side-block reference-block"><div className="side-block-title"><span className="panel-number">03</span><h3>Vista de referencia</h3></div><div className="mini-map"><canvas ref={canvasRef} width={480} height={220} aria-label="Proyección real de las fuentes visibles sobre el plano XY" /><b>Sol</b></div><p className="mini-caption">Fuentes visibles · plano XY</p></section>;
}
