"use client";

/**
 * Buchungs-Widget im Hero: Anreise, Abreise, Gäste — ein Klick und die
 * Anfrage geht als vorbefüllte WhatsApp-Nachricht raus.
 */
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { todayIso, useWhatsappRequest } from "./booking-request";

const fieldClass =
  "w-full rounded-xl border border-white/25 bg-white/15 px-3 py-2.5 text-base text-white backdrop-blur-sm [color-scheme:dark] focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/30";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80";

export function BookingWidget() {
  const t = useTranslations("Booking");
  const buildLink = useWhatsappRequest();
  const today = todayIso();

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState(2);

  const datesValid = Boolean(arrival && departure && departure > arrival);
  const datesInvalid = Boolean(arrival && departure && departure <= arrival);

  return (
    <div className="rounded-3xl border border-white/20 bg-ink-900/40 p-4 shadow-2xl shadow-ink-900/40 backdrop-blur-md sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label htmlFor="hero-arrival" className={labelClass}>
            {t("arrival")}
          </label>
          <input
            id="hero-arrival"
            type="date"
            min={today}
            value={arrival}
            onChange={(e) => {
              setArrival(e.target.value);
              // Abreise verwerfen, wenn sie nicht mehr nach der Anreise liegt
              if (departure && departure <= e.target.value) setDeparture("");
            }}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="hero-departure" className={labelClass}>
            {t("departure")}
          </label>
          <input
            id="hero-departure"
            type="date"
            min={arrival || today}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="sm:w-28">
          <label htmlFor="hero-guests" className={labelClass}>
            {t("guests")}
          </label>
          <select
            id="hero-guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={fieldClass}
          >
            {Array.from({ length: site.apartment.maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1} className="text-ink-900">
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {datesValid ? (
        <a
          href={buildLink({ arrival, departure, guests })}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-terra-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-terra-700/30 transition hover:bg-terra-600"
        >
          <MessageCircle className="size-5" />
          {t("submit")}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/15 px-7 py-3.5 text-base font-semibold text-white/60"
        >
          <MessageCircle className="size-5" />
          {t("submit")}
        </button>
      )}

      <p className="mt-2.5 text-center text-xs text-white/70">
        {datesInvalid ? t("hintOrder") : datesValid ? t("hintReady") : t("hint")}
      </p>
    </div>
  );
}
