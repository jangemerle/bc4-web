/**
 * /api/leads — POST endpoint pro poptávkový formulář.
 *
 * 📍 Cílová lokace: api/leads.ts (Vercel Function)
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install zod
 *    (volitelně) npm install @upstash/redis @upstash/ratelimit  pro production rate limiting
 *
 * 🔧 Vercel environment variables k nastavit:
 *    NOTIFICATION_EMAIL          — kam jdou interně leady (např. obchod@bc4cloud.cz)
 *    SLACK_WEBHOOK_URL           — Slack/Teams webhook pro real-time notifikaci (volitelné)
 *    UPSTASH_REDIS_REST_URL      — pro rate limiting
 *    UPSTASH_REDIS_REST_TOKEN    — pro rate limiting
 *    BC4_CRM_API_URL             — endpoint pro lookup stávajících zákazníků (TODO: dohoda s IT BC)
 *    BC4_CRM_API_KEY             — autentizace do CRM
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { leadFormSchema, type LeadFormData } from '../src/marketing/forms/leadForm.schema';

interface LeadResult {
  ok: boolean;
  leadId?: string;
  error?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' } satisfies LeadResult);
    return;
  }

  // ─── 1. Validace zod schématem ──────────────────────────────────────────
  const parseResult = leadFormSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      ok: false,
      error: parseResult.error.issues[0]?.message ?? 'Validation failed',
    } satisfies LeadResult);
    return;
  }
  const data = parseResult.data;

  // ─── 2. Honeypot check ──────────────────────────────────────────────────
  if (data.honeypot && data.honeypot.length > 0) {
    // Tichý "success" pro robota, ale nic neuložíme
    res.status(200).json({ ok: true, leadId: 'honeypot' } satisfies LeadResult);
    return;
  }

  // ─── 3. Rate limiting ───────────────────────────────────────────────────
  // TODO: napojit Upstash Redis ratelimit
  // Pro MVP spoléháme na Vercel default limity + idempotency hash

  // ─── 4. ARES re-check (server-side, source of truth) ─────────────────────
  const aresOk = await checkAres(data.ico);
  if (!aresOk) {
    // Neblokujeme — možná nové IČ. Logujeme.
    console.warn(`Lead with non-ARES IČ: ${data.ico}`);
  }

  // ─── 5. Existing customer check ─────────────────────────────────────────
  // TODO: napojit BC4 CRM API
  // const isExisting = await checkExistingCustomer(data.ico);
  // Pokud existuje, nebudeme blokovat (může být upsell), ale označíme v notifikaci

  // ─── 6. Save the lead ──────────────────────────────────────────────────
  // MVP: odeslat email + Slack notifikaci, žádná DB
  // Fáze 2: persist do BC4 CRM přes API
  const leadId = generateLeadId(data);
  await Promise.all([
    sendEmailNotification(data, leadId),
    sendSlackNotification(data, leadId),
  ]);

  // ─── 7. Response ────────────────────────────────────────────────────────
  res.status(200).json({ ok: true, leadId } satisfies LeadResult);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function checkAres(ico: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      { signal: AbortSignal.timeout(5000) },
    );
    return res.ok;
  } catch {
    return false;
  }
}

function generateLeadId(data: LeadFormData): string {
  // Idempotency: hash payloadu + 60s bucket → druhý identický submit do 60s vrátí stejné ID
  const bucket = Math.floor(Date.now() / 60000);
  const fingerprint = `${data.ico}-${data.email}-${bucket}`;
  // Jednoduchý hash; pro produkci raději crypto.subtle.digest
  return `lead_${Buffer.from(fingerprint).toString('base64url').slice(0, 16)}`;
}

async function sendEmailNotification(data: LeadFormData, leadId: string): Promise<void> {
  const recipient = process.env.NOTIFICATION_EMAIL;
  if (!recipient) {
    console.warn('NOTIFICATION_EMAIL not set, skipping email notification');
    return;
  }

  // TODO: implement real email sending — Resend, Postmark, SendGrid
  // Pro MVP fake log:
  console.log(`[Lead] ${leadId} → ${recipient}`, {
    ico: data.ico,
    email: data.email,
    phone: data.phone,
    teamSize: data.teamSize,
    source: data.source,
    utm: data.utm,
  });
}

async function sendSlackNotification(data: LeadFormData, leadId: string): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const text = [
    `📥 Nový lead ${leadId}`,
    `IČ: ${data.ico}`,
    `Email: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Tým: ${data.teamSize} osob`,
    `Source: ${data.source ?? 'unknown'}`,
  ].join('\n');

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error('Slack notification failed', err);
  }
}
