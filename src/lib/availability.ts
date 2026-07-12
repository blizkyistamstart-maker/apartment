/**
 * Belegte Zeiträume aus dem Booking.com iCal-Feed.
 *
 * Booking.com Extranet → Kalender → "Kalender synchronisieren" →
 * "Kalender exportieren" liefert eine .ics-URL. Diese als Env-Variable
 * BOOKING_ICAL_URL setzen (.env.local), dann zeigt der Kalender echte Daten.
 * Ohne die Variable werden Beispiel-Buchungen angezeigt.
 * Airbnb funktioniert später genauso: AIRBNB_ICAL_URL setzen.
 */

export type BookedRange = {
  /** Anreisetag (belegt ab), ISO yyyy-mm-dd */
  start: string;
  /** Abreisetag (wieder frei), ISO yyyy-mm-dd — exklusiv, wie in iCal DTEND */
  end: string;
};

function toIsoDate(icalDate: string): string {
  // "20260710" oder "20260710T140000Z" → "2026-07-10"
  const d = icalDate.slice(0, 8);
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/** Parst VEVENT-Blöcke eines iCal-Feeds zu belegten Zeiträumen. */
export function parseIcal(ics: string): BookedRange[] {
  const ranges: BookedRange[] = [];
  const events = ics.split("BEGIN:VEVENT").slice(1);
  for (const event of events) {
    const start = event.match(/DTSTART[^:]*:(\d{8}(?:T\d{6}Z?)?)/)?.[1];
    const end = event.match(/DTEND[^:]*:(\d{8}(?:T\d{6}Z?)?)/)?.[1];
    if (start && end) {
      ranges.push({ start: toIsoDate(start), end: toIsoDate(end) });
    }
  }
  return ranges.sort((a, b) => a.start.localeCompare(b.start));
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Beispiel-Buchungen, solange keine iCal-URL konfiguriert ist. */
function mockRanges(): BookedRange[] {
  const today = new Date();
  return [
    { start: addDays(today, 4), end: addDays(today, 9) },
    { start: addDays(today, 16), end: addDays(today, 23) },
    { start: addDays(today, 38), end: addDays(today, 45) },
  ];
}

async function fetchFeed(url: string): Promise<BookedRange[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`iCal-Feed antwortete mit ${res.status}`);
  }
  return parseIcal(await res.text());
}

export async function getBookedRanges(): Promise<{
  ranges: BookedRange[];
  isMock: boolean;
}> {
  const urls = [process.env.BOOKING_ICAL_URL, process.env.AIRBNB_ICAL_URL]
    .filter((u): u is string => Boolean(u));

  if (urls.length === 0) {
    return { ranges: mockRanges(), isMock: true };
  }

  try {
    const feeds = await Promise.all(urls.map(fetchFeed));
    return { ranges: feeds.flat(), isMock: false };
  } catch (error) {
    console.error("iCal-Sync fehlgeschlagen:", error);
    // Lieber keinen Kalender-Ausfall: leere Belegung statt Fehler
    return { ranges: [], isMock: false };
  }
}
