import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import LandingPageV2 from '../LandingPageV2';

export default function LandingPageV2Vault() {
  return (
    <ScreenVaultFrame
      title="Landing page (v2)"
      description="Same structural bones as v1, all content rewritten with Kvalt's voice. Before/After section, specific numbers, philosophy footer."
      standaloneId="landing-v2"
    >
      <div className="w-full min-h-screen self-start">
        <LandingPageV2 />
      </div>
    </ScreenVaultFrame>
  );
}
