"use client";

// "NASA Picture of the Day" — loaded from our server route /api/nasa/apod (which holds the NASA key).
import { useCallback, useEffect, useState } from "react";
import { formatDate, useLang } from "@/lib/i18n";
import { useNasa } from "@/lib/nasa/useNasa";
import SourceLine from "./SourceLine";

type Apod = {
  title: string;
  date: string;
  explanation: string;
  mediaType: "image" | "other";
  image: string | null;
  hdImage: string | null;
  copyright: string | null;
  pageUrl: string;
  source: { name: string; url: string };
  fetchedAt: string;
  stale: boolean;
  demoKey: boolean;
};

export default function ApodCard() {
  const { t, lang } = useLang();
  const { data, state, retry } = useNasa<Apod>("/api/nasa/apod");
  const [open, setOpen] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when a new image arrives
    setImgOk(true);
  }, [data?.image]);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <section aria-labelledby="apod-title" className="glass overflow-hidden rounded-3xl">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[4/3] bg-space-800 md:aspect-auto md:min-h-[320px]">
          {state === "loading" && <div className="skeleton absolute inset-0" />}
          {state === "ok" && data?.image && imgOk && (
            <a href={data.hdImage ?? data.image} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote NASA image, size unknown in advance */}
              <img
                src={data.image}
                alt={data.title}
                loading="lazy"
                onError={() => setImgOk(false)}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </a>
          )}
          {state === "ok" && (!data?.image || !imgOk) && (
            <a href={data?.pageUrl} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/70 hover:text-white">
              🎬 {t("apodVideo")} ↗
            </a>
          )}
          {state === "error" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-4xl opacity-60">🔭</div>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <span className="eyebrow">🔭 {t("apodTitle")}</span>
          {state === "loading" && <p className="mt-3 text-sm text-white/55">{t("apodLoading")}</p>}
          {state === "error" && (
            <div className="mt-3 text-sm text-rose-200">
              {t("apodError")}{" "}
              <button onClick={retry} className="ms-1 underline">
                {t("retryShort")}
              </button>
            </div>
          )}
          {state === "ok" && data && (
            <>
              <h3 id="apod-title" className="mt-2 text-xl font-bold leading-snug" dir="ltr" lang="en">
                {data.title}
              </h3>
              <div className="mt-1 text-xs text-white/50">
                {formatDate(data.date, lang)}
                {data.copyright && <span dir="ltr"> · © {data.copyright}</span>}
              </div>
              <p
                dir="ltr"
                lang="en"
                className={`mt-3 text-start text-sm leading-relaxed text-white/75 ${open ? "" : "line-clamp-4"}`}
              >
                {data.explanation}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs">
                <button onClick={toggle} className="text-glow hover:underline">
                  {open ? t("showLess") : t("readMore")}
                </button>
                {lang === "ar" && <span className="text-white/40">({t("apodNote")})</span>}
              </div>
              <div className="mt-auto pt-4">
                <SourceLine
                  name={data.source.name}
                  url={data.pageUrl}
                  fetchedAt={data.fetchedAt}
                  stale={data.stale}
                  demoKey={data.demoKey}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
