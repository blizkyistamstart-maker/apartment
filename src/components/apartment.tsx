import { useTranslations } from "next-intl";
import {
  Baby,
  Bed,
  BedDouble,
  Car,
  CigaretteOff,
  Coffee,
  Flower2,
  Snowflake,
  Sofa,
  Sun,
  Tv,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import { Section } from "./section";

const amenities = [
  { icon: Umbrella, key: "beachfront" },
  { icon: Waves, key: "seaView" },
  { icon: Sun, key: "terrace" },
  { icon: Flower2, key: "gardenView" },
  { icon: Snowflake, key: "ac" },
  { icon: Wifi, key: "wifi" },
  { icon: Utensils, key: "kitchen" },
  { icon: Coffee, key: "coffee" },
  { icon: Car, key: "parking" },
  { icon: Tv, key: "tv" },
  { icon: Baby, key: "family" },
  { icon: CigaretteOff, key: "nonSmoking" },
] as const;

const beds = [
  { icon: BedDouble, key: "br1" },
  { icon: Bed, key: "br2" },
  { icon: Sofa, key: "sofa" },
] as const;

export function Apartment() {
  const t = useTranslations("Apartment");

  return (
    <Section
      id="apartment"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-700">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-ink-500">
            {t("beds.title")}
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {beds.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-xl bg-sea-50 px-4 py-3"
              >
                <Icon className="size-5 shrink-0 text-sea-600" />
                <span className="text-sm font-medium text-ink-700">
                  {t(`beds.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {amenities.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-4 py-3"
            >
              <Icon className="size-5 shrink-0 text-sea-600" />
              <span className="text-sm font-medium text-ink-700">
                {t(`items.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
