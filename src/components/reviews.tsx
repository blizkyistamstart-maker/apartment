import { useLocale, useTranslations } from "next-intl";
import { Section } from "./section";
import { site } from "@/lib/site";

const reviewKeys = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;
const categoryKeys = [
  "staff",
  "facilities",
  "cleanliness",
  "comfort",
  "value",
  "location",
] as const;

export function Reviews() {
  const t = useTranslations("Reviews");
  const locale = useLocale();
  const { rating } = site;

  const formatScore = (value: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <Section
      id="reviews"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
    >
      <div className="mb-8 rounded-2xl border border-sand-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4 md:w-64 md:shrink-0">
            <span className="flex size-14 items-center justify-center rounded-xl rounded-bl-none bg-sea-700 text-xl font-bold text-white">
              {formatScore(rating.score)}
            </span>
            <div>
              <p className="text-lg font-semibold text-ink-900">
                {t("scoreLabel")}
              </p>
              <p className="text-sm text-ink-500">
                {t("countLabel", { count: rating.count })}
              </p>
            </div>
          </div>
          <dl className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryKeys.map((key) => {
              const value = rating.categories[key];
              return (
                <div key={key}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <dt className="text-ink-700">{t(`categories.${key}`)}</dt>
                    <dd className="font-semibold text-ink-900">
                      {formatScore(value)}
                    </dd>
                  </div>
                  <div
                    aria-hidden
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sea-100"
                  >
                    <div
                      className="h-full rounded-full bg-sea-600"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reviewKeys.map((key) => (
          <figure
            key={key}
            className="flex flex-col rounded-2xl border border-sand-200 bg-white p-6"
          >
            <blockquote className="flex-1 text-ink-700">
              “{t(`items.${key}.quote`)}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-ink-900">
              {t(`items.${key}.name`)}
              <span className="ml-2 font-normal text-ink-500">
                {t(`items.${key}.origin`)}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
