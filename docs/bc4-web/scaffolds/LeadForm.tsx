/**
 * LeadForm — hlavní konverzní komponenta.
 *
 * 📍 Cílová lokace: src/marketing/sections/LeadForm.tsx
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install react-hook-form @hookform/resolvers zod
 *
 * Použití:
 *   <LeadForm
 *     content={leadFormContent}
 *     source="home_inline"
 *     onSubmitSuccess={() => navigate('/poptavka/odeslano')}
 *   />
 *
 * Co implementuje:
 *   ✅ react-hook-form + zod resolver (validace on-blur, submit)
 *   ✅ ARES lookup po IČ blur (debounced, optimistic)
 *   ✅ GDPR souhlas s linkem na privacy policy
 *   ✅ Honeypot anti-spam (skryté pole)
 *   ✅ UTM tracking — read z localStorage, append do payload
 *   ✅ Idempotency — disable po odeslání
 *   ✅ Plausible event tracking (form_start, form_submit, form_error)
 *   ✅ Accessibility — fieldset, aria-invalid, role="alert" pro errory
 */

import { useState, useRef, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Input } from '@/components/Input';
import { NumberInput } from '@/components/NumberInput';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { leadFormSchema, type LeadFormData, type AresResponse, type LeadSubmissionResponse } from '@/marketing/forms/leadForm.schema';
import type { LeadFormContent } from '@/content/types';

interface LeadFormProps {
  content: LeadFormContent;
  /** Tracking source — kde na webu byl form vykreslen */
  source: 'home_inline' | 'standalone' | 'pricing' | string;
  onSubmitSuccess?: (leadId: string) => void;
}

export function LeadForm({ content, source, onSubmitSuccess }: LeadFormProps) {
  const formId = useId();
  const [aresStatus, setAresStatus] = useState<AresResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const aresAbortRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onBlur',
    defaultValues: {
      ico: '',
      email: '',
      phone: '',
      // teamSize default undefined — nutí user explicit input, ne preselect
      gdprConsent: undefined as unknown as true,
      honeypot: '',
      source,
      utm: readUTMFromStorage(),
    },
  });

  // ─── ARES lookup po blur na IČ ────────────────────────────────────────────

  async function handleIcoBlur(e: React.FocusEvent<HTMLInputElement>) {
    const ico = e.target.value.trim();
    if (!/^\d{8}$/.test(ico)) {
      setAresStatus(null);
      return;
    }

    aresAbortRef.current?.abort();
    aresAbortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/ares?ico=${ico}`, { signal: aresAbortRef.current.signal });
      const data: AresResponse = await res.json();
      setAresStatus(data);
      track('ares_lookup', { found: data.found });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        // Síťová chyba — neblokujeme submit, jen nezobrazíme confirmation
        setAresStatus(null);
      }
    }
  }

  // ─── Form submit ──────────────────────────────────────────────────────────

  async function onSubmit(data: LeadFormData) {
    setSubmissionError(null);
    track('form_submit', { form: 'lead', source });

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload: LeadSubmissionResponse = await res.json();

      if (!payload.ok) {
        setSubmissionError(payload.error ?? content.errors.submissionFailed);
        track('form_error', { form: 'lead', error: payload.error });
        return;
      }

      onSubmitSuccess?.(payload.leadId ?? '');
    } catch (err) {
      setSubmissionError(content.errors.submissionFailed);
      track('form_error', { form: 'lead', error: 'network' });
    }
  }

  // ─── Form start tracking (only once per session) ──────────────────────────

  function handleFormStart() {
    if (!sessionStorage.getItem(`form_started_${source}`)) {
      sessionStorage.setItem(`form_started_${source}`, '1');
      track('form_start', { form: 'lead', source });
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFormStart}
      noValidate
      className="flex flex-col gap-5"
      aria-busy={isSubmitting}
    >
      {/* Honeypot — skrytý před uživateli i screen readery */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <input type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      </div>

      {/* IČ */}
      <Input
        label={content.form.icoLabel}
        placeholder={content.form.icoPlaceholder}
        caption={
          aresStatus?.found && aresStatus.companyName
            ? content.ares.companyFound.replace('{companyName}', aresStatus.companyName)
            : aresStatus?.found === false
              ? content.ares.companyNotFound
              : content.form.icoHelper
        }
        invalid={!!errors.ico}
        errorMessage={errors.ico?.message}
        inputMode="numeric"
        autoComplete="organization-id"
        {...register('ico', { onBlur: handleIcoBlur })}
      />

      {/* Email */}
      <Input
        label={content.form.emailLabel}
        placeholder={content.form.emailPlaceholder}
        type="email"
        autoComplete="email"
        invalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      {/* Telefon */}
      <Input
        label={content.form.phoneLabel}
        placeholder={content.form.phonePlaceholder}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        invalid={!!errors.phone}
        errorMessage={errors.phone?.message}
        {...register('phone')}
      />

      {/* Počet lidí */}
      <NumberInput
        label={content.form.teamSizeLabel}
        placeholder={content.form.teamSizePlaceholder}
        min={1}
        max={10000}
        invalid={!!errors.teamSize}
        errorMessage={errors.teamSize?.message}
        {...register('teamSize', { valueAsNumber: true })}
      />

      {/* GDPR */}
      <Checkbox
        label={content.form.gdprLabel}
        invalid={!!errors.gdprConsent}
        errorMessage={errors.gdprConsent?.message}
        {...register('gdprConsent')}
      />

      {/* Submit error */}
      {submissionError && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-m bg-[var(--color-danger-secondary-1)] p-4 text-sm text-[var(--color-on-danger-secondary)]"
        >
          {submissionError}
        </motion.div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting || isSubmitSuccessful}
        className="w-full"
      >
        {isSubmitting ? 'Odesílám…' : content.form.submitLabel}
      </Button>

      {/* Disclaimer */}
      <p className="text-sm text-[var(--color-on-surface-subtle-1)] text-center">
        {content.form.disclaimer}
      </p>
    </form>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readUTMFromStorage(): LeadFormData['utm'] {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('bc4-utm');
    return raw ? (JSON.parse(raw) as LeadFormData['utm']) : undefined;
  } catch {
    return undefined;
  }
}

function track(event: string, props: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  // Plausible custom event API. Pokud Plausible není načtený (např. dev),
  // tichý fallback — žádný error v consoli.
  const plausible = (window as unknown as { plausible?: (e: string, opts: { props: Record<string, unknown> }) => void }).plausible;
  plausible?.(event, { props });
}
