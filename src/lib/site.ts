/**
 * Zentrale Konfiguration der Unterkunft.
 * ALLE Werte, die du anpassen willst, stehen hier an einer Stelle.
 * Datenstand: Booking.com-Inserat, Juli 2026.
 */
export const site = {
  name: "Apartment Dani",
  /** Öffentliche URL nach dem Deployment (für SEO/hreflang). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    email: "spajic.antonio17@gmail.com",
    /**
     * Antonios Handynummer (deutsche Nummer, Stand November 2026).
     * phone: Anzeigeformat, whatsapp: nur Ziffern ohne "+" und ohne führende 0.
     */
    phone: "+49 177 9654876",
    whatsapp: "491779654876",
  },

  /** Unser Inserat auf Booking.com (Sprachvariante via bookingComUrlForLocale). */
  bookingComUrl: "https://www.booking.com/hotel/hr/apartmentivanka.html",
  /** Airbnb-Link, sobald das Inserat existiert */
  airbnbUrl: "",

  address: {
    street: "Ulica kralja Tomislava",
    /** Ortsteil auf der Insel Čiovo */
    locality: "Mastrinka",
    city: "Trogir",
    postalCode: "21220",
    country: "HR",
    /**
     * Ortszentrum Mastrinka (Čiovo).
     * TODO (Antonio): exakten Pin des Hauses aus Google Maps eintragen
     * (Haus lange gedrückt halten → Koordinaten kopieren).
     */
    lat: 43.5122,
    lng: 16.2831,
  },

  /** Eckdaten laut Booking.com-Inserat */
  apartment: {
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
    sizeSqm: 70,
    floor: 2, // Dachgeschoss / oberster Stock
  },

  /**
   * Bewertung von Booking.com — Stand Juli 2026.
   * Ab und zu mit dem Inserat abgleichen und hier aktualisieren.
   */
  rating: {
    score: 8.2,
    count: 13,
    categories: {
      staff: 8.7,
      facilities: 8.7,
      cleanliness: 8.7,
      comfort: 8.2,
      value: 8.2,
      location: 7.8,
    },
  },

  /**
   * Galerie: eigene Fotos der Wohnung (Aufnahmen Juli 2026, Mastrinka/Čiovo).
   * Reihenfolge = Anzeige-Reihenfolge; Bild 0 ist die große Hero-Kachel.
   * Der `key` verweist auf die Bildunterschrift in messages/*.json (Gallery.captions).
   */
  gallery: [
    // ACHTUNG: Die Dateinamen stammen aus dem Booking-Export und sind teils
    // irrefuehrend (z.B. "bedroom2-view.jpg" zeigt den Balkon). Die `key`s
    // unten beschreiben, was WIRKLICH auf dem Bild zu sehen ist.
    { src: "/images/sunset.jpg", key: "sunset" },
    { src: "/images/bedroom2-view.jpg", key: "balconySea" },
    { src: "/images/sunset-balcony.jpg", key: "sunsetBalcony" },
    { src: "/images/view-bay.jpg", key: "viewBay" },
    { src: "/images/living-room.jpg", key: "living" },
    { src: "/images/hallway-seaview.jpg", key: "livingSofa" },
    { src: "/images/living-open.jpg", key: "livingOpen" },
    { src: "/images/dining.jpg", key: "dining" },
    { src: "/images/dining-table.jpg", key: "diningTable" },
    { src: "/images/kitchen.jpg", key: "kitchen" },
    { src: "/images/kitchen-detail.jpg", key: "kitchenDetail" },
    { src: "/images/bedroom-orange.jpg", key: "bedroomOrange" },
    { src: "/images/bedroom-sunset.jpg", key: "bedroomSunset" },
    { src: "/images/bedroom2-sofa.jpg", key: "bedroom2View" },
    { src: "/images/bathroom.jpg", key: "bathroom" },
    { src: "/images/bathroom-shower.jpg", key: "bathroomShower" },
    { src: "/images/bedroom-seaview.jpg", key: "bathroomWide" },
    { src: "/images/hallway.jpg", key: "hallway" },
    { src: "/images/balcony-panorama.jpg", key: "entrance" },
    { src: "/images/entrance.jpg", key: "hallwayDetail" },
  ] as const,

  /**
   * Videos: Dateien in public/videos/ ablegen und hier eintragen,
   * z.B. { src: "/videos/rundgang.mp4", key: "tour" }.
   * Solange die Liste leer ist, zeigt die Video-Sektion einen Platzhalter.
   */
  videos: [] as { src: string; key: string }[],
} as const;

/** Booking.com-Sprachcodes je Website-Sprache */
const bookingLangByLocale: Record<string, string> = {
  en: "en-gb",
  de: "de",
  hr: "hr",
  pl: "pl",
};

/** Link zum Booking.com-Inserat in der Sprache des Besuchers */
export function bookingComUrlForLocale(locale: string) {
  const lang = bookingLangByLocale[locale];
  return lang ? `${site.bookingComUrl}?lang=${lang}` : site.bookingComUrl;
}

/** WhatsApp-Chat-Link mit optionaler vorbefüllter Nachricht */
export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Formatiert ein ISO-Datum (yyyy-mm-dd) in der Sprache des Besuchers,
 * z.B. "Fr., 10. Juli 2026". Ohne Zeitzonen-Verschiebung (UTC-Mittag).
 */
export function formatDate(iso: string, locale: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** Nächte zwischen zwei ISO-Daten. */
export function nightsBetween(arrival: string, departure: string) {
  const a = Date.parse(`${arrival}T12:00:00Z`);
  const b = Date.parse(`${departure}T12:00:00Z`);
  return Math.max(0, Math.round((b - a) / 86_400_000));
}
