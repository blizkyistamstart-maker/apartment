"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import type { BookedRange } from "@/lib/availability";
import { formatDate, nightsBetween, site } from "@/lib/site";
import {
  type DateSelection,
  nextSelection,
  todayIso,
  useWhatsappRequest,
} from "./booking-request";

const MAX_MONTHS_AHEAD = 11;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function Month({
  year,
  month,
  today,
  isBooked,
  locale,
  selection,
  onPick,
  rangeBlocked,
}: {
  year: number;
  month: number;
  today: string;
  isBooked: (iso: string) => boolean;
  locale: string;
  selection: DateSelection;
  onPick: (iso: string) => void;
  rangeBlocked: boolean;
}) {
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  // Wochentagsköpfe, Montag zuerst (5.1.2026 ist ein Montag)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2026, 0, 5 + i),
    ),
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay(): 0=So … 6=Sa → Offset für montagsbasierte Woche
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const { arrival, departure } = selection;

  return (
    <div>
      <p className="text-center font-display text-lg font-medium capitalize text-ink-900">
        {monthName}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d) => (
          <div
            key={d}
            className="pb-1 text-xs font-semibold uppercase text-ink-500"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const iso = isoDate(year, month, i + 1);
          const past = iso < today;
          const booked = isBooked(iso);
          const isToday = iso === today;
          const isEdge = iso === arrival || iso === departure;
          const inRange =
            Boolean(arrival && departure) && iso > arrival! && iso < departure!;

          // Vergangene und belegte Tage sind nicht wählbar
          if (past || booked) {
            return (
              <div
                key={iso}
                aria-disabled
                className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                  past ? "text-sand-300" : "bg-sand-200 text-ink-500 line-through"
                } ${isToday ? "ring-2 ring-sea-500" : ""}`}
              >
                {i + 1}
              </div>
            );
          }

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onPick(iso)}
              aria-pressed={isEdge}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-sea-500 ${
                isEdge
                  ? rangeBlocked
                    ? "bg-red-500 font-semibold text-white"
                    : "bg-sea-600 font-semibold text-white"
                  : inRange
                    ? rangeBlocked
                      ? "bg-red-100 font-medium text-red-700"
                      : "bg-sea-100 font-medium text-sea-900"
                    : "border border-sand-200 bg-white font-medium text-ink-900 hover:border-sea-500 hover:bg-sea-50"
              } ${isToday && !isEdge ? "ring-2 ring-sea-500" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingCalendar({ ranges }: { ranges: BookedRange[] }) {
  const t = useTranslations("Availability");
  const tBooking = useTranslations("Booking");
  const locale = useLocale();
  const buildLink = useWhatsappRequest();

  const [offset, setOffset] = useState(0);
  const [selection, setSelection] = useState<DateSelection>({
    arrival: null,
    departure: null,
  });
  const [guests, setGuests] = useState(2);

  const today = todayIso();
  const isBooked = (iso: string) =>
    ranges.some((r) => r.start <= iso && iso < r.end);

  const now = new Date();
  const months = [offset, offset + 1].map((o) => {
    const d = new Date(now.getFullYear(), now.getMonth() + o, 1);
    return { year: d.getFullYear(), month: d.getMonth(), key: o };
  });

  const { arrival, departure } = selection;

  /**
   * Liegt im gewählten Zeitraum ein belegter Tag? Der Abreisetag selbst darf
   * belegt sein (iCal-DTEND ist exklusiv — dort reist der Vorgänger ab).
   */
  const rangeBlocked = useMemo(() => {
    if (!arrival || !departure) return false;
    return ranges.some((r) => r.start < departure && r.end > arrival);
  }, [arrival, departure, ranges]);

  const complete = Boolean(arrival && departure);
  const nights = complete ? nightsBetween(arrival!, departure!) : 0;

  return (
    <div className="rounded-3xl border border-sand-200 bg-sand-100/60 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label={t("prevMonth")}
          className="rounded-full border border-sand-300 bg-white p-2 text-ink-700 transition hover:bg-sand-100 disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded border border-sand-200 bg-white" />
            {t("legendFree")}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded bg-sand-200" />
            {t("legendBooked")}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded bg-sea-600" />
            {t("legendSelected")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(MAX_MONTHS_AHEAD - 1, o + 1))}
          disabled={offset >= MAX_MONTHS_AHEAD - 1}
          aria-label={t("nextMonth")}
          className="rounded-full border border-sand-300 bg-white p-2 text-ink-700 transition hover:bg-sand-100 disabled:opacity-40"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {months.map((m, i) => (
          <div key={m.key} className={i === 1 ? "hidden md:block" : undefined}>
            <Month
              year={m.year}
              month={m.month}
              today={today}
              isBooked={isBooked}
              locale={locale}
              selection={selection}
              onPick={(iso) => setSelection((s) => nextSelection(s, iso))}
              rangeBlocked={rangeBlocked}
            />
          </div>
        ))}
      </div>

      {/* Auswahl-Leiste — erscheint, sobald ein Tag angeklickt wurde */}
      {arrival ? (
        <div className="mt-8 rounded-2xl border border-sand-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t("yourStay")}
              </p>
              <p className="mt-1.5 text-base font-medium text-ink-900">
                {complete
                  ? t("rangeSummary", {
                      arrival: formatDate(arrival, locale),
                      departure: formatDate(departure!, locale),
                      nights,
                    })
                  : t("pickDeparture", { arrival: formatDate(arrival, locale) })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelection({ arrival: null, departure: null })}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-sm text-ink-500 transition hover:bg-sand-100"
            >
              <X className="size-4" />
              {t("clear")}
            </button>
          </div>

          {complete ? (
            rangeBlocked ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {t("rangeBlocked")}
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <div>
                  <label
                    htmlFor="cal-guests"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500"
                  >
                    {tBooking("guests")}
                  </label>
                  <select
                    id="cal-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-24 rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-base text-ink-900 focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-500/30"
                  >
                    {Array.from({ length: site.apartment.maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <a
                  href={buildLink({ arrival, departure: departure!, guests })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terra-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-terra-700/20 transition hover:bg-terra-600 sm:flex-none"
                >
                  <MessageCircle className="size-5" />
                  {tBooking("submit")}
                </a>
              </div>
            )
          ) : null}
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-ink-500">{t("pickArrival")}</p>
      )}
    </div>
  );
}
