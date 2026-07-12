"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BookedRange } from "@/lib/availability";

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
  todayIso,
  isBooked,
  locale,
}: {
  year: number;
  month: number;
  todayIso: string;
  isBooked: (iso: string) => boolean;
  locale: string;
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
          const past = iso < todayIso;
          const booked = isBooked(iso);
          const today = iso === todayIso;
          return (
            <div
              key={iso}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                past
                  ? "text-sand-300"
                  : booked
                    ? "bg-sand-200 text-ink-500 line-through"
                    : "border border-sand-200 bg-white font-medium text-ink-900"
              } ${today ? "ring-2 ring-sea-500" : ""}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BookingCalendar({ ranges }: { ranges: BookedRange[] }) {
  const t = useTranslations("Availability");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);

  const now = new Date();
  const todayIso = isoDate(now.getFullYear(), now.getMonth(), now.getDate());
  const isBooked = (iso: string) =>
    ranges.some((r) => r.start <= iso && iso < r.end);

  const months = [offset, offset + 1].map((o) => {
    const d = new Date(now.getFullYear(), now.getMonth() + o, 1);
    return { year: d.getFullYear(), month: d.getMonth(), key: o };
  });

  return (
    <div className="rounded-3xl border border-sand-200 bg-sand-100/60 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label={t("prevMonth")}
          className="rounded-full border border-sand-300 bg-white p-2 text-ink-700 transition hover:bg-sand-100 disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-5 text-sm">
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded border border-sand-200 bg-white" />
            {t("legendFree")}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded bg-sand-200" />
            {t("legendBooked")}
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
        <Month
          {...months[0]}
          todayIso={todayIso}
          isBooked={isBooked}
          locale={locale}
        />
        <div className="hidden md:block">
          <Month
            {...months[1]}
            todayIso={todayIso}
            isBooked={isBooked}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
