import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Highlights } from "@/components/highlights";
import { Apartment } from "@/components/apartment";
import { Gallery } from "@/components/gallery";
// Video-Sektion vorerst ausgeblendet — reaktivieren, sobald ein Rundgang-Video existiert.
// import { VideoSection } from "@/components/video-section";
import { AvailabilitySection } from "@/components/availability-section";
import { LocationSection } from "@/components/location-section";
import { Reviews } from "@/components/reviews";
import { Faq } from "@/components/faq";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { StickyCta } from "@/components/sticky-cta";
import { site } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: site.name,
    description: t("description"),
    url: `${site.url}/${locale}`,
    sameAs: [site.bookingComUrl],
    image: site.gallery.map((img) => `${site.url}${img.src}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: `${site.address.locality}, ${site.address.city}`,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: site.apartment.sizeSqm,
      unitCode: "MTK",
    },
    occupancy: {
      "@type": "QuantitativeValue",
      value: site.apartment.maxGuests,
    },
    numberOfBedrooms: site.apartment.bedrooms,
    numberOfBathroomsTotal: site.apartment.bathrooms,
    checkinTime: "15:00",
    checkoutTime: "10:00",
    petsAllowed: false,
    smokingAllowed: false,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.score,
      bestRating: 10,
      ratingCount: site.rating.count,
    },
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Apartment />
        <Gallery />
        {/* Video-Sektion vorerst ausgeblendet — reaktivieren, sobald ein Rundgang-Video existiert */}
        {/* <VideoSection /> */}
        <AvailabilitySection />
        <LocationSection />
        <Reviews />
        <Faq />
        <ContactSection />
      </main>
      <Footer />
      <StickyCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
