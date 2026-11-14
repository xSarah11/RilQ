"use client";

import { useLang } from "@/lib/i18n";
import type { Rover } from "@/data/types";

const STYLE: Record<Rover["status"], string> = {
  active: "bg-emerald-400/15 text-emerald-300 border-emerald-300/30",
  ended: "bg-white/5 text-white/55 border-white/15",
  unknown: "bg-amber-400/10 text-amber-200 border-amber-300/25",
};

/** Small pill showing whether a mission is still active. */
export default function StatusChip({ status, compact = false }: { status: Rover["status"]; compact?: boolean }) {
  const { t } = useLang();
  const label = status === "active" ? t("statusActive") : status === "ended" ? t("statusEnded") : t("statusUnknown");
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STYLE[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "animate-pulse bg-emerald-400" : status === "ended" ? "bg-white/40" : "bg-amber-300"}`} />
      <span className={compact ? "max-sm:sr-only" : undefined}>{label}</span>
    </span>
  );
}
