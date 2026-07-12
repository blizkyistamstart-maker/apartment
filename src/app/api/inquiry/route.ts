import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/lib/site";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).max(10),
  message: z.string().trim().max(2000).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const inquiry = parsed.data;

  // E-Mail-Versand über Resend (https://resend.com, kostenloser Tarif).
  // Erst aktiv, wenn RESEND_API_KEY in .env.local gesetzt ist.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Neue Anfrage (kein RESEND_API_KEY, nicht versendet):", inquiry);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${site.name} <onboarding@resend.dev>`,
      to: [site.contact.email],
      reply_to: inquiry.email,
      subject: `Anfrage ${inquiry.arrival} – ${inquiry.departure} (${inquiry.guests} Gäste) von ${inquiry.name}`,
      text: [
        `Name: ${inquiry.name}`,
        `E-Mail: ${inquiry.email}`,
        `Anreise: ${inquiry.arrival}`,
        `Abreise: ${inquiry.departure}`,
        `Gäste: ${inquiry.guests}`,
        "",
        inquiry.message || "(keine Nachricht)",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend-Fehler:", res.status, await res.text());
    return NextResponse.json({ ok: true, delivered: false });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
