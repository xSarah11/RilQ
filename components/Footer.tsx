"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/10 py-6 text-center text-xs text-white/40">
      <span dir="ltr">ReliQ © 2026</span> · {t("footer")} ·{" "}
      <Link href="/data" className="text-glow/80 hover:text-glow">
        {t("navData")}
      </Link>
      <div className="mt-1 text-[10px] text-white/30">
        NASA does not endorse this project. Imagery & data: NASA / JPL-Caltech / SSERVI / USGS.
      </div>
    </footer>
  );
}
