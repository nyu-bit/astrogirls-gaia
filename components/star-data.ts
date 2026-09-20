export type StarCategory = "Más azulada" | "Intermedia" | "Más rojiza";

export type ClusterMembership = {
  name: string;
  probability: number;
  contextualImage?: {
    src: string;
    label: string;
  };
};

export type StarPoint = { source: string; x: number; y: number; z: number; bpRp: number; gmag: number; absoluteMagnitude: number; distance: number; ra: number; dec: number; lGal: number; bGal: number; category: StarCategory; clusterMembership?: ClusterMembership };

export const categoryColors: Record<StarCategory, string> = { "Más azulada": "#419DFF", Intermedia: "#FFC66D", "Más rojiza": "#FF536D" };

export type GaiaStats = {
  originalCount: number;
  analyzedCount: number;
  q1: number;
  q3: number;
  bpRpMin: number;
  bpRpMax: number;
  distanceMin: number;
  distanceMean: number;
  distanceMax: number;
  categoryCounts: Record<StarCategory, number>;
  clusterMatchCount: number;
  uniqueClusterCount: number;
};
