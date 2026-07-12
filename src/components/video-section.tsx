import { useTranslations } from "next-intl";
import { Clapperboard } from "lucide-react";
import { Section } from "./section";
import { site } from "@/lib/site";

export function VideoSection() {
  const t = useTranslations("Video");

  return (
    <Section id="video" eyebrow={t("eyebrow")} title={t("title")}>
      {site.videos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-sand-300 bg-sand-100 px-6 py-16 text-center">
          <span className="rounded-full bg-white p-4 shadow-sm">
            <Clapperboard className="size-8 text-sea-600" />
          </span>
          <p className="max-w-md text-ink-500">{t("placeholder")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {site.videos.map((video) => (
            <video
              key={video.src}
              controls
              preload="metadata"
              className="w-full rounded-2xl border border-sand-200 bg-ink-900"
            >
              <source src={video.src} />
            </video>
          ))}
        </div>
      )}
    </Section>
  );
}
