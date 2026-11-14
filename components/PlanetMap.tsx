"use client";

// Interactive planet map (Leaflet + NASA Trek WMTS tiles). Loaded only in the browser (see ExploreView).
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Lang, MapLayer, Planet, Rover } from "@/data/types";

type Props = {
  planet: Planet;
  layer: MapLayer | null; // null → every NASA layer failed → stylized fallback background
  rovers: Rover[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
  showGrid: boolean;
  /** Called when the current layer can't load its first tiles (so the parent can switch layers). */
  onLayerError: (layerId: string) => void;
  /** Called once the current layer has loaded at least one tile. */
  onLayerOk: (layerId: string) => void;
  resetSignal: number;
};

/** Mean planetary radius in km (NASA planetary fact sheets) — used for the scale bar. */
const RADIUS_KM = { moon: 1737.4, mars: 3389.5 } as const;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function FlyTo({ rover }: { rover: Rover | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (rover) map.flyTo([rover.lat, rover.lng], Math.max(map.getZoom(), 4), { duration: 1.2 });
  }, [rover, map]);
  return null;
}

function ResetView({ signal }: { signal: number }) {
  const map = useMap();
  useEffect(() => {
    if (signal > 0) map.flyTo([0, 0], 1, { duration: 0.8 });
  }, [signal, map]);
  return null;
}

/** Live cursor coordinates + a scale bar computed for the planet's real radius
 *  (Leaflet's built-in scale assumes Earth, so it would be wrong here). */
function Readout({ planetId, lang }: { planetId: Planet["id"]; lang: Lang }) {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [scale, setScale] = useState<{ px: number; label: string } | null>(null);

  const map = useMapEvents({
    mousemove: (e) => setPos({ lat: e.latlng.lat, lng: e.latlng.lng }),
    mouseout: () => setPos(null),
    zoomend: () => updateScale(),
    moveend: () => updateScale(),
  });

  function updateScale() {
    const z = map.getZoom();
    const lat = map.getCenter().lat;
    // EPSG:4326 in Leaflet: zoom 0 = 512 px for 360° of longitude.
    const degPerPx = 360 / (512 * 2 ** z);
    const kmPerDeg = (2 * Math.PI * RADIUS_KM[planetId]) / 360;
    const kmPerPx = degPerPx * kmPerDeg * Math.max(Math.cos((lat * Math.PI) / 180), 0.05);
    const maxKm = kmPerPx * 110;
    const pow = 10 ** Math.floor(Math.log10(maxKm));
    const nice = [5, 2, 1].map((m) => m * pow).find((v) => v <= maxKm) ?? pow;
    const unit = lang === "ar" ? "كم" : "km";
    setScale({ px: nice / kmPerPx, label: `${nice >= 1 ? nice.toLocaleString("en-US") : nice.toFixed(1)} ${unit}` });
  }

  useEffect(() => {
    updateScale();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute when planet/lang change
  }, [planetId, lang]);

  const fmt = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;

  return (
    <div className="pointer-events-none absolute bottom-7 end-2 z-[450] flex flex-col items-end gap-1 text-[11px]" dir="ltr">
      {scale && (
        <div className="rounded-md bg-black/60 px-2 py-1 text-white/80">
          <div className="h-1.5 border-x border-b border-white/80" style={{ width: scale.px }} />
          <div className="mt-0.5 text-center">{scale.label}</div>
        </div>
      )}
      {pos && (
        <div className="rounded-md bg-black/60 px-2 py-1 font-mono text-white/80">
          {fmt(pos.lat, "N", "S")} · {fmt(pos.lng, "E", "W")}
        </div>
      )}
    </div>
  );
}

/** Latitude/longitude grid every 30°. */
function Graticule() {
  const lines = useMemo(() => {
    const out: [number, number][][] = [];
    for (let lat = -60; lat <= 60; lat += 30) out.push([[lat, -180], [lat, 180]]);
    for (let lng = -150; lng <= 150; lng += 30) out.push([[-90, lng], [90, lng]]);
    return out;
  }, []);
  return (
    <>
      {lines.map((l, i) => (
        <Polyline
          key={i}
          positions={l}
          interactive={false}
          pathOptions={{ color: "#ffffff", weight: l[0][0] === 0 && l[1][0] === 0 ? 1.2 : 0.6, opacity: 0.35, dashArray: "3 5" }}
        />
      ))}
    </>
  );
}

export default function PlanetMap({
  planet,
  layer,
  rovers,
  selectedId,
  onSelect,
  lang,
  showGrid,
  onLayerError,
  onLayerOk,
  resetSignal,
}: Props) {
  const errors = useRef(0);
  const loaded = useRef(false);

  // Reset tile-health counters whenever the layer changes.
  useEffect(() => {
    errors.current = 0;
    loaded.current = false;
  }, [layer?.id]);

  const icons = useMemo(
    () =>
      Object.fromEntries(
        rovers.map((r) => [
          r.id,
          L.divIcon({
            className: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            html: `<div class="rover-marker ${r.status === "active" ? "is-active" : ""} ${r.id === selectedId ? "is-selected" : ""}" style="color:${r.accent}"><div class="ring"></div><div class="dot"></div><div class="label">${escapeHtml(r.name[lang])}</div></div>`,
          }),
        ]),
      ),
    [rovers, lang, selectedId],
  );

  const selected = rovers.find((r) => r.id === selectedId);

  return (
    <MapContainer
      crs={L.CRS.EPSG4326}
      center={[0, 0]}
      zoom={1}
      minZoom={1}
      maxZoom={9}
      zoomSnap={0.5}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={0.8}
      worldCopyJump={false}
      className="h-full w-full"
      attributionControl
    >
      {layer && (
        <TileLayer
          key={layer.id}
          url={layer.url}
          noWrap
          maxNativeZoom={layer.maxNativeZoom}
          keepBuffer={4}
          updateWhenZooming={false}
          attribution={`Imagery: <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer">NASA Trek</a> · ${escapeHtml(layer.instrument.en)}`}
          eventHandlers={{
            tileload: () => {
              if (!loaded.current) {
                loaded.current = true;
                onLayerOk(layer.id);
              }
            },
            tileerror: () => {
              errors.current += 1;
              // If the first tiles all fail, report it so the parent can switch to another layer.
              if (!loaded.current && errors.current >= 4) {
                errors.current = 0;
                onLayerError(layer.id);
              }
            },
          }}
        />
      )}

      {showGrid && <Graticule />}

      {rovers.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={icons[r.id]}
          title={r.name[lang]}
          alt={r.name[lang]}
          keyboard
          eventHandlers={{ click: () => onSelect(r.id) }}
        />
      ))}

      <FlyTo rover={selected} />
      <ResetView signal={resetSignal} />
      <Readout planetId={planet.id} lang={lang} />
    </MapContainer>
  );
}
