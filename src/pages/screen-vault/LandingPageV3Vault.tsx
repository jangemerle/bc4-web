import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import LandingPageV3 from '../LandingPageV3';

export default function LandingPageV3Vault() {
  return (
    <ScreenVaultFrame
      title="Landing page (v3)"
      description="Ground-up rebuild. Numbered narrative, character switcher demo, philosophy footer. Based on research across Equals, Tailwind, Cursor, Hey, Notion, ManyChat, Supernova."
      standaloneId="landing-v3"
    >
      <div className="w-full min-h-screen self-start">
        <LandingPageV3 />
      </div>
    </ScreenVaultFrame>
  );
}
