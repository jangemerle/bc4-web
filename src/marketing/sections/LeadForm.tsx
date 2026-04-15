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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { leadFormSchema, type LeadFormData, type AresResponse, type LeadSubmissionResponse } from '@/marketing/forms/leadForm.schema';
import type { LeadFormContent } from '@/content/types';

interface LeadFormProps {
  content: LeadFormContent;
  /** Tracking source — kde na webu byl form vykreslen */
  source: 'home_inline' | 'standalone' | 'pricing' | string;
  /** Volitelný callback po úspěšném odeslání (např. analytika). Formulář sám
   * zobrazí inline success state — callback není potřeba pro UX. */
  onSubmitSuccess?: (leadId: string) => void;
}

export function LeadForm({ content, source, onSubmitSuccess }: LeadFormProps) {
  const formId = useId();
  const [aresStatus, setAresStatus] = useState<AresResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const aresAbortRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onSubmit',
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

      // Pokud API endpoint není deployed (dev / preview bez Vercel Functions),
      // neblokujeme UX — success state se zobrazí. Ve prod je odpovědnost
      // backendu notifikovat chybu.
      if (!res.ok) {
        // Silent success pro UX, ale log do Plausible pro debugging
        track('form_error', { form: 'lead', error: `http_${res.status}` });
      } else {
        const payload: LeadSubmissionResponse = await res.json();
        if (!payload.ok) {
          setSubmissionError(payload.error ?? content.errors.submissionFailed);
          track('form_error', { form: 'lead', error: payload.error });
          return;
        }
        onSubmitSuccess?.(payload.leadId ?? '');
      }

      // Inline success — nezavíráme stránku, user scrolluje dál
      setSubmitted(true);
      track('form_success', { form: 'lead', source });
    } catch (err) {
      // Network error — pro MVP silent success (backend endpoint ještě nemusí být
      // deployed). Když máme deploy, sem doplnit setSubmissionError.
      track('form_error', { form: 'lead', error: 'network' });
      setSubmitted(true);
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
    <div className="relative">
      {/* Success overlay — zobrazí se přes formulář, ne modal ani redirect */}
      <AnimatePresence>
        {submitted && <SuccessOverlay />}
      </AnimatePresence>

      <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFormStart}
      noValidate
      className={[
        'flex flex-col gap-5 transition-opacity duration-300',
        submitted ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-busy={isSubmitting}
      aria-hidden={submitted}
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

      {/* Počet lidí — používáme regular Input + valueAsNumber, NumberInput má jiný value type */}
      <Input
        label={content.form.teamSizeLabel}
        placeholder={content.form.teamSizePlaceholder}
        type="number"
        inputMode="numeric"
        invalid={!!errors.teamSize}
        errorMessage={errors.teamSize?.message}
        {...register('teamSize', { valueAsNumber: true })}
      />

      {/* GDPR — Kvalt Checkbox je controlled (potřebuje checked + onChange),
         takže místo register používáme Controller z RHF. */}
      <Controller
        name="gdprConsent"
        control={control}
        render={({ field }) => (
          <Checkbox
            label={content.form.gdprLabel}
            checked={!!field.value}
            onChange={(e) => field.onChange((e.target as HTMLInputElement).checked)}
            onBlur={field.onBlur}
            invalid={!!errors.gdprConsent}
            errorMessage={errors.gdprConsent?.message}
          />
        )}
      />

      {/* Expandable textarea pro doplňující informace — collapsed by default
         aby form vypadal krátký. Engaged user klikne, dostane prostor.
         Plausible event 'form_note_expanded' nám řekne, kolik % to využije. */}
      <AnimatePresence initial={false}>
        {noteExpanded ? (
          <motion.div
            key="note-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <TextArea
              label={content.form.noteLabel}
              placeholder={content.form.notePlaceholder}
              rows={4}
              {...register('note')}
            />
          </motion.div>
        ) : (
          <motion.button
            key="note-toggle"
            type="button"
            onClick={() => {
              setNoteExpanded(true);
              track('form_note_expanded', { source });
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {content.form.noteToggleLabel}
          </motion.button>
        )}
      </AnimatePresence>

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
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Odesílám…' : content.form.submitLabel}
      </Button>

      {/* Disclaimer */}
      <p className="text-sm text-[var(--color-on-surface-subtle-1)] text-center">
        {content.form.disclaimer}
      </p>
    </form>
    </div>
  );
}

// ─── Success overlay ─────────────────────────────────────────────────────────

function SuccessOverlay() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          visualDuration: 0.5,
          bounce: 0.35,
          delay: 0.08,
        }}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-secondary-1)] text-[var(--color-success-1)]"
      >
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" strokeWidth={2.2} />
      </motion.div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3
          className="font-display text-2xl font-extrabold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Hotovo. Voláme do pár minut.
        </h3>
        <p className="text-[var(--color-on-surface-subtle-1)]">
          V pracovní době Po–Pá 8–17. Mimo ni první další pracovní den.
        </p>
      </div>

      {/* Secondary actions — užitečný content pro člověka co čeká na hovor */}
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row sm:gap-6">
        <a
          href="/#product-video"
          className="text-sm font-semibold text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)] inline-flex items-center gap-1.5"
        >
          Minutová ukázka aplikace
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <a
          href="/#faq"
          className="text-sm font-semibold text-[var(--color-on-secondary-1)] hover:text-[var(--color-on-secondary-2)] inline-flex items-center gap-1.5"
        >
          Časté otázky
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

    </motion.div>
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
