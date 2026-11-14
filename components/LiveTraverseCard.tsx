"use client";

// Live numbers for Perseverance, computed from NASA/JPL's published traverse (via /api/nasa/traverse).
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

type T = { distanceKm: number; latest: { sol: number | null } | null; fetchedAt: string };

export default function LiveTraverseCard({ planet }: { planet: string }) {
  const { t, lang } = useLang();
  const [state, setState] = useState<{ s: "loading" | "error" } | { s: "ok"; d: T }>({ s: "loading" });

  useEffect(() => {
    let off = false;
    fetch("/api/nasa/traverse")
      .then((r) => r.json())
      .then((d) => !off && setState(d?.ok ? { s: "ok", d } : { s: "error" }))
      .catch(() => !off && setState({ s: "error" }));
    return () => {
      off = true;
    };
  }, []);

  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");

  return (
    <div className="glass mt-6 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">🛰️ {t("liveData")}</h2>
        {state.s === "ok" && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">● {t("liveFromNasa")}</span>}
      </div>
      {state.s === "loading" && <div className="mt-3 h-14 animate-pulse rounded-xl bg-white/5" />}
      {state.s === "error" && <p className="mt-2 text-sm text-white/60">{t("nasaUnavailable")}</p>}
      {state.s === "ok" && (
        <>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-white/5 p-3">
              <dt className="text-xs text-white/50">{t("traveledByPath")}</dt>
              <dd className="text-xl font-bold">
                {n(state.d.distanceKm)} {t("km")}
              </dd>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <dt className="text-xs text-white/50">{t("latestSol")}</dt>
              <dd className="text-xl font-bold">{state.d.latest?.sol != null ? n(state.d.latest.sol) : "—"}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] text-white/45">
            {t("source")}: NASA/JPL Mars 2020 · {t("updated")}{" "}
            {new Date(state.d.fetchedAt).toLocaleString(lang === "ar" ? "ar-SA-u-ca-gregory" : "en-US", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
            <Link href={`/explore/${planet}`} className="text-glow hover:underline">
              {t("perseverancePath")} →
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
