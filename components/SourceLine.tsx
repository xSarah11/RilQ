"use client";

import { useLang } from "@/lib/i18n";

/** "Source: X ↗ · Updated <time>" line shown under every block of live NASA data. */
export default function SourceLine({
  name,
  url,
  fetchedAt,
  stale = false,
  demoKey = false,
}: {
  name: string;
  url: string;
  fetchedAt?: string;
  stale?: boolean;
  demoKey?: boolean;
}) {
  const { t, lang } = useLang();
  const time = fetchedAt
    ? new Date(fetchedAt).toLocaleString(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  return (
    <div className="space-y-1 text-[11px] text-white/45">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={`h-1.5 w-1.5 rounded-full ${stale ? "bg-amber-300" : "bg-emerald-400"}`} aria-hidden />
        <span>
          {t("source")}:{" "}
          <a href={url} target="_blank" rel="noreferrer" className="text-glow hover:underline">
            {name} ↗
          </a>
        </span>
        {time && (
          <span>
            · {t("updated")}: {time}
          </span>
        )}
      </div>
      {stale && <div className="text-amber-200/80">{t("cachedCopy")}</div>}
      {demoKey && <div className="text-white/35">{t("demoKeyNote")}</div>}
    </div>
  );
}
