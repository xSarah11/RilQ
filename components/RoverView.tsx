"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, useLang } from "@/lib/i18n";
import { getRover } from "@/data/rovers";
import { getPlanet } from "@/data/planets";
import { loadProgress, markPartSeen } from "@/lib/progress";
import ChatBot from "./ChatBot";
import type { PartMesh } from "@/data/types";

const RoverViewer = dynamic(() => import("./RoverViewer"), { ssr: false });

export default function RoverView({ roverId }: { roverId: string }) {
  const { t, tx, lang } = useLang();
  const rover = getRover(roverId)!;
  const planet = getPlanet(rover.planet)!;

  const [activePart, setActivePart] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    setSeen(loadProgress().partsSeen[rover.id] ?? []);
  }, [rover.id]);

  const part = rover.parts.find((p) => p.id === activePart) ?? null;
  const clickable = rover.parts.map((p) => p.mesh);

  function selectPart(id: string) {
    setActivePart((cur) => (cur === id ? null : id));
    setSeen(markPartSeen(rover.id, id));
  }

  function pickMesh(mesh: PartMesh) {
    const p = rover.parts.find((x) => x.mesh === mesh);
    if (p) selectPart(p.id);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href={`/explore/${rover.planet}`} className="text-sm text-white/50 hover:text-white">
        <span className="inline-block rtl:rotate-180">←</span> {tx(planet.name)}
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ── 3D viewer + parts ── */}
        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="glass relative h-[44vh] max-h-[520px] overflow-hidden rounded-3xl sm:h-[52vh]">
            <RoverViewer
              kind={rover.model}
              planet={rover.planet}
              accent={rover.accent}
              active={part?.mesh ?? null}
              clickable={clickable}
              onPick={pickMesh}
            />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/70">
              {t("dragToRotate")}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-lg font-bold">{t("keyParts")}</h2>
              <span className="text-xs text-white/50">
                {seen.length}/3 {t("partsExplored")}
              </span>
            </div>
            <p className="mb-3 text-xs text-white/50">{t("keyPartsHint")}</p>
            <div className="grid grid-cols-3 gap-2">
              {rover.parts.map((p) => {
                const on = p.id === activePart;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPart(p.id)}
                    aria-pressed={on}
                    className={`glass rounded-2xl p-3 text-center transition hover:border-white/30 ${on ? "ring-2" : ""}`}
                    style={on ? ({ "--tw-ring-color": rover.accent } as React.CSSProperties) : undefined}
                  >
                    <div className="text-2xl">{p.icon}</div>
                    <div className="mt-1 text-xs font-semibold leading-tight">{tx(p.name)}</div>
                    {seen.includes(p.id) && <div className="mt-1 text-[10px] text-emerald-300">✓</div>}
                  </button>
                );
              })}
            </div>

            {part && (
              <div key={part.id} className="glass fade-up mt-3 rounded-2xl p-4" style={{ borderColor: rover.accent + "66" }}>
                <h3 className="font-bold" style={{ color: rover.accent }}>
                  {part.icon} {tx(part.name)}
                </h3>
                <p className="mt-1 text-sm text-white/80">{tx(part.role)}</p>
                <p className="mt-2 rounded-xl bg-white/5 p-2 text-xs text-white/70">
                  💡 <b>{t("funFact")}:</b> {tx(part.funFact)}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Info ── */}
        <section className="fade-up">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>{rover.flag}</span>
            <span>{tx(rover.agency)}</span>
          </div>
          <h1 className="mt-1 text-4xl font-extrabold" style={{ color: rover.accent }}>
            {tx(rover.name)}
          </h1>
          <p className="mt-2 text-lg text-white/80">{tx(rover.summary)}</p>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="glass rounded-xl p-3">
              <dt className="text-xs text-white/50">{t("landed")}</dt>
              <dd className="font-semibold">{formatDate(rover.landingDate, lang)}</dd>
            </div>
            <div className="glass rounded-xl p-3">
              <dt className="text-xs text-white/50">{t("site")}</dt>
              <dd className="font-semibold">{tx(rover.landingSite)}</dd>
            </div>
            {rover.stats.map((s, i) => (
              <div key={i} className="glass rounded-xl p-3">
                <dt className="text-xs text-white/50">{tx(s.label)}</dt>
                <dd className="font-semibold">{tx(s.value)}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-6 text-lg font-bold">📖 {t("story")}</h2>
          <p className="mt-2 leading-relaxed text-white/80">{tx(rover.story)}</p>

          <h2 className="mt-6 text-lg font-bold">🏆 {t("achievements")}</h2>
          <ul className="mt-2 space-y-2">
            {rover.achievements.map((a, i) => (
              <li key={i} className="glass flex gap-3 rounded-xl p-3 text-sm">
                <span style={{ color: rover.accent }}>★</span>
                <span className="text-white/85">{tx(a)}</span>
              </li>
            ))}
          </ul>

          <div className="glass mt-6 rounded-3xl p-5 text-center">
            <div className="text-3xl">🎯</div>
            <h3 className="mt-1 text-xl font-bold">{tx(rover.mission.title)}</h3>
            <p className="mt-1 text-sm text-white/65">{tx(rover.mission.intro)}</p>
            <Link
              href={`/rover/${rover.id}/mission`}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-glow px-6 py-3 font-bold text-space-950 transition hover:brightness-110"
            >
              {t("startMission")} 🚀
            </Link>
          </div>
        </section>
      </div>

      <ChatBot roverId={rover.id} roverName={tx(rover.name)} />
    </div>
  );
}
