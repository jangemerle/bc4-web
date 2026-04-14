import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import GlobalSearch from '../GlobalSearch';

export default function GlobalSearchPage() {
  return (
    <ScreenVaultFrame
      title="Global Search"
      description="A command-palette style overlay for searching contracts, people, and activity across The Quill & Ledger. Type to search, ↑↓ to navigate, Esc to clear."
      standaloneId="global-search"
      frameHeight={580}
    >
      <GlobalSearch />
    </ScreenVaultFrame>
  );
}
