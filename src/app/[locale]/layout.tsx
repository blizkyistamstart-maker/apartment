import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

/** Namespaces, die von Client-Komponenten benutzt werden (siehe "use client"). */
const CLIENT_NAMESPACES = [
  "Availability",
  "Booking",
  "Gallery",
  "Form",
  "Header",
  "StickyCta",
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`]),
      ),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale,
      siteName: site.name,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  /**
   * Nur die Namespaces an den Browser schicken, die Client-Komponenten
   * wirklich brauchen - die restlichen Texte rendert der Server.
   * Spart rund zwei Drittel der uebertragenen Textmenge.
   */
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [
      ns,
      messages[ns],
    ]),
  );

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
