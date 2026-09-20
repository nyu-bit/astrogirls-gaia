const ENDPOINTS = [
  "https://alasky.cds.unistra.fr/hips-image-services/hips2fits",
  "https://alaskybis.cds.unistra.fr/hips-image-services/hips2fits",
] as const;

const TIMEOUT_MS = 9_000;
const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ra = Number(searchParams.get("ra"));
  const dec = Number(searchParams.get("dec"));

  if (!Number.isFinite(ra) || !Number.isFinite(dec)) {
    return new Response("Los parámetros ra y dec deben ser números finitos.", { status: 400 });
  }

  const query = new URLSearchParams({
    hips: "CDS/P/DSS2/color",
    width: "360",
    height: "216",
    projection: "TAN",
    fov: "0.08",
    coordsys: "icrs",
    ra: String(ra),
    dec: String(dec),
    format: "jpg",
    stretch: "asinh",
  });

  for (const endpoint of ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const upstream = await fetch(`${endpoint}?${query.toString()}`, {
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "image/jpeg,image/*" },
      });

      if (!upstream.ok) continue;

      const image = await upstream.arrayBuffer();
      return new Response(image, {
        status: 200,
        headers: {
          "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
          "Cache-Control": CACHE_CONTROL,
        },
      });
    } catch {
      // Try the secondary CDS endpoint once.
    } finally {
      clearTimeout(timeout);
    }
  }

  return new Response("No fue posible obtener el campo DSS2.", { status: 502 });
}
