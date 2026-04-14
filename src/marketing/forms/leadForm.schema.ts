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

// ─── Validační regexy ────────────────────────────────────────────────────────

const ICO_REGEX = /^\d{8}$/;
/**
 * Telefonní číslo — české formáty:
 *   +420 123 456 789, +420123456789, 123 456 789, 123456789
 * Validace je permisivní — backend si pak vyčistí, ale frontend nesmí blokovat
 * platné formáty zadání.
 */
const PHONE_REGEX = /^(\+?\d{1,3}[\s.-]?)?(\d{3}[\s.-]?\d{3}[\s.-]?\d{3}|\d{9})$/;

// ─── Hlavní schéma ───────────────────────────────────────────────────────────

export const leadFormSchema = z.object({
  ico: z
    .string()
    .trim()
    .regex(ICO_REGEX, 'IČ musí mít přesně 8 číslic'),

  email: z
    .string()
    .trim()
    .min(1, 'Vyplňte email')
    .email('Email nemá platný formát')
    .max(254, 'Email je příliš dlouhý'),

  phone: z
    .string()
    .trim()
    .min(1, 'Vyplňte telefon')
    .regex(PHONE_REGEX, 'Telefon nemá platný formát (např. +420 123 456 789)'),

  teamSize: z
    .number({ error: 'Vyplňte počet lidí' })
    .int('Počet musí být celé číslo')
    .min(1, 'Alespoň 1 osoba')
    .max(10000, 'Maximum 10 000 osob — větší týmy řešíme přes obchod'),

  gdprConsent: z.literal(true, {
    error: 'Pro zpracování poptávky potřebujeme váš souhlas',
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
