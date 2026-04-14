/**
 * Pricing Receipt
 *
 * Screen Vault — a thermal-receipt styled pricing page.
 * Typography: JetBrains Mono dominates (70%) for the utilitarian receipt feel.
 * Inter appears (30%) for the certificate body and footnote — a deliberate
 * warmth injection into an otherwise mechanical layout.
 */

import { Button } from '../components/Button';
import { shadows } from '../tokens/shadows';

export default function PricingReceipt() {
  return (
    <div
      className="flex min-h-screen items-center justify-center py-16 px-6"
      style={{ backgroundColor: 'transparent' }}
    >
      <div
        className="w-full max-w-[380px] flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          boxShadow: shadows['small-1'],
          padding: '40px 32px',
        }}
      >
        {/* ── Header ── */}
        <div className="flex flex-col gap-1 pb-6 w-full">
          <span
            className="font-mono font-bold tracking-[8px] text-[32px] leading-none"
            style={{ color: 'var(--color-on-surface)' }}
          >
            KVALT
          </span>
          <span
            className="font-mono font-medium text-[11px] tracking-[3px] uppercase"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            PRICING RECEIPT
          </span>
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Meta ── */}
        <div className="flex flex-col gap-[2px] py-4 w-full">
          <span
            className="font-mono text-[11px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            DATE: 2026.03.31&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#00001
          </span>
          <span
            className="font-mono text-[11px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            CASHIER: THE INTERNET
          </span>
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Line items ── */}
        <div className="flex flex-col gap-3 py-5 w-full">
          <LineItem label="Design system access" value="FREE" />
          <LineItem label="Founding status" value="FREE" />
          <LineItem label="Asterisks" value="0" />
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Total ── */}
        <div
          className="flex items-center justify-between py-4 w-full"
        >
          <span
            className="font-mono font-bold text-[14px] tracking-[2px]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            TOTAL
          </span>
          <span
            className="font-mono font-bold text-[14px]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            $0.00
          </span>
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Thank you ── */}
        <div className="flex flex-col items-center gap-1 py-7 w-full">
          <span
            className="font-mono font-medium text-[13px] tracking-[3px] text-center"
            style={{ color: 'var(--color-on-surface)' }}
          >
            THANK YOU FOR BEING EARLY
          </span>
          <div
            className="w-10 h-px"
            style={{ backgroundColor: 'var(--color-on-surface)' }}
          />
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Certificate of recognition ── */}
        <div
          className="flex flex-col items-center gap-2 my-5 py-5 px-4 w-full"
          style={{
            border: '1px solid var(--color-surface-4)',
          }}
        >
          <span
            className="font-mono font-medium text-[10px] tracking-[2px] text-center uppercase"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            CERTIFICATE OF RECOGNITION
          </span>
          <div
            className="w-6 h-px"
            style={{ backgroundColor: 'var(--color-surface-5)' }}
          />
          {/* Inter entry point — warmth injection */}
          <span
            className="font-sans font-light text-base text-center"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Founding Designer
          </span>
          <span
            className="font-sans text-sm italic text-center"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            arrived before it was obvious
          </span>
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── CTAs ── */}
        <div className="flex flex-col gap-[10px] py-5 w-full">
          <Button variant="primary" size="lg" className="w-full justify-center">
            Join Discord
          </Button>
          <Button variant="elevated" size="lg" className="w-full justify-center">
            Browse the System
          </Button>
        </div>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Footnote — Inter, small, centered ── */}
        <p
          className="font-sans text-xs text-center leading-relaxed mt-4"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          * That's the one asterisk.
          <br />
          It leads to nothing.
        </p>
      </div>
    </div>
  );
}

/* ── Internal components ─────────────────────────────────────────────────── */

function Divider() {
  return (
    <div
      className="w-full font-mono text-[12px] text-center select-none"
      style={{ color: 'var(--color-surface-5)' }}
    >
      - - - - - - - - - - - - - - - - - - - - - -
    </div>
  );
}

function LineItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between w-full">
      <span
        className="font-mono text-[12px]"
        style={{ color: 'var(--color-on-surface)' }}
      >
        {label}
      </span>
      <span
        className="font-mono font-medium text-[12px]"
        style={{ color: 'var(--color-on-surface)' }}
      >
        {value}
      </span>
    </div>
  );
}
