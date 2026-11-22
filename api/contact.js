import { createHash } from "node:crypto";

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

function reply(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
}

function parseBody(body) {
  if (typeof body === "string") return JSON.parse(body);
  return body && typeof body === "object" ? body : {};
}

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
}

async function consumeRateLimit(ip) {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) throw new Error("Rate limiter is not configured.");

  const key = `contact:${createHash("sha256").update(ip).digest("hex")}`;
  const response = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, RATE_WINDOW_SECONDS],
    ]),
  });
  if (!response.ok) throw new Error("Rate limiter request failed.");
  const results = await response.json();
  const count = Number(results?.[0]?.result);
  if (!Number.isFinite(count)) throw new Error("Rate limiter returned an invalid result.");
  return count;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return reply(response, 405, { error: "Method not allowed." });
  }

  const allowedOrigins = (process.env.CONTACT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origin = request.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return reply(response, 403, { error: "This form cannot be used from this website." });
  }

  const required = [
    "CONTACT_TO_EMAIL",
    "CONTACT_FROM_EMAIL",
    "RESEND_API_KEY",
    "TURNSTILE_SECRET_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ];
  if (required.some((name) => !process.env[name])) {
    return reply(response, 503, { error: "The contact form is temporarily unavailable." });
  }

  const clientIp = getClientIp(request);
  if (!clientIp) return reply(response, 503, { error: "The contact form is temporarily unavailable." });

  let body;
  try {
    body = parseBody(request.body);
  } catch {
    return reply(response, 400, { error: "Invalid request." });
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return reply(response, 200, { ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || message.length < 10 || message.length > 4000 || !token) {
    return reply(response, 400, { error: "Check the form fields and try again." });
  }

  try {
    const count = await consumeRateLimit(clientIp);
    if (count > RATE_LIMIT) {
      return reply(response, 429, { error: "Too many messages. Please try again later." });
    }

    const originHosts = new Set(allowedOrigins.map((value) => new URL(value).hostname));
    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: clientIp,
      }),
    });
    const verification = await turnstileResponse.json();
    if (!turnstileResponse.ok || !verification.success || !originHosts.has(verification.hostname)) {
      return reply(response, 400, { error: "The security check expired. Please try again." });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nReply email: ${email}\n\n${message}`,
      }),
    });
    if (!emailResponse.ok) return reply(response, 502, { error: "Could not send your message. Please try again later." });

    return reply(response, 200, { ok: true });
  } catch {
    return reply(response, 503, { error: "The contact form is temporarily unavailable." });
  }
}