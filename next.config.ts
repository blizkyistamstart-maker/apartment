import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Es liegt eine weitere package-lock.json in C:\Users\spaji — Projektwurzel explizit setzen
  turbopack: { root: __dirname },
};

export default withNextIntl(nextConfig);
