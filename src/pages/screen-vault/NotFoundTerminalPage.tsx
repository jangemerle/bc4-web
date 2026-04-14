import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import NotFoundTerminal from '../NotFoundTerminal';

export default function NotFoundTerminalPage() {
  return (
    <ScreenVaultFrame
      title="404 Terminal"
      description="A terminal-style 404 page. Lines animate in, the stack trace reveals itself, and the cursor blinks. Press Enter after the animation to unlock a hidden Space Invaders game — arrows to move, spacebar to shoot. The page was inside you all along."
    >
      <NotFoundTerminal />
    </ScreenVaultFrame>
  );
}
