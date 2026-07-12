import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Section } from "./section";
import { InquiryForm } from "./inquiry-form";
import { site, whatsappLink } from "@/lib/site";

export function ContactSection() {
  const t = useTranslations("Contact");

  return (
    <Section
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      className="bg-sand-100"
    >
      <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <a
            href={whatsappLink(t("whatsappGreeting"))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-5 transition hover:border-sea-500"
          >
            <span className="rounded-full bg-sea-50 p-3">
              <MessageCircle className="size-6 text-sea-600" />
            </span>
            <span>
              <span className="block font-semibold text-ink-900">
                WhatsApp
              </span>
              <span className="text-sm text-ink-500">{t("whatsappHint")}</span>
            </span>
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-5 transition hover:border-sea-500"
          >
            <span className="rounded-full bg-sea-50 p-3">
              <Mail className="size-6 text-sea-600" />
            </span>
            <span>
              <span className="block font-semibold text-ink-900">
                {t("emailLabel")}
              </span>
              <span className="text-sm text-ink-500">
                {site.contact.email}
              </span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-5">
            <span className="rounded-full bg-sea-50 p-3">
              <Phone className="size-6 text-sea-600" />
            </span>
            <span>
              <span className="block font-semibold text-ink-900">
                {t("phoneLabel")}
              </span>
              <span className="text-sm text-ink-500">
                {site.contact.phone}
              </span>
            </span>
          </div>
          <p className="px-1 text-sm leading-relaxed text-ink-500">
            {t("directNote")}
          </p>
        </div>
        <InquiryForm />
      </div>
    </Section>
  );
}
