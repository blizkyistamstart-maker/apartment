"use client";

/**
 * Gemeinsame Logik für "Zeitraum wählen → per WhatsApp anfragen".
 * Wird vom Hero-Widget (booking-widget.tsx) und vom Kalender
 * (booking-calendar.tsx) benutzt, damit die Nachricht überall identisch ist.
 */
import { useLocale, useTranslations } from "next-intl";
import { formatDate, nightsBetween, whatsappLink } from "@/lib/site";

export type DateSelection = {
  arrival: string | null;
  departure: string | null;
};

/** Baut die vorbefüllte WhatsApp-Nachricht für eine Anfrage. */
export function useWhatsappRequest() {
  const t = useTranslations("Booking");
  const locale = useLocale();

  return function buildLink({
    arrival,
    departure,
    guests,
  }: {
    arrival: string;
    departure: string;
    guests: number;
  }) {
    return whatsappLink(
      t("whatsappMessage", {
        arrival: formatDate(arrival, locale),
        departure: formatDate(departure, locale),
        nights: nightsBetween(arrival, departure),
        guests,
      }),
    );
  };
}

/** Heute als ISO-Datum (lokale Zeit des Besuchers). */
export function todayIso() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Klick-Logik für die Zeitraum-Auswahl im Kalender:
 * 1. Klick setzt die Anreise, 2. Klick die Abreise.
 * Ein Klick vor der Anreise startet die Auswahl neu.
 */
export function nextSelection(
  current: DateSelection,
  clicked: string,
): DateSelection {
  const { arrival, departure } = current;
  if (!arrival || departure) return { arrival: clicked, departure: null };
  if (clicked <= arrival) return { arrival: clicked, departure: null };
  return { arrival, departure: clicked };
}
