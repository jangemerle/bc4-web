import { useState, useEffect } from 'react';
import { DocsLayout } from './layouts/DocsLayout';
import { CharacterProvider } from './characters';
import { Toaster } from './components/Toast';
import { safeGetRaw, safeSetRaw, safeRemove } from './utils/safeStorage';
import { themeModeSchema, themeLegacyKey } from './utils/storageSchemas';
import type { ThemeMode } from './utils/storageSchemas';

// ─── Pages ───────────────────────────────────────────────────────────────────

import HelloPage from './pages/HelloPage';
import FoundationsHubPage from './pages/FoundationsHubPage';
import ComponentsHubPage from './pages/ComponentsHubPage';
import PhilosophyHubPage from './pages/PhilosophyHubPage';
import ScreenVaultHubPage from './pages/ScreenVaultHubPage';
import WorkshopHubPage from './pages/WorkshopHubPage';

// Workshop
import DesignExplorationPage from './pages/workshop/DesignExplorationPage';
import CharactersWorkshopPage from './pages/workshop/CharactersWorkshopPage';
import FigmaToCodePage from './pages/workshop/FigmaToCodePage';
import ComponentForgePage from './pages/workshop/ComponentForgePage';
import AgentsPipelinePage from './pages/workshop/AgentsPipelinePage';
import MosaicWorkspacePage from './pages/workshop/MosaicWorkspacePage';
import NoWidowsPage from './pages/workshop/NoWidowsPage';
import CharacterFromImagePage from './pages/workshop/CharacterFromImagePage';
import CharacterBuilderPage from './pages/workshop/CharacterBuilderPage';
const MosaicWorkspaceStandalone = () => <MosaicWorkspacePage standalone />;

// Foundations
import TypographyPage from './pages/foundations/TypographyPage';
import ColorsPage from './pages/foundations/ColorsPage';
import ShadowsPage from './pages/foundations/ShadowsPage';
import BorderRadiusPage from './pages/foundations/BorderRadiusPage';
import IconsPageNew from './pages/foundations/IconsPage';
import IllustrationsPage from './pages/foundations/IllustrationsPage';
import FoundationsShowcasePage from './pages/foundations/FoundationsShowcasePage';
import FoundationsGalleryPage from './pages/foundations/FoundationsGalleryPage';
import FoundationsStandalone from './pages/foundations/FoundationsStandalone';
import FoundationsCrossroad from './pages/foundations/FoundationsCrossroad';
import FoundationsCanvas from './pages/foundations/FoundationsCanvas';
import CharactersPage from './pages/foundations/CharactersPage';
import SpacinessPage from './pages/foundations/SpacinessPage';

// Components
import AccordionPage from './pages/components/AccordionPage';
import BadgePage from './pages/components/BadgePage';
import ButtonPage from './pages/components/ButtonPage';
import InputPage from './pages/components/InputPage';
import SearchInputPage from './pages/components/SearchInputPage';
import TextAreaPage from './pages/components/TextAreaPage';
import NumberInputPage from './pages/components/NumberInputPage';
import SelectPage from './pages/components/SelectPage';
import ChipPage from './pages/components/ChipPage';
import ContentSwitcherPage from './pages/components/ContentSwitcherPage';
import UserAvatarPage from './pages/components/UserAvatarPage';
import CardPage from './pages/components/CardPage';
import ModalPage from './pages/components/ModalPage';
import CheckboxPage from './pages/components/CheckboxPage';
import TogglePage from './pages/components/TogglePage';
import RadioButtonPage from './pages/components/RadioButtonPage';
import TabsPage from './pages/components/TabsPage';
import DropdownMenuPage from './pages/components/DropdownMenuPage';
import DataTablePage from './pages/components/DataTablePage';
import DatePickerPage from './pages/components/DatePickerPage';
import PaginationPage from './pages/components/PaginationPage';
import SkeletonPage from './pages/components/SkeletonPage';
import LoadingIndicatorPage from './pages/components/LoadingIndicatorPage';
import ModalFullscreenPage from './pages/components/ModalFullscreenPage';
import ToastPage from './pages/components/ToastPage';
import TooltipPage from './pages/components/TooltipPage';
import LinkPage from './pages/components/LinkPage';
import GlassSurfacePage from './pages/components/GlassSurfacePage';
import GridBackgroundPage from './pages/components/GridBackgroundPage';
// Philosophy
import MotionPage from './pages/philosophy/MotionPage';
import ToneOfVoicePage from './pages/philosophy/ToneOfVoicePage';
import AccessibilityPage from './pages/philosophy/AccessibilityPage';
import IllustrationPage from './pages/philosophy/IllustrationPage';
import UXCopywritingPage from './pages/philosophy/UXCopywritingPage';
import DesignPrinciplesPage from './pages/philosophy/DesignPrinciplesPage';
import PricingPage from './pages/philosophy/PricingPage';

// Screen Vault
import LoginPageVault from './pages/screen-vault/LoginPage';
import SignupPageVault from './pages/screen-vault/SignupPage';
import SignInPageVault from './pages/screen-vault/SignInPage';
import EmptyStatePageVault from './pages/screen-vault/EmptyStatePage';
import ModalsPageVault from './pages/screen-vault/ModalsPage';
import VerifyEmailPageVault from './pages/screen-vault/VerifyEmailPage';
import TodoListPageVault from './pages/screen-vault/TodoListPage';
import GlobalSearchPageVault from './pages/screen-vault/GlobalSearchPage';
import CharacterDemoPageVault from './pages/screen-vault/CharacterDemoPage';
import PricingReceiptPageVault from './pages/screen-vault/PricingReceiptPage';
import PricingTerminalPageVault from './pages/screen-vault/PricingTerminalPage';
import NotFoundTerminalPageVault from './pages/screen-vault/NotFoundTerminalPage';
import DashboardPage from './pages/screen-vault/DashboardPage';
import LandingPageVault from './pages/screen-vault/LandingPageVault';
import LandingPageV2Vault from './pages/screen-vault/LandingPageV2Vault';
import LandingPageV3Vault from './pages/screen-vault/LandingPageV3Vault';

// ─── Standalone pages (for ?standalone=<pageId>) ─────────────────────────────

import EmptyState from './pages/EmptyState';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import TodoList from './pages/TodoList';
import GlobalSearch from './pages/GlobalSearch';
import LandingPage from './pages/LandingPage';
import LandingPageV2 from './pages/LandingPageV2';
import LandingPageV3 from './pages/LandingPageV3';
import SignIn from './pages/SignIn';

const standalonePages: Record<string, React.ComponentType> = {
  'empty-state': EmptyState,
  'login': Login,
  'sign-in': SignIn,
  'signup': Signup,
  'verify-email': VerifyEmail,
  'todo-list': TodoList,
  'global-search': GlobalSearch,
  'foundations': FoundationsStandalone,
  'foundations-crossroad': FoundationsCrossroad,
  'foundations-canvas': FoundationsCanvas,
  'foundations-gallery': FoundationsGalleryPage,
  'landing': LandingPage,
  'landing-v2': LandingPageV2,
  'landing-v3': LandingPageV3,
  'workshop-workspace': MosaicWorkspaceStandalone,
};

// ─── Page router ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pages: Record<string, React.ComponentType<any>> = {
  'hello': HelloPage,

  // Section hubs
  'foundations':  FoundationsHubPage,
  'components':   ComponentsHubPage,
  'philosophy':   PhilosophyHubPage,
  'screen-vault': ScreenVaultHubPage,
  'workshop':     WorkshopHubPage,

  // Foundations
  'foundations-showcase': FoundationsShowcasePage,
  'foundations-gallery': FoundationsGalleryPage,
  'typography': TypographyPage,
  'colors': ColorsPage,
  'shadows': ShadowsPage,
  'border-radius': BorderRadiusPage,
  'icons': IconsPageNew,
  'illustrations': IllustrationsPage,
  'characters': CharactersPage,
  'spaciness': SpacinessPage,

  // Components
  'accordion': AccordionPage,
  'card': CardPage,
  'badge': BadgePage,
  'button': ButtonPage,
  'input': InputPage,
  'search-input': SearchInputPage,
  'text-area': TextAreaPage,
  'number-input': NumberInputPage,
  'select': SelectPage,
  'chip': ChipPage,
  'content-switcher': ContentSwitcherPage,
  'user-avatar': UserAvatarPage,
  'modal': ModalPage,
  'modal-fullscreen': ModalFullscreenPage,
  'checkbox': CheckboxPage,
  'toggle': TogglePage,
  'toggle-button': ButtonPage,  // redirects to Button page (Toggle section)
  'radio-button': RadioButtonPage,
  'tabs': TabsPage,
  'dropdown-menu': DropdownMenuPage,
  'data-table': DataTablePage,
  'date-picker': DatePickerPage,
  'pagination': PaginationPage,
  'skeleton': SkeletonPage,
  'loading-indicator': LoadingIndicatorPage,
  'toast': ToastPage,
  'tooltip': TooltipPage,
  'link': LinkPage,
  'glass-surface': GlassSurfacePage,
  'grid-background': GridBackgroundPage,
  'split-button': ButtonPage,  // redirects to Button page (Split section)
  // Philosophy
  'motion-guidelines': MotionPage,
  'tone-of-voice': ToneOfVoicePage,
  'accessibility': AccessibilityPage,
  'illustration': IllustrationPage,
  'ux-copywriting': UXCopywritingPage,
  'design-principles': DesignPrinciplesPage,
  'pricing': PricingPage,

  // Screen Vault
  'login': LoginPageVault,
  'signup': SignupPageVault,
  'sign-in': SignInPageVault,
  'empty-state': EmptyStatePageVault,
  'verify-email': VerifyEmailPageVault,
  'modal-examples': ModalsPageVault,
  'todo-list': TodoListPageVault,
  'global-search': GlobalSearchPageVault,
  'character-demo': CharacterDemoPageVault,
  'pricing-receipt': PricingReceiptPageVault,
  'pricing-terminal': PricingTerminalPageVault,
  '404-terminal': NotFoundTerminalPageVault,
  'dashboard': DashboardPage,
  'landing-v1': LandingPageVault,
  'landing-v2': LandingPageV2Vault,
  'landing-v3': LandingPageV3Vault,

  // Workshop
  'workshop-design-exploration': DesignExplorationPage,
  'workshop-characters': CharactersWorkshopPage,
  'workshop-figma-to-code': FigmaToCodePage,
  'workshop-component-forge': ComponentForgePage,
  'workshop-agents': AgentsPipelinePage,
  'workshop-workspace': MosaicWorkspacePage,
  'workshop-no-widows': NoWidowsPage,
  'workshop-character-from-image': CharacterFromImagePage,
  'workshop-character-builder': CharacterBuilderPage,
};

// ─── App ─────────────────────────────────────────────────────────────────────

function resolveSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Validated read — returns 'system' if stored value is corrupt
    const stored = safeGetRaw(themeModeSchema);
    if (stored !== 'system') return stored;
    // Migrate from old boolean key (one-time)
    try {
      const legacy = localStorage.getItem(themeLegacyKey);
      if (legacy !== null) {
        safeRemove(themeLegacyKey);
        const migrated: ThemeMode = legacy === 'true' ? 'dark' : 'light';
        safeSetRaw(themeModeSchema, migrated);
        return migrated;
      }
    } catch { /* migration is best-effort */ }
    return 'system';
  });

  // Derive effective dark from mode
  const dark = mode === 'dark' || (mode === 'system' && resolveSystemDark());

  // Sync dark class on <html> whenever dark changes (including system changes)
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => forceRender(n => n + 1);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const [activeId, setActiveIdRaw] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'hello';
  });

  useEffect(() => {
    requestAnimationFrame(() => document.body.classList.add('enable-transitions'));
  }, []);

  // Sync with browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) setActiveIdRaw(page);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Standalone mode: render just the page, no nav
  const standaloneId = new URLSearchParams(window.location.search).get('standalone');
  const StandalonePage = standaloneId ? standalonePages[standaloneId] : null;
  if (StandalonePage) return (
    <CharacterProvider>
      <div className="h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <StandalonePage />
      </div>
    </CharacterProvider>
  );

  const setActiveId = (id: string) => {
    setActiveIdRaw(id);
    const url = new URL(window.location.href);
    url.searchParams.set('page', id);
    url.hash = '';
    window.history.pushState(null, '', url.pathname + url.search);
  };

  const setThemeMode = (next: ThemeMode) => {
    setMode(next);
    safeSetRaw(themeModeSchema, next);
  };

  const Page = pages[activeId] || HelloPage;

  return (
    <CharacterProvider>
      <DocsLayout activeId={activeId} onNavigate={setActiveId} themeMode={mode} onThemeModeChange={setThemeMode}>
        <Page onNavigate={setActiveId} />
      </DocsLayout>
      <Toaster position="bottom-right" />
    </CharacterProvider>
  );
}
