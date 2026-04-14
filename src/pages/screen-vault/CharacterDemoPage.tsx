/**
 * CharacterDemoPage — Screen Vault page for the Character Demo.
 * Shows the Pulse dashboard with the character switcher floating panel.
 */

import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import CharacterDemo from '../CharacterDemo';
import { CharacterSwitcher } from '../../characters';

export default function CharacterDemoPage() {
  return (
    <ScreenVaultFrame
      title="Character Demo"
      description="Same components, different personality. Toggle between characters to see how Kvalt's token system transforms a SaaS dashboard — colors, radius, shadows, and typography all change instantly."
    >
      <div className="w-full h-full relative">
        <CharacterDemo />
        <CharacterSwitcher />
      </div>
    </ScreenVaultFrame>
  );
}
