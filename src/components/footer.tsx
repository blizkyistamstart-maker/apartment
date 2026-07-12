import { useLocale, useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { bookingComUrlForLocale, site, whatsappLink } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-sea-900 pb-24 pt-16 text-sand-100 md:pb-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-sand-100/70">
            {t("tagline")}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase tracking-wider text-sand-100/60">
            {t("contact")}
          </p>
          <a
            href={`mailto:${site.contact.email}`}
            className="flex items-center gap-2 hover:text-white"
          >
            <Mail className="size-4" /> {site.contact.email}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white"
          >
            <Phone className="size-4" /> {site.contact.phone}
          </a>
          <p className="flex items-center gap-2">
            <MapPin className="size-4" /> {site.address.locality},{" "}
            {site.address.city}, {t("countryName")}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase tracking-wider text-sand-100/60">
            {t("alsoOn")}
          </p>
          <a
            href={bookingComUrlForLocale(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-white"
          >
            Booking.com
          </a>
          {site.airbnbUrl ? (
            <a
              href={site.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white"
            >
              Airbnb
            </a>
          ) : null}
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-6 text-xs text-sand-100/50 sm:px-6">
        © {new Date().getFullYear()} {site.name} · {t("rights")}
      </div>
    </footer>
  );
}
