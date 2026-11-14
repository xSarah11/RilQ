"use client";

// Two interactive SVG charts (no chart library): rover mass (log scale) and landing timeline.
import Link from "next/link";
import { useState } from "react";
import { rovers } from "@/data/rovers";
import { useLang, formatDate } from "@/lib/i18n";

const W = 720;

const shortName = (r: (typeof rovers)[number], lang: "ar" | "en") =>
  r.id === "apollo-lrv" ? (lang === "ar" ? "مركبة أبولو" : "Apollo LRV") : r.name[lang];

export function MassChart() {
  const { t, tx, lang } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const rows = [...rovers].sort((a, b) => b.massKg - a.massKg);
  const left = 175,
    right = 80,
    rowH = 38,
    top = 10;
  const H = top + rows.length * rowH + 30;
  const lo = Math.log10(5),
    hi = Math.log10(2000);
  const X = (kg: number) => left + ((Math.log10(kg) - lo) / (hi - lo)) * (W - left - right);
  const ticks = [10, 100, 1000];
  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
  const kg = lang === "ar" ? "كغ" : "kg";

  return (
    <figure className="glass rounded-3xl p-4 sm:p-6">
      <figcaption className="mb-1 font-bold">{t("massChart")}</figcaption>
      <p className="mb-3 text-xs text-white/50">{t("massChartNote")}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("massChart")} direction="ltr">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={X(v)} x2={X(v)} y1={top} y2={H - 24} stroke="rgba(255,255,255,.12)" strokeDasharray="3 4" />
            <text x={X(v)} y={H - 6} textAnchor="middle" fontSize="13" fill="rgba(255,255,255,.5)">
              {n(v)} {kg}
            </text>
          </g>
        ))}
        {rows.map((r, i) => {
          const y = top + i * rowH;
          const on = hover === r.id;
          return (
            <g key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <Link href={`/rover/${r.id}`}>
                <rect x="0" y={y} width={W} height={rowH} fill={on ? "rgba(255,255,255,.05)" : "transparent"} />
                <text x={left - 10} y={y + rowH / 2 + 5} textAnchor="end" fontSize="15" fill="#e8ecff" fontWeight={on ? 700 : 500}>
                  {shortName(r, lang)}
                </text>
                <rect x={left} y={y + 8} width={Math.max(2, X(r.massKg) - left)} height={rowH - 16} rx="5" fill={r.accent} fillOpacity={on ? 1 : 0.75} />
                <text x={X(r.massKg) + 8} y={y + rowH / 2 + 5} fontSize="14" fill="#e8ecff">
                  {n(r.massKg)} {kg}
                </text>
              </Link>
            </g>
          );
        })}
      </svg>
      {hover && <p className="mt-2 text-center text-xs text-white/60">{tx(rovers.find((r) => r.id === hover)!.summary)}</p>}
    </figure>
  );
}

export function LandingTimeline() {
  const { t, tx, lang } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const rows = [...rovers].sort((a, b) => a.landingDate.localeCompare(b.landingDate));
  const y0 = 1965,
    y1 = 2026;
  const left = 30,
    right = 30;
  const X = (iso: string) => {
    const d = new Date(iso + "T00:00:00Z");
    const yr = d.getUTCFullYear() + d.getUTCMonth() / 12;
    return left + ((yr - y0) / (y1 - y0)) * (W - left - right);
  };
  const H = 190,
    axisY = 100;
  const decades = [1970, 1980, 1990, 2000, 2010, 2020];

  return (
    <figure className="glass rounded-3xl p-4 sm:p-6">
      <figcaption className="mb-3 font-bold">{t("timelineTitle")}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("timelineTitle")} direction="ltr">
        <line x1={left} x2={W - right} y1={axisY} y2={axisY} stroke="rgba(255,255,255,.35)" />
        {decades.map((d) => (
          <g key={d}>
            <line x1={X(`${d}-01-01`)} x2={X(`${d}-01-01`)} y1={axisY - 4} y2={axisY + 4} stroke="rgba(255,255,255,.35)" />
            <text x={X(`${d}-01-01`)} y={axisY + 22} textAnchor="middle" fontSize="13" fill="rgba(255,255,255,.5)">
              {d}
            </text>
          </g>
        ))}
        {rows.map((r, i) => {
          const x = X(r.landingDate);
          const up = i % 2 === 0;
          const ly = up ? axisY - 34 - (i % 4 === 0 ? 0 : 22) : axisY + 44 + (i % 4 === 1 ? 0 : 22);
          const on = hover === r.id;
          return (
            <Link key={r.id} href={`/rover/${r.id}`}>
              <g onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                <line x1={x} x2={x} y1={axisY} y2={ly + (up ? 6 : -12)} stroke={r.accent} strokeOpacity=".6" />
                <circle cx={x} cy={axisY} r={on ? 8 : 6} fill={r.accent} stroke="#05060f" strokeWidth="2" />
                <text x={x} y={ly} textAnchor="middle" fontSize="14" fontWeight={on ? 700 : 500} fill="#e8ecff">
                  {shortName(r, lang)} · {r.landingDate.slice(0, 4)}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
      <p className="mt-2 min-h-5 text-center text-xs text-white/60">
        {hover
          ? (() => {
              const r = rovers.find((x) => x.id === hover)!;
              return `${tx(r.name)} — ${formatDate(r.landingDate, lang)} · ${tx(r.landingSite)}`;
            })()
          : ""}
      </p>
    </figure>
  );
}
