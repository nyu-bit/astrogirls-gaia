"use client";

import { useEffect, useState } from "react";
import { parseGaiaCsv, type GaiaDataset } from "@/lib/gaia";

type GaiaState =
  | { status: "loading"; data: null }
  | { status: "ready"; data: GaiaDataset }
  | { status: "error"; data: null };

export function useGaiaData(): GaiaState {
  const [state, setState] = useState<GaiaState>({ status: "loading", data: null });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [gaiaResponse, membershipsResponse] = await Promise.all([
          fetch("/data/datasetgaia.csv", { signal: controller.signal }),
          fetch("/data/cluster_memberships.csv", { signal: controller.signal }),
        ]);
        if (!gaiaResponse.ok) throw new Error(`HTTP ${gaiaResponse.status} al cargar datasetgaia.csv`);
        if (!membershipsResponse.ok) throw new Error(`HTTP ${membershipsResponse.status} al cargar cluster_memberships.csv`);
        const [gaiaCsv, membershipsCsv] = await Promise.all([gaiaResponse.text(), membershipsResponse.text()]);
        const data = parseGaiaCsv(gaiaCsv, membershipsCsv);
        setState({ status: "ready", data });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("No fue posible cargar el dataset Gaia.", error);
        setState({ status: "error", data: null });
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  return state;
}
