"use client";

// Interactive planet map (Leaflet + NASA Trek tiles). Loaded only in the browser (see ExploreView).
// Features: NASA layer switcher, live Perseverance traverse (Mars), coordinates readout,
// a scale bar computed for the real planet radius, and a graceful fallback if NASA tiles fail.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { Planet, Rover, Lang } from "@/data/types";
import { useLang } from "@/lib/i18n";

type Props = {
  planet: Planet;
  rovers: Rover[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
};

export type TraverseData = {
  ok: true;
  path: [number, number][];
  distanceKm: number;
  latest: { lat: number; lon: number; sol: number | null } | null;
  fetchedAt: string;
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

type Fly = { point: [number, number] } | { bounds: [number, number][] } | null;

function FlyTo({ target }: { target: Fly }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    if ("point" in target) map.flyTo(target.point, Math.max(map.getZoom(), 5), { duration: 1.2 });
    else map.flyToBounds(L.latLngBounds(target.bounds), { padding: [40, 40], maxZoom: 9, duration: 1.4 });
  }, [target, map]);
  return null;
}

/** Live coordinates + planet-true scale bar. */
function Readout({ radiusKm }: { radiusKm: number }) {
  const map = useMap();
  const [pos, setPos] = useState(() => map.getCenter());
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({
    mousemove: (e) => setPos(e.latlng),
    moveend: () => {
      setZoom(map.getZoom());
      if (!matchMedia("(hover: hover)").matches) setPos(map.getCenter());
    },
    zoomend: () => setZoom(map.getZoom()),
  });

  // EPSG:4326 in Leaflet: the whole 360° is 512 * 2^zoom pixels wide.
  const lat = Math.max(-85, Math.min(85, pos.lat));
  const kmPerPx = ((360 / (512 * 2 ** zoom)) * (2 * Math.PI * radiusKm)) / 360 * Math.cos((lat * Math.PI) / 180);
  const target = kmPerPx * 110;
  const pow = 10 ** Math.floor(Math.log10(target));
  const nice = [1, 2, 5, 10].map((m) => m * pow).filter((v) => v <= target).pop() ?? pow;
  const width = nice / kmPerPx;
  const fmt = (v: number) => (v >= 1 ? `${v.toLocaleString("en-US")} km` : `${Math.round(v * 1000)} m`);
  const ns = pos.lat >= 0 ? "N" : "S";
  const ew = pos.lng >= 0 ? "E" : "W";

  return (
    <div className="pointer-events-none absolute bottom-2 left-2 z-[500] flex flex-col gap-1 text-[11px] text-white/85" dir="ltr">
      <div className="rounded-md bg-black/60 px-2 py-1 font-mono">
        {Math.abs(pos.lat).toFixed(2)}°{ns}, {Math.abs(pos.lng).toFixed(2)}°{ew}
      </div>
      <div className="rounded-md bg-black/60 px-2 py-1">
        <div className="h-1.5 border-x-2 border-b-2 border-white/90" style={{ width }} />
        <div className="mt-0.5 font-mono">{fmt(nice)}</div>
      </div>
    </div>
  );
}

export default function PlanetMap({ planet, rovers, selectedId, onSelect, lang }: Props) {
  const { t, tx } = useLang();
  const [layerId, setLayerId] = useState(planet.layers[0].id);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const errors = useRef(0);
  const loaded = useRef(false);

  const hasLive = rovers.some((r) => r.liveTraverse === "m20");
  const [showPath, setShowPath] = useState(true);
  const [trav, setTrav] = useState<{ state: "idle" | "loading" | "ok" | "error"; data?: TraverseData }>({ state: "idle" });
  const [flyTarget, setFlyTarget] = useState<Fly>(null);

  const layer = planet.layers.find((l) => l.id === layerId) ?? planet.layers[0];
  const allFailed = planet.layers.every((l) => failed[l.id]);

  // Load Perseverance's live traverse through our server (which calls NASA/JPL).
  useEffect(() => {
    if (!hasLive) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start of a network request
    setTrav({ state: "loading" });
    fetch("/api/nasa/traverse")
      .then((r) => r.json())
      .then((d) => !cancelled && setTrav(d?.ok && Array.isArray(d.path) && d.path.length ? { state: "ok", data: d } : { state: "error" }))
      .catch(() => !cancelled && setTrav({ state: "error" }));
    return () => {
      cancelled = true;
    };
  }, [hasLive]);

  useEffect(() => {
    const r = rovers.find((x) => x.id === selectedId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follow the selected rover
    if (r) setFlyTarget({ point: [r.lat, r.lng] });
  }, [selectedId, rovers]);

  const switchLayer = useCallback((id: string) => {
    errors.current = 0;
    loaded.current = false;
    setLayerId(id);
  }, []);

  const icons = useMemo(
    () =>
      Object.fromEntries(
        rovers.map((r) => [
          r.id,
          L.divIcon({
            className: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            html: `<div class="rover-marker${r.id === selectedId ? " is-active" : ""}" style="color:${r.accent}"><div class="ring"></div><div class="dot"></div><div class="label">${escapeHtml(r.name[lang])}</div></div>`,
          }),
        ]),
      ),
    [rovers, lang, selectedId],
  );

  const latest = trav.data?.latest;

  return (
    <div className={`relative h-full w-full ${allFailed ? `map-fallback-${planet.id}` : ""}`}>
      <MapContainer
        crs={L.CRS.EPSG4326}
        center={[0, 0]}
        zoom={1}
        minZoom={1}
        maxZoom={9}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={0.8}
        zoomSnap={0.5}
        className="h-full w-full"
        attributionControl
      >
        {!failed[layer.id] && (
          <TileLayer
            key={layer.id}
            url={layer.url}
            noWrap
            maxNativeZoom={layer.maxNativeZoom}
            attribution={layer.attribution}
            eventHandlers={{
              tileload: () => {
                loaded.current = true;
              },
              tileerror: () => {
                errors.current += 1;
                if (!loaded.current && errors.current >= 4) {
                  setFailed((f) => ({ ...f, [layer.id]: true }));
                  const next = planet.layers.find((l) => l.id !== layer.id && !failed[l.id]);
                  if (next) switchLayer(next.id);
                }
              },
            }}
          />
        )}

        {hasLive && showPath && trav.state === "ok" && trav.data && (
          <>
            <Polyline positions={trav.data.path} pathOptions={{ color: "#b79bff", weight: 3, opacity: 0.95 }} />
            {latest && (
              <CircleMarker center={[latest.lat, latest.lon]} radius={6} pathOptions={{ color: "#fff", weight: 2, fillColor: "#b79bff", fillOpacity: 1 }}>
                <Tooltip direction="top" offset={[0, -6]} permanent={false}>
                  {t("latestPosition")}
                  {latest.sol !== null ? ` · ${t("sol")} ${latest.sol}` : ""}
                </Tooltip>
              </CircleMarker>
            )}
          </>
        )}

        {rovers.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={icons[r.id]}
            title={r.name[lang]}
            keyboard
            eventHandlers={{ click: () => onSelect(r.id) }}
          />
        ))}

        <FlyTo target={flyTarget} />
        <Readout radiusKm={planet.radiusKm} />
      </MapContainer>

      {/* Layer panel */}
      <div className="absolute right-2 top-2 z-[600] flex flex-col items-end gap-2">
        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="rounded-xl border border-white/20 bg-space-900/90 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur hover:border-glow/60"
          aria-expanded={panelOpen}
        >
          🗺️ {t("mapLayers")}
        </button>
        {panelOpen && (
          <div className="fade-up w-64 rounded-2xl border border-white/15 bg-space-900/95 p-3 text-sm shadow-2xl">
            <div className="mb-2 text-xs font-semibold text-white/60">{t("baseMap")}</div>
            {planet.layers.map((l) => (
              <label key={l.id} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5 ${failed[l.id] ? "opacity-50" : ""}`}>
                <input type="radio" name="layer" checked={l.id === layer.id} onChange={() => switchLayer(l.id)} disabled={failed[l.id]} className="accent-[var(--color-glow)]" />
                <span className="flex-1">{tx(l.name)}</span>
                {failed[l.id] && <span className="text-[10px] text-rose-300">{t("unavailable")}</span>}
              </label>
            ))}
            {hasLive && (
              <>
                <div className="mt-3 mb-2 text-xs font-semibold text-white/60">{t("dataLayers")}</div>
                <label className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5">
                  <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} className="mt-1" />
                  <span className="flex-1">
                    {t("perseverancePath")}
                    <span className="block text-[11px] text-white/50">
                      {trav.state === "loading" && t("loading")}
                      {trav.state === "error" && <span className="text-rose-300">{t("nasaUnavailable")}</span>}
                      {trav.state === "ok" && trav.data && (
                        <span className="text-emerald-300">
                          ● {t("liveFromNasa")} · {trav.data.distanceKm.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} {t("km")}
                        </span>
                      )}
                    </span>
                  </span>
                </label>
                {trav.state === "ok" && latest && (
                  <button
                    onClick={() => trav.data && setFlyTarget({ bounds: trav.data.path })}
                    className="mt-1 w-full rounded-lg bg-white/10 px-2 py-1.5 text-xs hover:bg-white/20"
                  >
                    📍 {t("showFullPath")}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {allFailed && (
        <div className="absolute left-14 top-2 z-[500] max-w-[50%] rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">{t("mapFallback")}</div>
      )}
    </div>
  );
}
