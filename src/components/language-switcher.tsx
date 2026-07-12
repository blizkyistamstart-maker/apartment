"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onChange(next: string) {
    router.replace(
      // @ts-expect-error — params passen zur aktuellen Route
      { pathname, params },
      { locale: next as Locale },
    );
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("languageLabel")}</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none rounded-full border py-1.5 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sea-500 ${
          dark
            ? "border-white/30 bg-white/10 text-white [&>option]:text-ink-900"
            : "border-sand-300 bg-white text-ink-700"
        }`}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className={`pointer-events-none absolute right-2.5 size-3 ${dark ? "text-white" : "text-ink-500"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m3 6 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
