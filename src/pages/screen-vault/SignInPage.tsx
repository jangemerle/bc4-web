import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import SignIn from '../SignIn';

export default function SignInPage() {
  return (
    <ScreenVaultFrame
      title="Sign In"
      description="Auth landing with an animated WebGL mesh-gradient background. Pastel sage/lavender/cream palette, slow drifting blobs, subtle film grain, pauses when offscreen."
      standaloneId="sign-in"
      contentStyle={{ backgroundColor: 'transparent' }}
    >
      <SignIn />
    </ScreenVaultFrame>
  );
}
