import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import ModalsDemo from '../ModalsDemo';

export default function ModalsPage() {
  return (
    <ScreenVaultFrame
      title="Dialog patterns in context"
      description="Real-world modal examples: settings panels, confirmation dialogs, and creation flows with proper focus management."
      standaloneId="modal-examples"
      frameHeight={900}
    >
      <ModalsDemo />
    </ScreenVaultFrame>
  );
}
