"use client";

import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/10 py-6 text-center text-xs text-white/40">
      <span dir="ltr">ReliQ © 2026</span> · {t("footer")}
    </footer>
  );
}
