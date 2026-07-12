import { getTranslations } from "next-intl/server";
import { Section } from "./section";
import { BookingCalendar } from "./booking-calendar";
import { getBookedRanges } from "@/lib/availability";

export async function AvailabilitySection() {
  const t = await getTranslations("Availability");
  const { ranges, isMock } = await getBookedRanges();

  return (
    <Section
      id="availability"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
    >
      <BookingCalendar ranges={ranges} />
      <p className="mt-4 text-sm italic text-ink-500">
        {isMock ? t("mockNote") : t("syncNote")}
      </p>
      <div className="mt-8 text-center">
        <a
          href="#contact"
          className="inline-block rounded-full bg-terra-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-terra-700/20 transition hover:bg-terra-600"
        >
          {t("cta")}
        </a>
      </div>
    </Section>
  );
}
