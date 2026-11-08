"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Section } from "./section";
import { site } from "@/lib/site";

export function Gallery() {
  const t = useTranslations("Gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = site.gallery;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  return (
    <Section id="gallery" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`group relative overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-sea-500 ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <span className={`block ${i === 0 ? "aspect-square md:aspect-[4/3]" : "aspect-[4/3]"}`} />
            <Image
              src={img.src}
              alt={t(`captions.${img.key}`)}
              fill
              sizes={
                i === 0
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 50vw, 33vw"
              }
              // Kacheln brauchen keine volle Qualitaet - spart Datenmenge
              quality={60}
              // Die ersten Kacheln sofort, der Rest erst beim Scrollen
              loading={i < 4 ? "eager" : "lazy"}
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent px-3 pb-2 pt-8 text-left text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
              {t(`captions.${img.key}`)}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(`captions.${images[openIndex].key}`)}
          className="fixed inset-0 z-50 flex flex-col bg-ink-900/95 p-4"
          onClick={close}
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="size-6" />
            </button>
          </div>
          <div
            className="relative m-auto w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={images[openIndex].src}
                alt={t(`captions.${images[openIndex].key}`)}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                quality={85}
                loading="eager"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-sand-100">
              {t(`captions.${images[openIndex].key}`)} · {openIndex + 1}/
              {images.length}
            </p>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("previous")}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink-900/60 p-2 text-white hover:bg-ink-900"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("next")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink-900/60 p-2 text-white hover:bg-ink-900"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
