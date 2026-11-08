import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "./section";
import sunset from "../../public/images/sunset.jpg";
import viewBay from "../../public/images/view-bay.jpg";
// Achtung: Dateiname irrefuehrend - zeigt den Balkon mit Meerblick
import balcony from "../../public/images/bedroom2-view.jpg";
import sunsetBalcony from "../../public/images/sunset-balcony.jpg";
import livingRoom from "../../public/images/living-room.jpg";
import dining from "../../public/images/dining.jpg";
import kitchen from "../../public/images/kitchen.jpg";
import bedroomOrange from "../../public/images/bedroom-orange.jpg";
import bedroomSunset from "../../public/images/bedroom-sunset.jpg";
import bathroom from "../../public/images/bathroom.jpg";
import bedroom2Sofa from "../../public/images/bedroom2-sofa.jpg";

type Highlight = {
  key: string;
  /** Grosses Leitbild — zeigt moeglichst viel vom Raum. */
  hero: typeof sunset;
  /** Optionales zweites Bild daneben. */
  side?: typeof sunset;
};

/**
 * Nach dem Hero kommen zuerst die grossen Bilder: pro Bereich ein
 * weitwinkliges Leitbild, darunter eine kurze Beschreibung.
 */
const items: Highlight[] = [
  { key: "sunset", hero: sunset, side: sunsetBalcony },
  { key: "balcony", hero: balcony, side: viewBay },
  { key: "living", hero: livingRoom, side: dining },
  { key: "kitchen", hero: kitchen },
  { key: "sleeping", hero: bedroomOrange, side: bedroomSunset },
  { key: "sleeping2", hero: bedroom2Sofa },
  { key: "bath", hero: bathroom },
];

export function Highlights() {
  const t = useTranslations("Highlights");

  return (
    <Section
      id="highlights"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
    >
      <div className="space-y-12 sm:space-y-16">
        {items.map(({ key, hero, side }, i) => (
          <figure key={key}>
            <div
              className={
                side
                  ? "grid gap-3 sm:grid-cols-[3fr_2fr] sm:gap-4"
                  : undefined
              }
            >
              {/* Leitbild: breit und gross, damit man den Raum wirklich sieht */}
              <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-ink-900/10">
                <span className="block aspect-[16/10]" />
                <Image
                  src={hero}
                  alt={t(`items.${key}.alt`)}
                  fill
                  placeholder="blur"
                  quality={75}
                  // Erstes Bild direkt unter dem Hero fruehzeitig laden
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes={
                    side
                      ? "(max-width: 640px) 100vw, (max-width: 1152px) 60vw, 690px"
                      : "(max-width: 1152px) 100vw, 1152px"
                  }
                  className="object-cover"
                />
              </div>
              {side ? (
                <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-ink-900/10">
                  <span className="block aspect-[16/10] sm:aspect-auto sm:h-full" />
                  <Image
                    src={side}
                    alt={t(`items.${key}.altSide`)}
                    fill
                    placeholder="blur"
                    quality={75}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1152px) 40vw, 460px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>

            {/* Kurze Beschreibung direkt unter den Bildern */}
            <figcaption className="mt-5 max-w-3xl">
              <h3 className="font-display text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                {t(`items.${key}.name`)}
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-500">
                {t(`items.${key}.text`)}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
