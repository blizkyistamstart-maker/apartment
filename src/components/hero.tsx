import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BedDouble, Building2, Ruler, Users } from "lucide-react";
import { site } from "@/lib/site";
import heroImage from "../../public/images/balcony-panorama.jpg";

export function Hero() {
  const t = useTranslations("Hero");
  const tReviews = useTranslations("Reviews");
  const locale = useLocale();
  const { apartment, rating } = site;

  const score = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating.score);

  const facts = [
    { icon: Users, label: t("facts.guests", { count: apartment.maxGuests }) },
    {
      icon: BedDouble,
      label: t("facts.bedrooms", { count: apartment.bedrooms }),
    },
    { icon: Ruler, label: t("facts.size", { size: apartment.sizeSqm }) },
    { icon: Building2, label: t("facts.floor") },
  ];

  return (
    <section id="top" className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-sea-900">
      <Image
        src={heroImage}
        alt={t("imageAlt")}
        fill
        priority
        placeholder="blur"
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sea-900/95 via-sea-900/35 to-sea-900/30" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-36 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sand-200">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight text-white sm:text-6xl">
          {t("headline")}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-sand-100/90">
          {t("subheadline", { guests: apartment.maxGuests })}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#availability"
            className="rounded-full bg-terra-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-terra-700/30 transition hover:bg-terra-600"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="#apartment"
            className="rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            {t("ctaSecondary")}
          </a>
        </div>

        <p className="mt-6 flex items-center gap-3 text-sm text-sand-100/90">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg rounded-bl-none bg-white text-sm font-bold text-sea-900"
          >
            {score}
          </span>
          <span>
            <span className="font-semibold text-white">
              {tReviews("scoreLabel")}
            </span>
            {" · "}
            {t("proof", { count: rating.count })}
          </span>
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <Icon className="size-5 shrink-0 text-sand-200" />
              <dd className="text-sm font-medium text-white">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
