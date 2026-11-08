# Apartment Dani — Website

Website für die Dachgeschoss-Ferienwohnung in Mastrinka auf Čiovo (Trogir, Kroatien).
4 Sprachen (Deutsch, Englisch, Kroatisch, Polnisch), Verfügbarkeitskalender mit
Booking.com-Sync und Anfrage-Formular.

Inhalte und Fotos stammen aus dem Booking.com-Inserat (Stand Juli 2026).

## Lokal starten

```bash
npm run dev
```

Dann http://localhost:3000 öffnen (leitet automatisch auf /en, /de usw. weiter).

## Wo ändere ich was?

| Was | Wo |
|---|---|
| **Alle Eckdaten** (Name, Telefon, E-Mail, Booking-Link, Adresse, Gästezahl, Bewertung) | `src/lib/site.ts` |
| **Texte in allen Sprachen** | `messages/de.json`, `en.json`, `hr.json`, `pl.json` — bei Änderungen immer alle 4 Dateien gleich halten |
| **Fotos** | Liegen in `public/images/` (aus dem Booking-Inserat übernommen) und sind in `src/lib/site.ts` unter `gallery` eingetragen. Hero-Bild: `public/images/balcony-view.jpg`, eingebunden in `src/components/hero.tsx`. |
| **Videos** | Dateien in `public/videos/` legen und in `src/lib/site.ts` unter `videos` eintragen — die Sektion zeigt sie dann automatisch statt des Platzhalters. |
| **Bewertungen** | Echte Booking.com-Zitate in `messages/*.json` unter `Reviews.items`; Score und Kategorie-Werte in `src/lib/site.ts` unter `rating` — ab und zu mit Booking abgleichen |

## Wie die Buchungs-Anfrage laeuft

Es gibt zwei Wege, und beide enden in einer **vorbefuellten WhatsApp-Nachricht**:

1. **Hero ganz oben** — Anreise, Abreise und Gaestezahl auswaehlen, Button klicken.
2. **Kalender** (Sektion "Verfuegbarkeit") — Anreisetag antippen, dann Abreisetag.
   Belegte Tage sind nicht anklickbar; liegt eine Buchung im gewaehlten Zeitraum,
   erscheint eine Warnung statt des Buttons.

Der Nachrichtentext steht in `messages/*.json` unter `Booking.whatsappMessage`.
Die gemeinsame Logik liegt in `src/components/booking-request.tsx`.

> **Wichtig:** Damit das funktioniert, muss die echte WhatsApp-Nummer in
> `src/lib/site.ts` eingetragen sein (siehe TODO unten).

Das E-Mail-Formular bleibt als Alternative unter "Kontakt" bestehen.

## Bilder

Die Fotos werden von Next.js automatisch als AVIF/WebP in der passenden Groesse
ausgeliefert (Einstellungen in `next.config.ts` unter `images`). Eine Galerie-Kachel
schrumpft so von ~170 KB auf ~13 KB — die Originaldateien muessen nicht angefasst werden.

> **Achtung bei den Dateinamen:** Die Namen stammen aus dem Booking-Export und
> stimmen teilweise nicht mit dem Inhalt ueberein — `bedroom2-view.jpg` zeigt
> z.B. den Balkon und `balcony-panorama.jpg` den Hauseingang. Massgeblich ist
> der `key` in `src/lib/site.ts` bzw. die Bildunterschrift in `messages/*.json`.

**Noch offen vor dem Livegang (in `src/lib/site.ts` als TODO markiert):**

1. **Telefon-/WhatsApp-Nummer** — aktuell ein Platzhalter (`+385 91 000 0000`).
   Solange keine echte Nummer eingetragen ist, führen die WhatsApp-Buttons ins Leere.
2. **Genaue Koordinaten** — die Karte zeigt das Ortszentrum von Mastrinka.
   In Google Maps das Haus lange gedrückt halten, Koordinaten kopieren und
   `lat`/`lng` in `src/lib/site.ts` ersetzen.

## Booking.com-Kalender verbinden

1. Booking.com Extranet → **Kalender** → **Kalender synchronisieren** → **Kalender exportieren** — die `.ics`-URL kopieren.
2. Datei `.env.local` anlegen (siehe `.env.example`) und eintragen:
   `BOOKING_ICAL_URL=https://ical.booking.com/...`
3. Server neu starten — der Kalender zeigt jetzt echte Belegungen (stündlich aktualisiert).

Später bei Airbnb genauso: `AIRBNB_ICAL_URL` setzen, beide Kalender werden kombiniert.

## Anfrage-E-Mails aktivieren

Ohne Konfiguration zeigt das Formular nach dem Absenden Erfolg + WhatsApp-Link
(die Anfrage landet nur im Server-Log). Für echte E-Mails:

1. Kostenloses Konto bei https://resend.com anlegen, API-Key erstellen.
2. In `.env.local`: `RESEND_API_KEY=re_...`

## Deployment (später)

Auf Vercel deployen (kostenloser Plan reicht), dann:
- `NEXT_PUBLIC_SITE_URL=https://deine-domain.com` als Env-Variable setzen (wichtig für Google/SEO)
- `BOOKING_ICAL_URL` und `RESEND_API_KEY` ebenfalls als Env-Variablen hinterlegen
