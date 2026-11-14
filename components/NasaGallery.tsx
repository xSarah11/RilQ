"use client";

// Official NASA photos for one rover, loaded live through /api/nasa/images (NASA Image and Video Library).
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/i18n";

type Img = { nasaId: string; title: string; date: string | null; center: string | null; description: string; thumb: string; page: string };
type State = { s: "loading" } | { s: "error" } | { s: "ok"; items: Img[]; total: number; fetchedAt: string };

export default function NasaGallery({ roverId, accent }: { roverId: string; accent: string }) {
  const { t, lang } = useLang();
  const [state, setState] = useState<State>({ s: "loading" });
  const [open, setOpen] = useState<Img | null>(null);

  const load = useCallback(() => {
    setState({ s: "loading" });
    fetch(`/api/nasa/images?rover=${encodeURIComponent(roverId)}`)
      .then((r) => r.json())
      .then((d) => setState(d?.ok ? { s: "ok", items: d.items ?? [], total: d.total ?? 0, fetchedAt: d.fetchedAt } : { s: "error" }))
      .catch(() => setState({ s: "error" }));
  }, [roverId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start of a network request
    load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="mt-8" aria-labelledby="nasa-photos">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 id="nasa-photos" className="text-lg font-bold">
          📸 {t("nasaPhotos")}
        </h2>
        {state.s === "ok" && (
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
            ● {t("liveFromNasa")} · {t("updated")}{" "}
            {new Date(state.fetchedAt).toLocaleString(lang === "ar" ? "ar-SA-u-ca-gregory" : "en-US", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        )}
      </div>
      <p className="mb-3 text-xs text-white/50">{t("nasaPhotosHint")}</p>

      {state.s === "loading" && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {state.s === "error" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          {t("nasaUnavailable")}{" "}
          <button onClick={load} className="font-semibold text-glow underline-offset-2 hover:underline">
            {t("tryAgain")}
          </button>
        </div>
      )}

      {state.s === "ok" && state.items.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">{t("nasaPhotosEmpty")}</div>
      )}

      {state.s === "ok" && state.items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {state.items.map((img) => (
            <button
              key={img.nasaId}
              onClick={() => setOpen(img)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
              title={img.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote NASA thumbnails, sizes vary */}
              <img src={img.thumb} alt={img.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1 pt-4 text-start text-[10px] text-white/90" dir="ltr">
                {img.date ?? ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(null)} role="dialog" aria-label={open.title}>
          <div className="fade-up max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-white/15 bg-space-900" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.thumb} alt={open.title} className="max-h-[55vh] w-full bg-black object-contain" />
            <div className="p-5" dir="ltr">
              <h3 className="font-bold" style={{ color: accent }}>
                {open.title}
              </h3>
              <div className="mt-1 text-xs text-white/50">
                {open.date} {open.center ? `· ${open.center}` : ""} · NASA ID: {open.nasaId}
              </div>
              {open.description && <p className="mt-3 text-sm leading-relaxed text-white/80">{open.description}</p>}
              <div className="mt-4 flex gap-2">
                <a href={open.page} target="_blank" rel="noreferrer" className="rounded-xl bg-glow px-4 py-2 text-sm font-bold text-space-950">
                  {t("openOnNasa")} ↗
                </a>
                <button onClick={() => setOpen(null)} className="rounded-xl border border-white/20 px-4 py-2 text-sm">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </section>
  );
}
