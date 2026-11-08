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
      {/* Der WhatsApp-Button steckt im Kalender — hier nur der Weg übers Formular */}
      <p className="mt-6 text-center text-sm text-ink-500">
        {t("formAlternative")}{" "}
        <a
          href="#contact"
          className="font-semibold text-sea-700 underline decoration-sea-300 underline-offset-4 transition hover:text-sea-900"
        >
          {t("cta")}
        </a>
      </p>
    </Section>
  );
}
