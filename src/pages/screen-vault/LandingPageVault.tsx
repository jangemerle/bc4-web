import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import LandingPage from '../LandingPage';

export default function LandingPageVault() {
  return (
    <ScreenVaultFrame
      title="Landing page (v1)"
      description="Fish Audio-inspired marketing page. The original structure with generic SaaS copy."
      standaloneId="landing"
    >
      <div className="w-full min-h-screen self-start">
        <LandingPage />
      </div>
    </ScreenVaultFrame>
  );
}
