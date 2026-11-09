"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { getRover, getRoversByPlanet } from "@/data/rovers";
import { saveMissionScore } from "@/lib/progress";

export default function MissionView({ roverId }: { roverId: string }) {
  const { t, tx } = useLang();
  const rover = getRover(roverId)!;
  const steps = rover.mission.steps;

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const step = steps[index];
  const answered = picked !== null;
  const isCorrect = answered && step.options[picked].correct;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (step.options[i].correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 < steps.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      saveMissionScore(rover.id, score, steps.length);
      setDone(true);
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const ratio = score / steps.length;
    const badge = ratio === 1 ? t("badgeGold") : ratio >= 0.6 ? t("badgeSilver") : t("badgeTry");
    const others = getRoversByPlanet(rover.planet).filter((r) => r.id !== rover.id);
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="glass fade-up rounded-3xl p-8">
          <div className="text-6xl">{ratio === 1 ? "🏆" : ratio >= 0.6 ? "🛰️" : "🚀"}</div>
          <h1 className="mt-3 text-3xl font-extrabold">{t("missionComplete")}</h1>
          <p className="mt-2 text-white/60">{t("yourScore")}</p>
          <div className="text-5xl font-extrabold" style={{ color: rover.accent }} dir="ltr">
            {score} / {steps.length}
          </div>
          <div className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 font-semibold">{badge}</div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="rounded-xl border border-white/20 px-5 py-2.5 font-semibold hover:bg-white/10">
              {t("retry")}
            </button>
            <Link href={`/rover/${rover.id}`} className="rounded-xl bg-glow px-5 py-2.5 font-bold text-space-950 hover:brightness-110">
              {t("backToRover")}
            </Link>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-bold text-white/80">{t("moreRovers")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((r) => (
                <Link key={r.id} href={`/rover/${r.id}`} className="glass rounded-2xl p-4 text-start hover:border-white/30">
                  <div className="font-bold" style={{ color: r.accent }}>
                    {tx(r.name)}
                  </div>
                  <div className="text-xs text-white/60">{tx(r.summary)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/rover/${rover.id}`} className="text-sm text-white/50 hover:text-white">
        <span className="inline-block rtl:rotate-180">←</span> {tx(rover.name)}
      </Link>

      <h1 className="mt-2 text-3xl font-extrabold">{tx(rover.mission.title)}</h1>
      <p className="text-white/60">{tx(rover.mission.intro)}</p>

      {/* progress bar */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((index + (answered ? 1 : 0)) / steps.length) * 100}%`, background: rover.accent }}
          />
        </div>
        <span className="text-xs text-white/60">
          {index + 1} {t("of")} {steps.length}
        </span>
      </div>

      <div key={index} className="glass fade-up mt-5 rounded-3xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: rover.accent }}>
          {t("question")} {index + 1}
        </div>
        <p className="mt-2 text-lg font-semibold leading-relaxed">{tx(step.situation)}</p>

        <div className="mt-5 space-y-3">
          {step.options.map((o, i) => {
            let style = "border-white/15 hover:border-white/40 hover:bg-white/5";
            if (answered) {
              if (o.correct) style = "border-emerald-400 bg-emerald-400/15";
              else if (i === picked) style = "border-rose-400 bg-rose-400/15";
              else style = "border-white/10 opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-start transition ${style}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                  {answered && o.correct ? "✓" : answered && i === picked ? "✕" : String.fromCharCode(65 + i)}
                </span>
                <span>{tx(o.text)}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`fade-up mt-5 rounded-2xl p-4 ${isCorrect ? "bg-emerald-400/10" : "bg-amber-400/10"}`}>
            <div className="font-bold">{isCorrect ? `✅ ${t("correct")}` : `💡 ${t("wrong")}`}</div>
            <p className="mt-1 text-sm text-white/80">{tx(step.explanation)}</p>
            <button
              onClick={next}
              className="mt-4 w-full rounded-xl bg-glow px-5 py-3 font-bold text-space-950 transition hover:brightness-110"
            >
              {index + 1 < steps.length ? t("next") : t("finish")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
