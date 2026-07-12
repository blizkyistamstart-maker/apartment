import { useTranslations } from "next-intl";
import { Landmark, Plane, Umbrella, Building } from "lucide-react";
import { Section } from "./section";
import { site } from "@/lib/site";

const distances = [
  { icon: Umbrella, key: "beach" },
  { icon: Landmark, key: "oldTown" },
  { icon: Plane, key: "airport" },
  { icon: Building, key: "split" },
] as const;

export function LocationSection() {
  const t = useTranslations("Location");
  const { lat, lng } = site.address;

  return (
    <Section
      id="location"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      className="bg-sea-50"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-lg leading-relaxed text-ink-700">{t("body")}</p>
          <ul className="mt-8 space-y-3">
            {distances.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl border border-sea-100 bg-white px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-ink-700">
                  <Icon className="size-5 text-sea-600" />
                  {t(`distances.${key}.label`)}
                </span>
                <span className="text-sm font-semibold text-sea-700">
                  {t(`distances.${key}.value`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-sm">
          <iframe
            title={t("mapTitle")}
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            className="h-full min-h-[320px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
