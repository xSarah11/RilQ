"use client";

// Official images about a rover, fetched live from the NASA Image and Video Library via /api/nasa/images.
import { useState } from "react";
import { formatDate, useLang } from "@/lib/i18n";
import { useNasa } from "@/lib/nasa/useNasa";
import SourceLine from "./SourceLine";

type Item = {
  id: string;
  title: string;
  date: string | null;
  center: string | null;
  credit: string | null;
  description: string;
  thumb: string;
  page: string;
};
type Resp = { query: string; total: number; items: Item[]; source: { name: string; url: string }; fetchedAt: string; stale: boolean };

export default function NasaGallery({ roverId, accent }: { roverId: string; accent: string }) {
  const { t, lang } = useLang();
  const { data, state, retry } = useNasa<Resp>(`/api/nasa/images?rover=${encodeURIComponent(roverId)}`);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const items = (data?.items ?? []).filter((i) => !broken.has(i.id));

  return (
    <section aria-labelledby="gallery-title" className="mt-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="gallery-title" className="text-lg font-bold">
            🛰️ {t("galleryTitle")}
          </h2>
          <p className="text-xs text-white/50">{t("galleryHint")}</p>
        </div>
        {state === "ok" && data && data.total > 0 && (
          <a href={data.source.url} target="_blank" rel="noreferrer" className="text-xs text-glow hover:underline">
            {data.total.toLocaleString("en-US")} {lang === "ar" ? "نتيجة في ناسا" : "results on NASA"} ↗
          </a>
        )}
      </div>

      {state === "loading" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
          ))}
          <span className="sr-only">{t("galleryLoading")}</span>
        </div>
      )}

      {state === "error" && (
        <div className="glass rounded-2xl p-4 text-sm text-rose-200">
          {t("galleryError")}{" "}
          <button onClick={retry} className="ms-1 underline">
            {t("retryShort")}
          </button>
        </div>
      )}

      {state === "ok" && items.length === 0 && <div className="glass rounded-2xl p-4 text-sm text-white/60">{t("galleryEmpty")}</div>}

      {state === "ok" && items.length > 0 && (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((it, i) => (
              <li key={it.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <a
                  href={it.page}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-space-800 transition hover:border-white/30"
                  style={{ ["--accent" as string]: accent }}
                  title={it.description || it.title}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote NASA thumbnails */}
                    <img
                      src={it.thumb}
                      alt={it.title}
                      loading="lazy"
                      decoding="async"
                      onError={() => setBroken((s) => new Set(s).add(it.id))}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="line-clamp-2 text-xs font-semibold leading-snug text-white/85" dir="ltr" lang="en">
                      {it.title}
                    </div>
                    <div className="mt-1 text-[10px] text-white/45">
                      {it.date ? formatDate(it.date, lang) : ""}
                      {it.center ? ` · ${it.center}` : ""}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <SourceLine name={data!.source.name} url={data!.source.url} fetchedAt={data!.fetchedAt} stale={data!.stale} />
          </div>
        </>
      )}
    </section>
  );
}
