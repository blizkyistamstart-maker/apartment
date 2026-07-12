import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "hr", "pl"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  hr: "Hrvatski",
  pl: "Polski",
};
