"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { planets } from "@/data/planets";
import { getRoversByPlanet } from "@/data/rovers";

export default function HomeView() {
  const { t, tx } = useLang();

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
                className="glass fade-up group relative overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 hover:border-white/25 sm:p-8"
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

      {/* NASA data */}
      <section className="mt-12">
        <Link href="/data" className="glass group flex flex-col items-start gap-4 rounded-3xl p-6 transition hover:border-white/25 sm:flex-row sm:items-center sm:p-8">
          <div className="text-4xl">🛰️</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{t("homeDataTitle")}</h2>
            <p className="mt-1 text-sm text-white/65">{t("homeDataText")}</p>
          </div>
          <span className="shrink-0 rounded-xl bg-glow px-4 py-2 text-sm font-bold text-space-950 transition group-hover:brightness-110">
            {t("openDataHub")} <span className="inline-block rtl:rotate-180">→</span>
          </span>
        </Link>
      </section>

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
    </div>
  );
}
