"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { z } from "zod";
import { site, whatsappLink } from "@/lib/site";

const schema = z
  .object({
    name: z.string().trim().min(2, "name"),
    email: z.string().trim().email("email"),
    arrival: z.string().min(1, "arrival"),
    departure: z.string().min(1, "departure"),
    guests: z.coerce.number().int().min(1).max(10),
    message: z.string().trim().max(2000),
  })
  .refine((d) => !d.arrival || !d.departure || d.departure > d.arrival, {
    message: "dates",
    path: ["departure"],
  });

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const inputClass =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-500/30";

export function InquiryForm() {
  const t = useTranslations("Form");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [sent, setSent] = useState<z.infer<typeof schema> | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) {
          // Eigene Kurz-Keys (name/email/dates) → Übersetzung, sonst generisch
          const key = ["name", "email", "arrival", "departure", "dates"].includes(
            issue.message,
          )
            ? issue.message
            : field === "guests"
              ? "guests"
              : "generic";
          fieldErrors[field] = t(`errors.${key}`);
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(parsed.data);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && sent) {
    const summary = t("whatsappSummary", {
      name: sent.name,
      arrival: sent.arrival,
      departure: sent.departure,
      guests: sent.guests,
    });
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-sand-200 bg-white p-8">
        <CheckCircle2 className="size-10 text-green-600" />
        <h3 className="font-display text-2xl text-ink-900">
          {t("successTitle")}
        </h3>
        <p className="leading-relaxed text-ink-500">{t("successBody")}</p>
        <a
          href={whatsappLink(summary)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-sea-600 px-6 py-3 font-semibold text-white transition hover:bg-sea-700"
        >
          <MessageCircle className="size-5" />
          {t("successWhatsapp")}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-sand-200 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("name")}
          </label>
          <input id="name" name="name" autoComplete="name" className={inputClass} placeholder={t("namePlaceholder")} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClass} placeholder="name@email.com" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="arrival" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("arrival")}
          </label>
          <input id="arrival" name="arrival" type="date" className={inputClass} />
          {errors.arrival && <p className="mt-1 text-sm text-red-600">{errors.arrival}</p>}
        </div>
        <div>
          <label htmlFor="departure" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("departure")}
          </label>
          <input id="departure" name="departure" type="date" className={inputClass} />
          {errors.departure && <p className="mt-1 text-sm text-red-600">{errors.departure}</p>}
        </div>
        <div>
          <label htmlFor="guests" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("guests")}
          </label>
          <select id="guests" name="guests" defaultValue="2" className={inputClass}>
            {Array.from({ length: site.apartment.maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t("message")}
          </label>
          <textarea id="message" name="message" rows={4} className={inputClass} placeholder={t("messagePlaceholder")} />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">{t("errors.submit")}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terra-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-terra-700/20 transition hover:bg-terra-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && (
          <Loader2 className="size-5 animate-spin" />
        )}
        {t("submit")}
      </button>
      <p className="mt-3 text-xs text-ink-500">{t("privacyNote")}</p>
    </form>
  );
}
