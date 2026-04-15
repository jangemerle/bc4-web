/**
 * Lead form — zod schéma.
 *
 * 📍 Cílová lokace: src/marketing/forms/leadForm.schema.ts
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install zod
 *
 * Schéma sdílené mezi frontend (react-hook-form) a backend (api/leads.ts).
 * Source of truth pro validační pravidla — stejné chyby na obou stranách.
 */

import { z } from 'zod';

// ─── Hlavní schéma ───────────────────────────────────────────────────────────
//
// Validujeme POUZE "není prázdné" — formát (IČ regex, email RFC, telefon) na
// frontendu neřešíme. Důvod: nechceme uživateli bránit v odeslání kvůli
// čárce navíc nebo jinému formátu telefonu. Backend data vyčistí před
// uložením do CRM, ARES lookup napoví, zda IČ dává smysl.

export const leadFormSchema = z.object({
  ico: z
    .string()
    .trim()
    .min(1, 'Vyplňte IČ'),

  email: z
    .string()
    .trim()
    .min(1, 'Vyplňte email'),

  phone: z
    .string()
    .trim()
    .min(1, 'Vyplňte telefon'),

  teamSize: z
    .number({ error: 'Vyplňte počet lidí' })
    .min(1, 'Vyplňte počet lidí'),

  gdprConsent: z.literal(true, {
    error: 'Potřebujeme váš souhlas',
  }),

  // Honeypot — prázdné pole skryté pro lidi, robot vyplní → spam
  honeypot: z.string().max(0, 'spam').optional(),

  // Tracking metadata — frontend doplní automaticky, backend nevaliduje obsah
  source: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// ─── ARES response schema (backend → frontend) ──────────────────────────────

export const aresResponseSchema = z.object({
  found: z.boolean(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  error: z.string().optional(),
});

export type AresResponse = z.infer<typeof aresResponseSchema>;

// ─── Lead submission response (backend → frontend) ──────────────────────────

export const leadSubmissionResponseSchema = z.object({
  ok: z.boolean(),
  leadId: z.string().optional(),
  error: z.string().optional(),
});

export type LeadSubmissionResponse = z.infer<typeof leadSubmissionResponseSchema>;
