import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import Signup from '../Signup';

export default function SignupPage() {
  return (
    <ScreenVaultFrame
      title="Account creation flow"
      description="Multi-step registration with social sign-in, input validation, password strength indicator, and progressive disclosure."
      standaloneId="signup"
      frameHeight={900}
    >
      <Signup />
    </ScreenVaultFrame>
  );
}
