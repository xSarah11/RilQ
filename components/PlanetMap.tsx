"use client";

// Interactive planet map (Leaflet). Loaded only in the browser (see ExploreView).
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Planet, Rover, Lang } from "@/data/types";

type Props = {
  planet: Planet;
  rovers: Rover[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
  onFallback: (fallback: boolean) => void;
};

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

export default function PlanetMap({ planet, rovers, selectedId, onSelect, lang, onFallback }: Props) {
  const [tileIndex, setTileIndex] = useState(0);
  const errors = useRef(0);
  const loaded = useRef(false);

  const fallback = tileIndex >= planet.tiles.length;

  useEffect(() => {
    onFallback(fallback);
  }, [fallback, onFallback]);

  const icons = useMemo(
    () =>
      Object.fromEntries(
        rovers.map((r) => [
          r.id,
          L.divIcon({
            className: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            html: `<div class="rover-marker" style="color:${r.accent}"><div class="ring"></div><div class="dot"></div><div class="label">${escapeHtml(r.name[lang])}</div></div>`,
          }),
        ]),
      ),
    [rovers, lang],
  );

  const selected = rovers.find((r) => r.id === selectedId);

  return (
    <MapContainer
      crs={L.CRS.EPSG4326}
      center={[0, 0]}
      zoom={1}
      minZoom={1}
      maxZoom={8}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={0.8}
      worldCopyJump={false}
      className="h-full w-full"
      attributionControl
    >
      {!fallback && (
        <TileLayer
          key={tileIndex}
          url={planet.tiles[tileIndex]}
          noWrap
          maxNativeZoom={planet.maxNativeZoom}
          attribution='Imagery: <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer">NASA Trek</a>'
          eventHandlers={{
            tileload: () => {
              loaded.current = true;
            },
            tileerror: () => {
              errors.current += 1;
              // If the first tiles all fail, try the next source (or fall back).
              if (!loaded.current && errors.current >= 4) {
                errors.current = 0;
                setTileIndex((i) => i + 1);
              }
            },
          }}
        />
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

      <FlyTo rover={selected} />
    </MapContainer>
  );
}
