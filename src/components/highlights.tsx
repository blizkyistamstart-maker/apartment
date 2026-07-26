import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "./section";
import bedroom2View from "../../public/images/bedroom2-view.jpg";
import kitchen from "../../public/images/kitchen.jpg";
import kitchenDetail from "../../public/images/kitchen-detail.jpg";
import bedroomOrange from "../../public/images/bedroom-orange.jpg";
import bedroomSunset from "../../public/images/bedroom-sunset.jpg";
import bathroom from "../../public/images/bathroom.jpg";
import bathroomShower from "../../public/images/bathroom-shower.jpg";

type HighlightItem = {
  key: string;
  singleImage?: typeof bedroom2View;
  gridImages?: Array<{ src: typeof kitchen; key: string }>;
};

const items: HighlightItem[] = [
  { key: "seaView", singleImage: bedroom2View },
  {
    key: "kitchen",
    gridImages: [
      { src: kitchen, key: "kitchenHero" },
      { src: kitchenDetail, key: "kitchenDetail" },
    ],
  },
  {
    key: "sleeping",
    gridImages: [
      { src: bedroomOrange, key: "bedroom1Hero" },
      { src: bedroomSunset, key: "bedroom2Hero" },
      { src: bedroom2View, key: "bedroomViewDetail" },
    ],
  },
  {
    key: "bath",
    gridImages: [
      { src: bathroom, key: "bathroomHero" },
      { src: bathroomShower, key: "bathroomDetail" },
    ],
  },
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
      <div className="space-y-14 sm:space-y-20">
        {items.map(({ key, singleImage, gridImages }, i) => (
          <div
            key={key}
            className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12"
          >
            <div
              className={`lg:col-span-7 ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              {singleImage ? (
                <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-ink-900/10">
                  <span className="block aspect-[4/3]" />
                  <Image
                    src={singleImage}
                    alt={t(`items.${key}.name`)}
                    fill
                    placeholder="blur"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              ) : gridImages ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {gridImages.map((img, imgIdx) => {
                    const isHero = gridImages.length >= 3 && imgIdx === 0;
                    return (
                      <div
                        key={img.key}
                        className={`relative overflow-hidden ${
                          isHero
                            ? "col-span-2 rounded-3xl shadow-xl shadow-ink-900/10"
                            : "col-span-1 rounded-2xl shadow-xl shadow-ink-900/10"
                        }`}
                      >
                        <span
                          className={`block ${
                            isHero ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[4/3]"
                          }`}
                        />
                        <Image
                          src={img.src}
                          alt={t(`items.${key}.captions.${img.key}`)}
                          fill
                          placeholder="blur"
                          sizes={
                            isHero
                              ? "(max-width: 1024px) 100vw, 66vw"
                              : "(max-width: 1024px) 50vw, 33vw"
                          }
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-5">
              <h3 className="font-display text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                {t(`items.${key}.name`)}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-500">
                {t(`items.${key}.text`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
