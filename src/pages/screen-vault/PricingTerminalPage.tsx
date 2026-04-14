import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import PricingTerminal from '../PricingTerminal';

export default function PricingTerminalPage() {
  return (
    <ScreenVaultFrame
      title="Pricing Terminal"
      description="Pricing reimagined as a CLI session. Lines animate in one by one, the cursor blinks, and the founding designer certificate renders as ASCII art. The humour lives in the metadata — CASHIER: THE INTERNET energy, terminal edition."
    >
      <PricingTerminal />
    </ScreenVaultFrame>
  );
}
