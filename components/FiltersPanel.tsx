import { RotateCcw } from "lucide-react";
import { categoryColors, type GaiaStats, type StarCategory } from "./star-data";

export type NumericRange = [number, number];
type Props = {
  active: StarCategory[];
  onToggle: (category: StarCategory) => void;
  onReset: () => void;
  bpRpRange: NumericRange;
  distanceRange: NumericRange;
  fullBpRp: NumericRange;
  fullDistance: NumericRange;
  onBpRpChange: (range: NumericRange) => void;
  onDistanceChange: (range: NumericRange) => void;
  stats: GaiaStats;
  visibleCount: number;
  showClusterMatches: boolean;
  onlyClusterMatches: boolean;
  onShowClusterMatches: (value: boolean) => void;
  onOnlyClusterMatches: (value: boolean) => void;
};
const categories: StarCategory[] = ["Más azulada", "Intermedia", "Más rojiza"];

export function FiltersPanel(props: Props) {
  const { active, onToggle, onReset, bpRpRange, distanceRange, fullBpRp, fullDistance, onBpRpChange, onDistanceChange, stats, visibleCount, showClusterMatches, onlyClusterMatches, onShowClusterMatches, onOnlyClusterMatches } = props;
  return <aside className="explorer-panel filters-panel" aria-label="Filtros de visualización">
    <div className="panel-title"><span className="panel-number">01</span><h3>Filtros de visualización</h3></div>
    <fieldset><legend>Índice de color BP-RP</legend><div className="category-controls">{categories.map((name) => <label key={name}><input type="checkbox" checked={active.includes(name)} onChange={() => onToggle(name)} /><span className="custom-check" /><i style={{ background: categoryColors[name] }} /><span>{name}</span><b>{formatInteger(stats.categoryCounts[name])}</b></label>)}</div></fieldset>
    <RangeControl label="BP-RP" range={bpRpRange} fullRange={fullBpRp} step={0.001} decimals={3} onChange={onBpRpChange} />
    <RangeControl label="Distancia" unit="pc" range={distanceRange} fullRange={fullDistance} step={0.001} decimals={2} onChange={onDistanceChange} />
    <div className="cluster-controls">
      <label><input type="checkbox" checked={showClusterMatches} onChange={(event) => onShowClusterMatches(event.target.checked)} /><span /><b>Mostrar agrupaciones catalogadas</b></label>
      <label><input type="checkbox" checked={onlyClusterMatches} onChange={(event) => onOnlyClusterMatches(event.target.checked)} /><span /><b>Solo coincidencias catalogadas</b></label>
    </div>
    <button className="button button-secondary panel-button" type="button" onClick={onReset}><RotateCcw size={16} /> Restablecer</button>
    <dl className="sample-facts"><div><dt>Fuentes analizadas</dt><dd>{formatInteger(stats.analyzedCount)}</dd></div><div className="visible-fact"><dt>Fuentes visibles</dt><dd>{formatInteger(visibleCount)}</dd></div><div><dt>Coincidencias con miembros catalogados</dt><dd>{stats.clusterMatchCount}</dd></div><div><dt>Agrupaciones diferentes</dt><dd>{stats.uniqueClusterCount}</dd></div><div><dt>Distancia media</dt><dd>{stats.distanceMean.toFixed(2)} pc</dd></div><div><dt>Fuente</dt><dd>Gaia DR3 — VizieR/CDS</dd></div></dl>
  </aside>;
}

function RangeControl({ label, unit, range, fullRange, step, decimals, onChange }: { label: string; unit?: string; range: NumericRange; fullRange: NumericRange; step: number; decimals: number; onChange: (range: NumericRange) => void }) {
  const [minimum, maximum] = range;
  return <div className="range-control dual-range"><div><span>{label}</span><output>{minimum.toFixed(decimals)} — {maximum.toFixed(decimals)}{unit ? ` ${unit}` : ""}</output></div><label><span>Mín.</span><input aria-label={`${label} mínimo`} type="range" min={fullRange[0]} max={fullRange[1]} step={step} value={minimum} onChange={(event) => onChange([Math.min(Number(event.target.value), maximum), maximum])} /></label><label><span>Máx.</span><input aria-label={`${label} máximo`} type="range" min={fullRange[0]} max={fullRange[1]} step={step} value={maximum} onChange={(event) => onChange([minimum, Math.max(Number(event.target.value), minimum)])} /></label></div>;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("es-CL").format(value);
}
