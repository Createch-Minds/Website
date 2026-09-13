import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = "thomas.vankerckhoven@createch-minds.be";
const FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL || "no-reply@createch-minds.be";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

// In-memory per-instance rate limit. Serverless instances are short-lived and
// may scale to multiple copies, so this is a best-effort throttle, not a hard
// guarantee — SendGrid itself is the real backstop against abuse.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

// Off by default. Set HCAPTCHA_SECRET (server) and PUBLIC_HCAPTCHA_SITE_KEY
// (client, see Contact.astro) to turn this on once spam becomes a problem.
async function isHuman(token: string | undefined): Promise<boolean> {
  const secret = import.meta.env.HCAPTCHA_SECRET;
  if (!secret) return true;
  if (!token) return false;

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

interface ContactPayload {
  naam?: string;
  bedrijf?: string;
  email?: string;
  vraag?: string;
  website?: string; // honeypot
  captchaToken?: string;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid-body", 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (body.website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip = clientAddress || "unknown";
  if (isRateLimited(ip)) {
    return jsonError("rate-limited", 429);
  }

  if (!(await isHuman(body.captchaToken))) {
    return jsonError("captcha-failed", 400);
  }

  const naam = (body.naam ?? "").trim();
  const bedrijf = (body.bedrijf ?? "").trim();
  const email = (body.email ?? "").trim();
  const vraag = (body.vraag ?? "").trim();

  if (!naam || !email || !EMAIL_RE.test(email)) {
    return jsonError("invalid-fields", 400);
  }

  const apiKey = import.meta.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not configured");
    return jsonError("server-misconfigured", 500);
  }

  sgMail.setApiKey(apiKey);

  const lines = [
    `Naam: ${naam}`,
    `Bedrijf: ${bedrijf || "-"}`,
    `E-mail: ${email}`,
    "",
    vraag || "(geen bericht)",
  ];

  try {
    await sgMail.send({
      to: TO_EMAIL,
      from: FROM_EMAIL,
      replyTo: email,
      subject: `Aanvraag via createch-minds.be — ${naam}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("SendGrid error", err);
    return jsonError("send-failed", 502);
  }

  // Best-effort autoreply — a failure here shouldn't turn a successful
  // submission into an error for the visitor.
  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      replyTo: TO_EMAIL,
      subject: "Bedankt voor uw bericht — Createch Minds",
      text: `Hallo ${naam},\n\nBedankt voor uw bericht. Ik antwoord binnen twee werkdagen.\n\nMet vriendelijke groeten,\nThomas Vankerckhoven\nCreatech Minds`,
    });
  } catch (err) {
    console.error("SendGrid autoreply error", err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
