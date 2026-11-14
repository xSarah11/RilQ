"use client";

// Data Hub: every NASA source with a live connection check, plus rover comparison charts.
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { MassChart, LandingTimeline } from "./RoverCharts";

export type SourceInfo = {
  id: string;
  name: string;
  provider: string;
  kind: string;
  usedFor: { ar: string; en: string };
  docs: string;
  updates: { ar: string; en: string };
};

type Status = { checkedAt: string; results: { id: string; ok: boolean; status: number | null; ms: number }[] };

export default function DataHubView({ sources }: { sources: SourceInfo[] }) {
  const { t, tx, lang } = useLang();
  const [status, setStatus] = useState<Status | null>(null);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const check = useCallback(() => {
    setChecking(true);
    setFailed(false);
    fetch("/api/nasa/status")
      .then((r) => r.json())
      .then((d: Status) => setStatus(d))
      .catch(() => setFailed(true))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start of a network request
    check();
  }, [check]);

  const okCount = status?.results.filter((r) => r.ok).length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <section className="fade-up pt-12 pb-8 text-center">
        <span className="inline-block rounded-full border border-glow/30 bg-glow/10 px-3 py-1 text-xs font-semibold text-glow">🛰️ {t("dataHub")}</span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
          <span className="text-gradient">{t("dataHubTitle")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/65">{t("dataHubText")}</p>
      </section>

      <section aria-labelledby="sources">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="sources" className="text-xl font-bold">
            {t("sourcesTitle")}
          </h2>
          <div className="flex items-center gap-3 text-xs">
            {status && (
              <span className="text-white/55" dir="ltr">
                {okCount}/{status.results.length} · {new Date(status.checkedAt).toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US")}
              </span>
            )}
            <button onClick={check} disabled={checking} className="rounded-full border border-white/20 px-3 py-1.5 font-semibold hover:border-glow/60 disabled:opacity-50">
              {checking ? t("checking") : `↻ ${t("checkNow")}`}
            </button>
          </div>
        </div>
        {failed && <p className="mb-3 text-sm text-rose-300">{t("nasaUnavailable")}</p>}

        <div className="grid gap-3 md:grid-cols-2">
          {sources.map((s) => {
            const r = status?.results.find((x) => x.id === s.id);
            return (
              <article key={s.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-snug" dir="ltr">
                      {s.name}
                    </h3>
                    <div className="mt-0.5 text-xs text-white/50" dir="ltr">
                      {s.provider} · {s.kind}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      !r ? "bg-white/10 text-white/50" : r.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"
                    }`}
                  >
                    {!r ? t("checking") : r.ok ? `● ${t("connected")} · ${r.ms} ms` : `● ${t("notConnected")}`}
                  </span>
                </div>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-white/50">{t("usedFor")}:</dt>
                    <dd>{tx(s.usedFor)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-white/50">{t("refresh")}:</dt>
                    <dd>{tx(s.updates)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/10 px-2 py-0.5">🔓 {t("noKey")}</span>
                  <a href={s.docs} target="_blank" rel="noreferrer" className="text-glow hover:underline">
                    {t("docs")} ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="compare">
        <h2 id="compare" className="mb-3 text-xl font-bold">
          {t("compareTitle")}
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          <MassChart />
          <LandingTimeline />
        </div>
        <p className="mt-3 text-center text-xs text-white/45">{t("factsSources")}</p>
      </section>
    </div>
  );
}
