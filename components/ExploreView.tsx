"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, useLang } from "@/lib/i18n";
import { getPlanet } from "@/data/planets";
import { getRoversByPlanet } from "@/data/rovers";
import { loadProgress, type Progress } from "@/lib/progress";
import type { PlanetId } from "@/data/types";

// Leaflet touches `window`, so the map is rendered only in the browser.
const PlanetMap = dynamic(() => import("./PlanetMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-space-800" />,
});

export default function ExploreView({ planetId }: { planetId: PlanetId }) {
  const { t, tx, lang } = useLang();
  const planet = getPlanet(planetId)!;
  const rovers = getRoversByPlanet(planetId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    setProgress(loadProgress());
  }, []);

  const selected = rovers.find((r) => r.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            <span className="inline-block rtl:rotate-180">←</span> {t("back")}
          </Link>
          <h1 className="mt-1 text-3xl font-extrabold">
            {t("roversOn")} <span className={planet.id === "mars" ? "text-mars" : "text-moon"}>{tx(planet.name)}</span>
          </h1>
          <p className="text-sm text-white/55">{t("mapHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="glass relative h-[60vh] min-h-[360px] overflow-hidden rounded-3xl lg:h-[70vh]">
          <PlanetMap
            planet={planet}
            rovers={rovers}
            selectedId={selectedId}
            onSelect={setSelectedId}
            lang={lang}
          />

          {selected && (
            <div className="fade-up absolute inset-x-3 bottom-20 z-[550] sm:bottom-8 rounded-2xl border border-white/15 bg-space-900/95 shadow-xl p-4 sm:inset-x-auto sm:right-3 sm:w-80">
              <button
                onClick={() => setSelectedId(null)}
                className="absolute end-3 top-2 text-white/50 hover:text-white"
                aria-label="close"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>{selected.flag}</span>
                <span>{tx(selected.agency)}</span>
              </div>
              <h3 className="mt-1 text-xl font-bold" style={{ color: selected.accent }}>
                {tx(selected.name)}
              </h3>
              <p className="mt-1 text-sm text-white/75">{tx(selected.summary)}</p>
              <div className="mt-2 text-xs text-white/50">
                {t("landed")}: {formatDate(selected.landingDate, lang)} · {tx(selected.landingSite)}
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

        {/* Rover list */}
        <ul className="space-y-3">
          {rovers.map((r) => {
            const done = progress?.missions[r.id];
            const active = r.id === selectedId;
            return (
              <li key={r.id}>
                <button
                  onClick={() => setSelectedId(r.id)}
                  className={`glass w-full rounded-2xl p-4 text-start transition hover:border-white/30 ${
                    active ? "ring-2 ring-glow" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold" style={{ color: r.accent }}>
                      {tx(r.name)}
                    </span>
                    <span className="text-xs text-white/50" dir="ltr">
                      {r.landingDate.slice(0, 4)}
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
