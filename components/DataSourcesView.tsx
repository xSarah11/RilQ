"use client";

// /data — every NASA source used by ReliQ, with a live connection check (via /api/nasa/status).
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { dataSources } from "@/lib/nasa/sources";
import { useNasa } from "@/lib/nasa/useNasa";
import { planets } from "@/data/planets";

type Check = { id: string; ok: boolean; ms: number; http: number | null; checkedAt: string; note: string | null };
type Status = { checks: Check[]; demoKey: boolean };

export default function DataSourcesView() {
  const { t, tx, lang } = useLang();
  const { data, state, retry } = useNasa<Status>("/api/nasa/status");
  const byId = Object.fromEntries((data?.checks ?? []).map((c) => [c.id, c]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-white/50 hover:text-white">
        <span className="inline-block rtl:rotate-180">←</span> {t("back")}
      </Link>
      <header className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">🛰️ NASA Open Data</span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{t("dataTitle")}</h1>
          <p className="mt-2 max-w-2xl text-white/65">{t("dataText")}</p>
        </div>
        <button
          onClick={retry}
          disabled={state === "loading"}
          className="rounded-xl border border-glow/40 bg-glow/10 px-4 py-2 text-sm font-bold text-glow transition hover:bg-glow/20 disabled:opacity-50"
        >
          {state === "loading" ? t("checking") : `↻ ${t("checkNow")}`}
        </button>
      </header>

      {/* Data flow */}
      <section aria-labelledby="flow" className="glass mt-8 rounded-3xl p-5 sm:p-6">
        <h2 id="flow" className="text-lg font-bold">
          {t("flowTitle")}
        </h2>
        <ol className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {[
            { icon: "🛰️", label: t("flow1"), sub: "api.nasa.gov · images-api.nasa.gov" },
            { icon: "🖥️", label: t("flow2"), sub: "/api/nasa/apod · /api/nasa/images" },
            { icon: "🧑‍🚀", label: t("flow3"), sub: "ReliQ" },
          ].flatMap((step, i, arr) => {
            const box = (
              <li key={step.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-3xl">{step.icon}</div>
                <div className="mt-1 text-sm font-semibold">{step.label}</div>
                <div className="mt-1 font-mono text-[10px] text-white/45" dir="ltr">
                  {step.sub}
                </div>
              </li>
            );
            return i < arr.length - 1
              ? [
                  box,
                  <li key={`a${i}`} aria-hidden className="flow-arrow text-center text-2xl text-glow">
                    <span className="inline-block rotate-90 sm:rotate-0 rtl:sm:rotate-180">→</span>
                  </li>,
                ]
              : [box];
          })}
        </ol>
        <p className="mt-4 text-xs text-white/55">🗺️ {t("flowTiles")}</p>
      </section>

      {/* Sources */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {dataSources.map((s) => {
          const c = byId[s.id];
          const status = state === "loading" ? "checking" : !c ? "unknown" : c.ok ? "ok" : "fail";
          return (
            <article key={s.id} className="glass flex flex-col rounded-3xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-white/45">{s.provider}</div>
                  <h3 className="mt-0.5 font-bold leading-snug" dir="ltr">
                    {s.name}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    status === "ok"
                      ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-300"
                      : status === "fail"
                        ? "border-rose-300/30 bg-rose-400/15 text-rose-200"
                        : "border-white/15 bg-white/5 text-white/60"
                  }`}
                >
                  {status === "ok" ? `✓ ${t("connected")}` : status === "fail" ? `✕ ${t("notConnected")}` : status === "checking" ? t("checking") : t("notChecked")}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">{tx(s.description)}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white/5 p-2.5">
                  <dt className="text-white/45">{t("usedIn")}</dt>
                  <dd className="mt-0.5 font-semibold">{tx(s.usedIn)}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <dt className="text-white/45">{t("updatesEvery")}</dt>
                  <dd className="mt-0.5 font-semibold">{tx(s.updates)}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <dt className="text-white/45">{t("cachedFor")}</dt>
                  <dd className="mt-0.5 font-semibold">{tx(s.cache)}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <dt className="text-white/45">API key</dt>
                  <dd className="mt-0.5 font-semibold">{s.needsKey ? `🔑 ${t("needsKey")}` : `✓ ${t("noKey")}`}</dd>
                </div>
              </dl>
              <code className="mt-3 block overflow-x-auto rounded-xl bg-black/40 p-2.5 font-mono text-[10px] text-white/60" dir="ltr">
                {s.endpoint}
              </code>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-white/45">
                <a href={s.docs} target="_blank" rel="noreferrer" className="text-glow hover:underline">
                  {t("docs")} ↗
                </a>
                {c && (
                  <span dir="ltr">
                    {c.http ? `HTTP ${c.http}` : c.note} · {c.ms} {t("ms")} ·{" "}
                    {new Date(c.checkedAt).toLocaleTimeString(lang === "ar" ? "ar-SA-u-nu-latn" : "en-US")}
                  </span>
                )}
              </div>
              {s.id === "apod" && data?.demoKey && <p className="mt-2 text-[11px] text-amber-200/80">{t("demoKeyNote")}</p>}
            </article>
          );
        })}
      </section>

      {/* Map layers detail */}
      <section className="glass mt-8 rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-bold">🗺️ {t("mapLayers")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <tbody>
              {planets.flatMap((p) =>
                p.layers.map((l) => (
                  <tr key={p.id + l.id} className="border-t border-white/10">
                    <td className="py-2 font-semibold">{tx(p.name)}</td>
                    <td className="py-2">{tx(l.name)}</td>
                    <td className="py-2 text-white/65">{tx(l.instrument)}</td>
                    <td className="py-2">
                      <a href={l.source.url} target="_blank" rel="noreferrer" className="text-glow hover:underline">
                        ↗
                      </a>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-xs text-white/45">ℹ️ {t("archivedNote")}</p>
    </div>
  );
}
