import type { ClusterMembership, GaiaStats, StarCategory, StarPoint } from "@/components/star-data";

const EXPECTED = {
  original: 10_000,
  analyzed: 8_643,
  categories: {
    "Más azulada": 2_161,
    Intermedia: 4_321,
    "Más rojiza": 2_161,
  } satisfies Record<StarCategory, number>,
};

type CsvRow = Record<string, string>;

export type GaiaDataset = {
  stars: StarPoint[];
  stats: GaiaStats;
};

export function parseGaiaCsv(csv: string, membershipsCsv: string): GaiaDataset {
  const rows = parseCsv(csv, ["Source", "RA_ICRS", "DE_ICRS", "Gmag", "BP-RP", "distancia_pc"]);
  const membershipMap = parseMemberships(membershipsCsv);
  const clean = rows.filter((row) => row["BP-RP"].trim() !== "");
  const bpRpValues = clean.map((row) => requiredNumber(row["BP-RP"], "BP-RP"));
  const sortedBpRp = [...bpRpValues].sort((a, b) => a - b);
  const q1 = percentile(sortedBpRp, 0.25);
  const q3 = percentile(sortedBpRp, 0.75);

  const stars = clean.map((row, index): StarPoint => {
    const source = row.Source.trim();
    const ra = requiredNumber(row.RA_ICRS, "RA_ICRS");
    const dec = requiredNumber(row.DE_ICRS, "DE_ICRS");
    const distance = requiredNumber(row.distancia_pc, "distancia_pc");
    const bpRp = bpRpValues[index];
    const gmag = requiredNumber(row.Gmag, "Gmag");
    const raRadians = degreesToRadians(ra);
    const decRadians = degreesToRadians(dec);
    const cosDec = Math.cos(decRadians);
    const { lGal, bGal } = equatorialToGalactic(raRadians, decRadians);
    return {
      source,
      x: distance * cosDec * Math.cos(raRadians),
      y: distance * cosDec * Math.sin(raRadians),
      z: distance * Math.sin(decRadians),
      bpRp,
      gmag,
      absoluteMagnitude: gmag - 5 * Math.log10(distance) + 5,
      distance,
      ra,
      dec,
      lGal,
      bGal,
      category: classify(bpRp, q1, q3),
      clusterMembership: membershipMap.get(source),
    };
  });

  const distances = stars.map((star) => star.distance);
  const categoryCounts = stars.reduce<Record<StarCategory, number>>(
    (counts, star) => ({ ...counts, [star.category]: counts[star.category] + 1 }),
    { "Más azulada": 0, Intermedia: 0, "Más rojiza": 0 },
  );
  const stats: GaiaStats = {
    originalCount: rows.length,
    analyzedCount: stars.length,
    q1,
    q3,
    bpRpMin: Math.min(...bpRpValues),
    bpRpMax: Math.max(...bpRpValues),
    distanceMin: Math.min(...distances),
    distanceMean: distances.reduce((sum, value) => sum + value, 0) / distances.length,
    distanceMax: Math.max(...distances),
    categoryCounts,
    clusterMatchCount: stars.filter((star) => star.clusterMembership).length,
    uniqueClusterCount: new Set(stars.flatMap((star) => star.clusterMembership ? [star.clusterMembership.name] : [])).size,
  };

  validateDataset(stars, stats);
  return { stars, stats };
}

function parseMemberships(csv: string): Map<string, ClusterMembership> {
  const rows = parseCsv(csv, ["GaiaDR3", "Name", "Prob"]);
  const requiredHeaders = ["GaiaDR3", "Name", "Prob"];
  for (const header of requiredHeaders) {
    if (rows.length > 0 && !(header in rows[0])) throw new Error(`Falta la columna requerida en membresías: ${header}`);
  }
  const memberships = new Map<string, ClusterMembership>();
  for (const row of rows) {
    const source = row.GaiaDR3.trim();
    if (!source) throw new Error("GaiaDR3 no puede estar vacío.");
    memberships.set(source, {
      name: row.Name.trim(),
      probability: requiredNumber(row.Prob, "Prob"),
    });
  }
  if (memberships.size !== rows.length) console.warn("Se encontraron GaiaDR3 duplicados en cluster_memberships.csv.");
  return memberships;
}

function parseCsv(csv: string, requiredHeaders: string[]): CsvRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() && !line.trimStart().startsWith("#"));
  if (lines.length === 0) throw new Error("El CSV no contiene encabezado.");
  const headers = parseCsvLine(lines[0]);
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) throw new Error(`Falta la columna requerida: ${header}`);
  }
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell);
  return cells;
}

function percentile(sorted: number[], percentileValue: number): number {
  if (sorted.length === 0) throw new Error("No hay valores BP-RP disponibles.");
  const position = (sorted.length - 1) * percentileValue;
  const lower = Math.floor(position);
  const fraction = position - lower;
  return sorted[lower] + (sorted[lower + 1] - sorted[lower]) * fraction;
}

function classify(bpRp: number, q1: number, q3: number): StarCategory {
  if (bpRp < q1) return "Más azulada";
  if (bpRp > q3) return "Más rojiza";
  return "Intermedia";
}

function requiredNumber(value: string, column: string): number {
  const number = Number(value);
  if (!value.trim() || !Number.isFinite(number)) throw new Error(`Valor inválido en ${column}: "${value}"`);
  return number;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

function equatorialToGalactic(ra: number, dec: number) {
  const northGalacticPoleRa = degreesToRadians(192.85948);
  const northGalacticPoleDec = degreesToRadians(27.12825);
  const galacticLongitudeNode = degreesToRadians(32.93192);
  const raOffset = ra - northGalacticPoleRa;
  const b = Math.asin(
    Math.sin(dec) * Math.sin(northGalacticPoleDec)
      + Math.cos(dec) * Math.cos(northGalacticPoleDec) * Math.cos(raOffset),
  );
  const l = galacticLongitudeNode + Math.atan2(
    Math.cos(dec) * Math.sin(raOffset),
    Math.sin(dec) * Math.cos(northGalacticPoleDec)
      - Math.cos(dec) * Math.sin(northGalacticPoleDec) * Math.cos(raOffset),
  );
  return { lGal: (radiansToDegrees(l) + 360) % 360, bGal: radiansToDegrees(b) };
}

function validateDataset(stars: StarPoint[], stats: GaiaStats) {
  const countsMatch = (Object.keys(EXPECTED.categories) as StarCategory[]).every(
    (category) => stats.categoryCounts[category] === EXPECTED.categories[category],
  );
  if (stats.originalCount !== EXPECTED.original || stats.analyzedCount !== EXPECTED.analyzed || !countsMatch) {
    console.warn("Validación Gaia inesperada", { expected: EXPECTED, actual: stats });
  }
  if (Object.values(stats.categoryCounts).reduce((sum, count) => sum + count, 0) !== stats.analyzedCount) {
    throw new Error("Las categorías no suman la cantidad de fuentes analizadas.");
  }
  const groupCounts = stars.reduce<Record<string, number>>((counts, star) => {
    const name = star.clusterMembership?.name;
    if (name) counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});
  if (
    stats.clusterMatchCount !== 30 ||
    stats.uniqueClusterCount !== 20 ||
    groupCounts.Alessi_84 !== 4 ||
    groupCounts.NGC_2451A !== 3 ||
    groupCounts.OCSN_49 !== 3
  ) {
    console.warn("Validación de agrupaciones inesperada", {
      matches: stats.clusterMatchCount,
      uniqueGroups: stats.uniqueClusterCount,
      principalCounts: {
        Alessi_84: groupCounts.Alessi_84,
        NGC_2451A: groupCounts.NGC_2451A,
        OCSN_49: groupCounts.OCSN_49,
      },
    });
  }
  for (const star of stars) {
    if (typeof star.source !== "string") throw new Error("Source debe conservarse como string.");
    if (![star.x, star.y, star.z, star.absoluteMagnitude, star.lGal, star.bGal].every(Number.isFinite)) throw new Error(`Coordenadas o magnitud inválidas para Source ${star.source}`);
  }
  const sampleStep = Math.max(1, Math.floor(stars.length / 25));
  for (let index = 0; index < stars.length; index += sampleStep) {
    const star = stars[index];
    const radius = Math.hypot(star.x, star.y, star.z);
    if (Math.abs(radius - star.distance) > 1e-8) throw new Error(`Validación XYZ fallida para Source ${star.source}`);
  }
}
