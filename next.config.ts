import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Es liegt eine weitere package-lock.json in C:\Users\spaji — Projektwurzel explizit setzen
  turbopack: { root: __dirname },

  images: {
    /**
     * Moderne Formate: AVIF zuerst (kleiner), WebP als Fallback.
     * Spart gegenüber dem Original-JPEG grob 40–70 % Datenmenge.
     */
    formats: ["image/avif", "image/webp"],
    /**
     * Ab Next 16 muss die Qualitäts-Liste explizit erlaubt werden.
     * 60 = Galerie-Kacheln, 75 = Standard, 85 = Hero/Lightbox.
     */
    qualities: [60, 75, 85],
    /** Optimierte Bilder 31 Tage cachen — die Fotos ändern sich praktisch nie. */
    minimumCacheTTL: 2678400,
  },
};

export default withNextIntl(nextConfig);
