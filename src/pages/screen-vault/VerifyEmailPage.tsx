import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import VerifyEmail from '../VerifyEmail';

export default function VerifyEmailPage() {
  return (
    <ScreenVaultFrame
      title="Email verification prompt"
      description="Post-signup confirmation screen asking users to check their inbox. Centered card with icon, heading, and resend action."
      standaloneId="verify-email"
    >
      <VerifyEmail />
    </ScreenVaultFrame>
  );
}
