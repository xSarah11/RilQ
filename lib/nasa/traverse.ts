// Perseverance (Mars 2020) traverse + waypoints, published by NASA/JPL as GeoJSON for the mission's location map.
// The parser is defensive: it accepts any GeoJSON FeatureCollection of points / lines in [lon, lat(, elev)] order.
import { fetchJson } from "./fetcher";
import { MMGIS_BASE } from "./sources";

const MARS_RADIUS_KM = 3389.5;

type Geometry =
  | { type: "Point"; coordinates: number[] }
  | { type: "LineString" | "MultiPoint"; coordinates: number[][] }
  | { type: "MultiLineString"; coordinates: number[][][] };
type FeatureCollection = { type?: string; features?: { geometry?: Geometry | null; properties?: Record<string, unknown> | null }[] };

export type Traverse = {
  path: [number, number][]; // [lat, lon] for Leaflet
  pointCount: number;
  distanceKm: number; // calculated from the published path
  latest: { lat: number; lon: number; sol: number | null } | null;
  waypointCount: number;
  fetchedAt: string;
};

const normLon = (lon: number) => (lon > 180 ? lon - 360 : lon);
const valid = (c: unknown): c is number[] =>
  Array.isArray(c) && typeof c[0] === "number" && typeof c[1] === "number" && Math.abs(c[1]) <= 90 && Math.abs(c[0]) <= 360;

function lines(fc: FeatureCollection): number[][][] {
  const out: number[][][] = [];
  for (const f of fc.features ?? []) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "LineString" || g.type === "MultiPoint") out.push(g.coordinates.filter(valid));
    else if (g.type === "MultiLineString") g.coordinates.forEach((l) => out.push(l.filter(valid)));
    else if (g.type === "Point" && valid(g.coordinates)) out.push([g.coordinates]);
  }
  return out.filter((l) => l.length > 0);
}

function haversineKm(a: number[], b: number[]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * MARS_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function solOf(p: Record<string, unknown> | null | undefined): number | null {
  if (!p) return null;
  for (const k of ["sol", "Sol", "SOL"]) {
    const v = Number(p[k]);
    if (Number.isFinite(v) && v >= 0) return v;
  }
  return null;
}

export async function getPerseveranceTraverse(): Promise<Traverse> {
  const ttlMs = 6 * 60 * 60 * 1000;
  const [trav, wps] = await Promise.all([
    fetchJson<FeatureCollection>(`${MMGIS_BASE}/M20/Layers/json/M20_traverse.json`, { ttlMs, timeoutMs: 15_000 }),
    fetchJson<FeatureCollection>(`${MMGIS_BASE}/M20/Layers/json/M20_waypoints.json`, { ttlMs, timeoutMs: 15_000 }).catch(() => null),
  ]);

  const segs = lines(trav.data);
  if (segs.length === 0) throw new Error("Traverse file had no usable coordinates");

  let distanceKm = 0;
  const all: number[][] = [];
  for (const seg of segs) {
    for (let i = 1; i < seg.length; i++) distanceKm += haversineKm(seg[i - 1], seg[i]);
    all.push(...seg);
  }

  // Keep at most ~2000 points for the browser.
  const step = Math.max(1, Math.ceil(all.length / 2000));
  const path = all.filter((_, i) => i % step === 0 || i === all.length - 1).map((c) => [c[1], normLon(c[0])] as [number, number]);

  // Latest position: last waypoint if available, otherwise end of the path.
  let latest: Traverse["latest"] = null;
  let waypointCount = 0;
  const pts = (wps?.data.features ?? []).filter((f) => f.geometry?.type === "Point" && valid(f.geometry.coordinates));
  if (pts.length) {
    waypointCount = pts.length;
    const best = pts.reduce((a, b) => ((solOf(b.properties) ?? -1) >= (solOf(a.properties) ?? -1) ? b : a));
    const c = (best.geometry as { coordinates: number[] }).coordinates;
    latest = { lat: c[1], lon: normLon(c[0]), sol: solOf(best.properties) };
  } else {
    const c = all[all.length - 1];
    latest = { lat: c[1], lon: normLon(c[0]), sol: null };
  }

  return {
    path,
    pointCount: all.length,
    distanceKm: Math.round(distanceKm * 100) / 100,
    latest,
    waypointCount,
    fetchedAt: trav.fetchedAt,
  };
}
