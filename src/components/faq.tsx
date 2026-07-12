import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Section } from "./section";

const faqKeys = [
  "checkin",
  "parking",
  "beach",
  "family",
  "pets",
  "rules",
  "booking",
] as const;

export function Faq() {
  const t = useTranslations("Faq");

  return (
    <Section id="faq" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="mx-auto max-w-3xl divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
        {faqKeys.map((key) => (
          <details key={key} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
              {t(`items.${key}.q`)}
              <ChevronDown className="size-5 shrink-0 text-ink-500 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-ink-500">
              {t(`items.${key}.a`)}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
