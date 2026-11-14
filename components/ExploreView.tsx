"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDate, useLang } from "@/lib/i18n";
import { getPlanet } from "@/data/planets";
import { getRoversByPlanet } from "@/data/rovers";
import { loadProgress, type Progress } from "@/lib/progress";
import StatusChip from "./StatusChip";
import type { PlanetId } from "@/data/types";

// Leaflet touches `window`, so the map is rendered only in the browser.
const PlanetMap = dynamic(() => import("./PlanetMap"), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full" />,
});

type LayerState = "loading" | "ok" | "failed";

export default function ExploreView({ planetId }: { planetId: PlanetId }) {
  const { t, tx, lang } = useLang();
  const planet = getPlanet(planetId)!;
  const rovers = getRoversByPlanet(planetId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [layerId, setLayerId] = useState(planet.layers[0].id);
  const [layerState, setLayerState] = useState<Record<string, LayerState>>({});
  const [showGrid, setShowGrid] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    setProgress(loadProgress());
  }, []);

  const usable = planet.layers.filter((l) => layerState[l.id] !== "failed");
  const layer = usable.find((l) => l.id === layerId) ?? usable[0] ?? null;
  const fallback = layer === null;
  const live = layer ? layerState[layer.id] === "ok" : false;

  const onLayerError = useCallback((id: string) => setLayerState((s) => ({ ...s, [id]: "failed" })), []);
  const onLayerOk = useCallback((id: string) => setLayerState((s) => (s[id] === "ok" ? s : { ...s, [id]: "ok" })), []);

  const selected = rovers.find((r) => r.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            <span className="inline-block rtl:rotate-180">←</span> {t("back")}
          </Link>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
            {t("roversOn")} <span className={planet.id === "mars" ? "text-mars" : "text-moon"}>{tx(planet.name)}</span>
          </h1>
          <p className="text-sm text-white/55">{t("mapHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div>
          <div
            className={`glass relative h-[58vh] min-h-[340px] overflow-hidden rounded-3xl lg:h-[68vh] ${fallback ? `map-fallback-${planet.id}` : ""}`}
          >
            <PlanetMap
              planet={planet}
              layer={layer}
              rovers={rovers}
              selectedId={selectedId}
              onSelect={setSelectedId}
              lang={lang}
              showGrid={showGrid}
              onLayerError={onLayerError}
              onLayerOk={onLayerOk}
              resetSignal={resetSignal}
            />

            {/* Map toolbar */}
            <div className="absolute top-3 end-3 z-[500] flex flex-col items-end gap-2">
              {usable.length > 1 && (
                <div role="radiogroup" aria-label={t("mapLayers")} className="flex rounded-full border border-white/15 bg-space-950/80 p-1 backdrop-blur">
                  {usable.map((l) => (
                    <button
                      key={l.id}
                      role="radio"
                      aria-checked={layer?.id === l.id}
                      onClick={() => setLayerId(l.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        layer?.id === l.id ? "bg-glow text-space-950" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {tx(l.name)}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGrid((g) => !g)}
                  aria-pressed={showGrid}
                  className={`map-btn ${showGrid ? "is-on" : ""}`}
                  title={t("grid")}
                >
                  # <span className="hidden sm:inline">{t("grid")}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setResetSignal((n) => n + 1);
                  }}
                  className="map-btn"
                  title={t("resetView")}
                >
                  ⤢ <span className="hidden sm:inline">{t("resetView")}</span>
                </button>
              </div>
            </div>

            {fallback && (
              <div className="absolute top-14 left-1/2 z-[500] max-w-[80%] -translate-x-1/2 rounded-full text-center bg-black/60 px-3 py-1 text-xs text-white/80">
                {t("mapFallback")}
              </div>
            )}

            {selected && (
              <div className="fade-up absolute inset-x-3 bottom-3 z-[500] rounded-2xl border border-white/15 bg-space-900/95 p-4 shadow-xl sm:inset-x-auto sm:start-3 sm:w-80">
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute end-3 top-2 text-white/50 hover:text-white"
                  aria-label={t("close")}
                >
                  ✕
                </button>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>{selected.flag}</span>
                  <span>{tx(selected.agency)}</span>
                  <StatusChip status={selected.status} />
                </div>
                <h3 className="mt-1 text-xl font-bold" style={{ color: selected.accent }}>
                  {tx(selected.name)}
                </h3>
                <p className="mt-1 text-sm text-white/75">{tx(selected.summary)}</p>
                <div className="mt-2 text-xs text-white/50">
                  {t("landed")}: {formatDate(selected.landingDate, lang)} · {tx(selected.landingSite)}
                </div>
                <div className="mt-1 font-mono text-[11px] text-white/40" dir="ltr">
                  {selected.lat.toFixed(2)}°, {selected.lng.toFixed(2)}°
                </div>
                <Link
                  href={`/rover/${selected.id}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-glow px-4 py-2 font-bold text-space-950 transition hover:brightness-110"
                >
                  {t("viewRover")}
                </Link>
              </div>
            )}
          </div>

          {/* Data source caption for the current layer */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-white/50">
            <span className={`inline-flex items-center gap-1.5 ${live ? "text-emerald-300" : fallback ? "text-rose-300" : ""}`}>
              <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400" : fallback ? "bg-rose-400" : "animate-pulse bg-white/40"}`} />
              {live ? t("liveFromNasa") : fallback ? t("sourceOffline") : t("connecting")}
            </span>
            {layer && (
              <>
                <span>
                  {t("dataset")}: {tx(layer.instrument)}
                </span>
                <a href={layer.source.url} target="_blank" rel="noreferrer" className="text-glow hover:underline">
                  {layer.source.label} ↗
                </a>
              </>
            )}
          </div>
        </div>

        {/* Rover list */}
        <ul className="space-y-3">
          {rovers.map((r) => {
            const done = progress?.missions[r.id];
            const active = r.id === selectedId;
            return (
              <li key={r.id}>
                <button
                  onClick={() => setSelectedId(r.id)}
                  className={`glass card-hover w-full rounded-2xl p-4 text-start ${active ? "ring-2 ring-glow" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold" style={{ color: r.accent }}>
                      {tx(r.name)}
                    </span>
                    <span className="flex items-center gap-2">
                      <StatusChip status={r.status} compact />
                      <span className="text-xs text-white/50" dir="ltr">
                        {r.landingDate.slice(0, 4)}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/65">{tx(r.summary)}</p>
                  {done && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">
                      ✓ {t("completed")} · {done.best}/{done.total}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
