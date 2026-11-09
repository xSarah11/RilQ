"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">🛸</div>
      <h1 className="mt-4 text-2xl font-bold">{t("notFound")}</h1>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-glow px-5 py-2.5 font-bold text-space-950">
        {t("home")}
      </Link>
    </div>
  );
}
