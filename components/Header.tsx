"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const { lang, toggle, t } = useLang();

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/10 bg-space-950/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2" aria-label={t("home")}>
          <Logo />
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-wide" dir="ltr">
              Reli<span className="text-glow">Q</span>
            </div>
            <div className="hidden text-[11px] text-white/50 sm:block">{t("brandTagline")}</div>
          </div>
        </Link>

        <button
          onClick={toggle}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold transition hover:border-glow/60 hover:bg-glow/10"
          aria-label="Switch language"
        >
          {lang === "ar" ? "English" : "العربية"}
        </button>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ee7ff" />
          <stop offset="1" stopColor="#ff7a45" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="11" fill="url(#lg)" />
      <ellipse cx="20" cy="20" rx="18" ry="6" fill="none" stroke="#e8ecff" strokeOpacity=".7" strokeWidth="1.6" transform="rotate(-20 20 20)" />
      <circle cx="35" cy="14" r="2.2" fill="#fff" />
    </svg>
  );
}
