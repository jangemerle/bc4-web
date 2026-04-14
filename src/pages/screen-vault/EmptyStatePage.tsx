import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import EmptyState from '../EmptyState';

export default function EmptyStatePage() {
  return (
    <ScreenVaultFrame
      title="Empty state"
      description="Empty state patterns with illustrations, helpful copy, and clear calls to action to guide users forward."
      standaloneId="empty-state"
    >
      <EmptyState />
    </ScreenVaultFrame>
  );
}
