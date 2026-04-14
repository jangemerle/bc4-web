import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import PricingReceipt from '../PricingReceipt';

export default function PricingReceiptPage() {
  return (
    <ScreenVaultFrame
      title="Pricing Receipt"
      description="A thermal-receipt styled pricing page. JetBrains Mono drives the utilitarian aesthetic — Inter slips in for the certificate and footnote, adding just enough warmth."
    >
      <PricingReceipt />
    </ScreenVaultFrame>
  );
}
