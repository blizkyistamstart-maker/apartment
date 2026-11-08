import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BedDouble, Building2, Ruler, Users } from "lucide-react";
import { site } from "@/lib/site";
import { BookingWidget } from "./booking-widget";
import heroImage from "../../public/images/sunset.jpg";

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
    <section
      id="top"
      className="relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-sea-900"
    >
      <Image
        src={heroImage}
        alt={t("imageAlt")}
        fill
        // Next 16: `priority` ist deprecated — LCP-Bild stattdessen eager laden
        loading="eager"
        fetchPriority="high"
        quality={85}
        placeholder="blur"
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sea-900/95 via-sea-900/50 to-sea-900/20" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sand-200">
          {t("eyebrow")}
        </p>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-sand-100 sm:text-2xl">
          {t("subheadline", { guests: apartment.maxGuests })}
        </p>

        <p className="mt-5 flex items-center gap-3 text-sm text-sand-100/90">
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

        {/* Direkt buchbar: Datum wählen → WhatsApp-Anfrage */}
        <div className="mt-7 max-w-3xl">
          <BookingWidget />
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
