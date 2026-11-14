"use client";

// Interactive charts comparing all rovers. Data comes from data/rovers.ts
// (each rover lists its official NASA / agency sources on its own page).
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { rovers } from "@/data/rovers";
import type { Rover } from "@/data/types";

type Metric = "mass" | "distance" | "days" | "timeline";

// Categorical colors by planet — validated for color-blind separation & contrast on the dark surface.
export const PLANET_COLOR = { moon: "#5b8def", mars: "#e8693a" } as const;

const DAY = 86_400_000;
const todayIso = () => new Date().toISOString().slice(0, 10);

function daysActive(r: Rover, today: string | null) {
  if (!today) return null;
  const end = r.endDate ?? (r.status === "active" ? today : null);
  if (!end) return null;
  return Math.max(1, Math.round((Date.parse(end) - Date.parse(r.landingDate)) / DAY));
}

export default function DataLab() {
  const { t, tx, lang } = useLang();
  const [metric, setMetric] = useState<Metric>("mass");
  const [log, setLog] = useState(true);
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  // "Today" is read after mount: Next.js 16 forbids reading the current time while prerendering.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- current date is only known in the browser
    setToday(todayIso());
  }, []);
  const nf = useMemo(() => new Intl.NumberFormat(lang === "ar" ? "ar-SA-u-nu-latn" : "en-US", { maximumFractionDigits: 2 }), [lang]);

  const rows = useMemo(() => {
    const value = (r: Rover) =>
      metric === "mass" ? r.numbers.massKg : metric === "distance" ? r.numbers.distanceKm : metric === "days" ? daysActive(r, today) : null;
    return rovers
      .map((r) => ({ r, v: value(r) }))
      .filter((x): x is { r: Rover; v: number } => x.v !== null)
      .sort((a, b) => b.v - a.v);
  }, [metric, today]);

  const max = Math.max(...rows.map((x) => x.v), 1);
  const min = Math.min(...rows.map((x) => x.v), 1);
  const useLog = log && metric !== "timeline" && max / Math.max(min, 0.01) > 50;
  const scale = (v: number) => {
    if (!useLog) return (v / max) * 100;
    const lo = Math.log10(Math.max(min, 0.01)) - 0.3;
    return ((Math.log10(Math.max(v, 0.01)) - lo) / (Math.log10(max) - lo)) * 100;
  };
  const unit = metric === "mass" ? (lang === "ar" ? "كغ" : "kg") : metric === "distance" ? (lang === "ar" ? "كم" : "km") : t("days");

  const tabs: { id: Metric; label: string }[] = [
    { id: "mass", label: t("metricMass") },
    { id: "distance", label: t("metricDistance") },
    { id: "days", label: t("metricDays") },
    { id: "timeline", label: t("metricTimeline") },
  ];

  return (
    <section id="data-lab" aria-labelledby="lab-title" className="mt-16 scroll-mt-20">
      <div className="mb-5 text-center">
        <span className="eyebrow">📊 {t("navLab")}</span>
        <h2 id="lab-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
          {t("labTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">{t("labText")}</p>
      </div>

      <div className="glass rounded-3xl p-4 sm:p-6">
        {/* Controls — one row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label={t("labTitle")} className="flex flex-wrap gap-1 rounded-2xl bg-white/5 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={metric === tab.id}
                onClick={() => setMetric(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  metric === tab.id ? "bg-white text-space-950" : "text-white/65 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <Legend />
            {metric === "mass" && (
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={log} onChange={(e) => setLog(e.target.checked)} className="accent-glow" />
                {t("logScale")}
              </label>
            )}
            <button onClick={() => setTable((v) => !v)} className="underline-offset-2 hover:text-white hover:underline" aria-pressed={table}>
              {table ? "📊" : "▦"} {lang === "ar" ? (table ? "رسم" : "جدول") : table ? "Chart" : "Table"}
            </button>
          </div>
        </div>

        <div className="mt-5" role="tabpanel">
          {(metric === "timeline" || metric === "days") && !today ? (
            <div className="skeleton h-64 rounded-2xl" />
          ) : metric === "timeline" ? (
            <Timeline today={today!} table={table} />
          ) : table ? (
            <table className="w-full text-sm">
              <thead className="text-xs text-white/50">
                <tr>
                  <th className="py-1 text-start font-medium">{lang === "ar" ? "المركبة" : "Rover"}</th>
                  <th className="py-1 text-end font-medium">{tabs.find((x) => x.id === metric)!.label}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ r, v }) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="py-1.5">{tx(r.name)}</td>
                    <td className="py-1.5 text-end font-mono" dir="ltr">
                      {nf.format(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ul className="space-y-2" aria-label={tabs.find((x) => x.id === metric)!.label}>
              {rows.map(({ r, v }, i) => (
                <li key={r.id}>
                  <Link
                    href={`/rover/${r.id}`}
                    onMouseEnter={() => setHover(r.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(r.id)}
                    onBlur={() => setHover(null)}
                    className="group grid grid-cols-[7.5rem_1fr] items-center gap-3 rounded-lg py-1 outline-none sm:grid-cols-[10rem_1fr]"
                  >
                    <span className="truncate text-xs text-white/75 group-hover:text-white sm:text-sm">{tx(r.name)}</span>
                    <span className="relative flex h-7 items-center">
                      <span
                        className="bar h-full rounded-e-[4px] transition-[width,opacity] duration-700 ease-out"
                        style={{
                          width: `${Math.max(scale(v), 1.5)}%`,
                          background: PLANET_COLOR[r.planet],
                          opacity: hover && hover !== r.id ? 0.35 : 1,
                          transitionDelay: `${i * 40}ms`,
                        }}
                      />
                      <span className="ms-2 whitespace-nowrap font-mono text-xs text-white/80" dir="ltr">
                        {nf.format(v)} {unit}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 text-xs text-white/45">
          {metric === "distance" ? t("distanceNote") : metric === "days" ? t("daysNote") : useLog ? `↔ ${t("logScale")} · ` : ""}
          {metric !== "distance" && metric !== "days" ? t("chartSources") : ""}
        </p>
      </div>
    </section>
  );
}

function Legend() {
  const { lang } = useLang();
  return (
    <span className="flex items-center gap-3">
      {(["moon", "mars"] as const).map((p) => (
        <span key={p} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PLANET_COLOR[p] }} />
          {p === "moon" ? (lang === "ar" ? "القمر" : "Moon") : lang === "ar" ? "المريخ" : "Mars"}
        </span>
      ))}
    </span>
  );
}

/** Mission timeline 1970 → today. Active missions extend to today; unconfirmed status is drawn faded. */
function Timeline({ today, table }: { today: string; table: boolean }) {
  const { t, tx, lang } = useLang();
  const startYear = 1970;
  const endYear = new Date(today).getUTCFullYear() + 1;
  const t0 = Date.UTC(startYear, 0, 1);
  const t1 = Date.UTC(endYear, 0, 1);
  const pos = (iso: string) => ((Date.parse(iso) - t0) / (t1 - t0)) * 100;
  const sorted = [...rovers].sort((a, b) => a.landingDate.localeCompare(b.landingDate));
  const ticks: number[] = [];
  for (let y = startYear; y <= endYear; y += 10) ticks.push(y);
  const fmt = (iso: string) => iso.slice(0, 4);

  if (table) {
    return (
      <table className="w-full text-sm">
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-t border-white/10">
              <td className="py-1.5">{tx(r.name)}</td>
              <td className="py-1.5 text-end font-mono" dir="ltr">
                {r.landingDate} → {r.endDate ?? (r.status === "active" ? t("today") : "?")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div dir="ltr" className="overflow-x-auto">
      <div className="min-w-[560px]">
        {sorted.map((r) => {
          const left = pos(r.landingDate);
          const end = r.endDate ?? today;
          const width = Math.max(pos(end) - left, 0.6);
          const title = `${tx(r.name)}: ${r.landingDate} → ${r.endDate ?? (r.status === "active" ? t("today") : "?")}`;
          return (
            <Link key={r.id} href={`/rover/${r.id}`} className="group grid grid-cols-[8.5rem_1fr] items-center gap-2 py-1" title={title}>
              <span className="truncate text-xs text-white/75 group-hover:text-white" dir={lang === "ar" ? "rtl" : "ltr"}>
                {tx(r.name)}
              </span>
              <span className="relative h-5">
                <span className="absolute inset-y-[9px] start-0 end-0 bg-white/5" />
                <span
                  className={`absolute inset-y-0 rounded-[4px] ${r.status === "unknown" ? "opacity-50" : ""}`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: r.status === "unknown"
                      ? `repeating-linear-gradient(45deg, ${PLANET_COLOR[r.planet]} 0 4px, transparent 4px 7px)`
                      : PLANET_COLOR[r.planet],
                  }}
                />
                {r.status === "active" && (
                  <span className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-pulse rounded-full bg-white" style={{ left: `calc(${left + width}% - 5px)` }} />
                )}
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap ps-1 font-mono text-[10px] text-white/60"
                  style={{ left: `${Math.min(left + width, 88)}%` }}
                >
                  {fmt(r.landingDate)}
                  {r.endDate && fmt(r.endDate) !== fmt(r.landingDate) ? `–${fmt(r.endDate)}` : r.status === "active" ? "–" : ""}
                </span>
              </span>
            </Link>
          );
        })}
        {/* Axis */}
        <div className="grid grid-cols-[8.5rem_1fr] gap-2">
          <span />
          <div className="relative mt-1 h-5 border-t border-white/15">
            {ticks.map((y) => (
              <span key={y} className="absolute top-1 -translate-x-1/2 font-mono text-[10px] text-white/40" style={{ left: `${pos(`${y}-01-01`)}%` }}>
                {y}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
