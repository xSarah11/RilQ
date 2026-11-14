"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { planets } from "@/data/planets";
import { getRoversByPlanet, rovers } from "@/data/rovers";
import { dataSources } from "@/lib/nasa/sources";
import ApodCard from "./ApodCard";
import DataLab from "./DataLab";

export default function HomeView() {
  const { t, tx, lang } = useLang();

  const steps = [
    { icon: "🪐", label: t("step1") },
    { icon: "🗺️", label: t("step2") },
    { icon: "🛰️", label: t("step3") },
    { icon: "🎯", label: t("step4") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {/* Hero */}
      <section className="fade-up pt-14 pb-10 text-center sm:pt-20">
        <span className="inline-block rounded-full border border-glow/30 bg-glow/10 px-3 py-1 text-xs font-semibold text-glow">
          {t("brandTagline")}
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          <span className="text-gradient">{t("heroTitle")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg">{t("heroText")}</p>
        <dl className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
          {[
            { v: rovers.length, l: t("rovers") },
            { v: planets.length, l: lang === "ar" ? "عالمان" : "worlds" },
            { v: dataSources.length, l: lang === "ar" ? "مصادر ناسا" : "NASA sources" },
          ].map((s) => (
            <div key={s.l} className="glass flex flex-col-reverse rounded-2xl px-2 py-3">
              <dt className="text-[11px] text-white/55 sm:text-xs">{s.l}</dt>
              <dd className="text-2xl font-extrabold text-white sm:text-3xl" dir="ltr">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Planet picker */}
      <section aria-labelledby="choose">
        <h2 id="choose" className="mb-6 text-center text-xl font-bold text-white/90">
          {t("choosePlanet")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {planets.map((p, i) => {
            const count = getRoversByPlanet(p.id).length;
            return (
              <Link
                key={p.id}
                href={`/explore/${p.id}`}
                className="glass card-hover fade-up group relative overflow-hidden rounded-3xl p-6 sm:p-8"
                style={{ animationDelay: `${0.1 + i * 0.12}s` }}
              >
                <div className="flex items-center gap-6">
                  <div
                    className="planet h-28 w-28 shrink-0 sm:h-36 sm:w-36"
                    style={
                      {
                        background: `radial-gradient(circle at 30% 30%, ${p.colors[0]}, ${p.colors[1]} 45%, ${p.colors[2]})`,
                        "--planet-glow": p.id === "mars" ? "rgba(255,122,69,.35)" : "rgba(201,209,230,.25)",
                        animationDelay: `${i * 1.5}s`,
                      } as React.CSSProperties
                    }
                  />
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-white/50">{tx(p.tagline)}</div>
                    <h3 className="mt-1 text-3xl font-extrabold">{tx(p.name)}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-white/65">{tx(p.description)}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {count} {t("rovers")}
                      </span>
                      <span className="text-sm font-bold text-glow transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {t("explore")} <span className="inline-block rtl:rotate-180">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live from NASA */}
      <section aria-label="NASA APOD" className="mt-16">
        <ApodCard />
      </section>

      {/* Interactive charts */}
      <DataLab />

      {/* How it works */}
      <section className="mt-16">
        <h2 className="mb-6 text-center text-xl font-bold text-white/90">{t("howItWorks")}</h2>
        <ol className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 text-xs text-white/40">{i + 1}</div>
              <div className="font-semibold">{s.label}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* NASA data call-out */}
      <section className="glass mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl p-6 text-center sm:flex-row sm:text-start">
        <div>
          <div className="font-bold">🛰️ {t("dataTitle")}</div>
          <p className="mt-1 text-sm text-white/60">{t("dataText")}</p>
        </div>
        <Link
          href="/data"
          className="shrink-0 rounded-xl border border-glow/40 bg-glow/10 px-5 py-2.5 text-sm font-bold text-glow transition hover:bg-glow/20"
        >
          {t("navData")} <span className="inline-block rtl:rotate-180">→</span>
        </Link>
      </section>
    </div>
  );
}
