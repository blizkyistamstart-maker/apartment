"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function StickyCta() {
  const t = useTranslations("StickyCta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="flex gap-3">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex items-center justify-center rounded-full border border-sea-600 p-3 text-sea-600"
        >
          <MessageCircle className="size-6" />
        </a>
        <a
          href="#contact"
          className="flex-1 rounded-full bg-terra-500 py-3 text-center text-base font-semibold text-white"
        >
          {t("cta")}
        </a>
      </div>
    </div>
  );
}
