import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { site } from "@/lib/site";

const navItems = [
  { href: "#apartment", key: "apartment" },
  { href: "#gallery", key: "gallery" },
  { href: "#availability", key: "availability" },
  { href: "#location", key: "location" },
  { href: "#faq", key: "faq" },
] as const;

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink-900/30 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-medium text-white">
          {site.name}
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher dark />
          <a
            href="#contact"
            className="hidden rounded-full bg-terra-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-terra-600 sm:block"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
