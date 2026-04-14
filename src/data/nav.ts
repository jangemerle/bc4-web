/**
 * nav — single source of truth for all DS pages.
 * Imported by DocsLayout (renders the sidebar) and SidebarSearch (search index).
 * Add a new page here → it appears in both the nav and search automatically.
 */

export interface NavItem { id: string; label: string }
export interface NavSection { title: string; items: NavItem[] }

const sortItems = (items: NavItem[]): NavItem[] =>
  [...items].sort((a, b) => a.label.localeCompare(b.label));

export const nav: NavSection[] = [
  {
    title: 'Foundations',
    items: sortItems([
      { id: 'colors',        label: 'Colors' },
      { id: 'typography',    label: 'Typography' },
      { id: 'shadows',       label: 'Shadows' },
      { id: 'border-radius', label: 'Border Radius' },
      { id: 'icons',         label: 'Icons' },
      { id: 'illustrations', label: 'Illustrations' },
      { id: 'characters',    label: 'Characters' },
      { id: 'spaciness',     label: 'Spaciness' },
    ]),
  },
  {
    title: 'Components',
    items: sortItems([
      { id: 'accordion',         label: 'Accordion' },
      { id: 'card',              label: 'Card' },
      { id: 'badge',             label: 'Badge' },
      { id: 'button',            label: 'Button' },
      { id: 'checkbox',          label: 'Checkbox' },
      { id: 'chip',              label: 'Chip' },
      { id: 'content-switcher',  label: 'Content Switcher' },
      { id: 'data-table',        label: 'Data Table' },
      { id: 'date-picker',       label: 'Date Picker' },
      { id: 'dropdown-menu',     label: 'Dropdown Menu' },
      { id: 'glass-surface',     label: 'Glass Surface' },
      { id: 'grid-background',   label: 'Grid Background' },
      { id: 'input',             label: 'Input' },
      { id: 'modal',             label: 'Modal' },
      { id: 'modal-fullscreen',  label: 'Modal Fullscreen' },
      { id: 'number-input',      label: 'Number Input' },
      { id: 'pagination',        label: 'Pagination' },
      { id: 'radio-button',      label: 'Radio Button' },
      { id: 'search-input',      label: 'Search Input' },
      { id: 'select',            label: 'Select' },
      { id: 'link',              label: 'Link' },
      { id: 'loading-indicator', label: 'Loading Indicator' },
      { id: 'skeleton',          label: 'Skeleton' },
      { id: 'tabs',              label: 'Tabs' },
      { id: 'text-area',         label: 'Text Area' },
      { id: 'toggle',            label: 'Toggle' },
      { id: 'toast',             label: 'Toast' },
      { id: 'tooltip',           label: 'Tooltip' },
      { id: 'user-avatar',       label: 'User Avatar' },
    ]),
  },
  {
    title: 'Philosophy',
    items: sortItems([
      { id: 'motion-guidelines', label: 'Motion' },
      { id: 'tone-of-voice',     label: 'Tone of Voice' },
      { id: 'accessibility',     label: 'Accessibility' },
      { id: 'illustration',      label: 'Illustration' },
      { id: 'ux-copywriting',    label: 'UX Copywriting' },
      { id: 'design-principles', label: 'Design Principles' },
    ]),
  },
  {
    title: 'Screen Vault',
    items: sortItems([
      { id: 'empty-state',      label: 'Empty State' },
      { id: 'login',            label: 'Login' },
      { id: 'sign-in',          label: 'Sign In' },
      { id: 'signup',           label: 'Signup' },
      { id: 'verify-email',     label: 'Email confirmation' },
      { id: 'modal-examples',   label: 'Modals' },
      { id: 'todo-list',        label: 'Todo List' },
      { id: 'global-search',    label: 'Global Search' },
      { id: 'character-demo',   label: 'Character Demo' },
      { id: 'pricing',          label: 'Pricing' },
      { id: 'pricing-receipt',  label: 'Pricing Receipt' },
      { id: 'pricing-terminal', label: 'Pricing Terminal' },
      { id: '404-terminal',     label: '404 Terminal' },
      { id: 'dashboard',        label: 'Dashboard' },
      { id: 'landing-v1',       label: 'Landing v1' },
      { id: 'landing-v2',       label: 'Landing v2' },
      { id: 'landing-v3',       label: 'Landing v3' },
    ]),
  },
  {
    title: 'Tools',
    items: sortItems([
      { id: 'workshop-design-exploration', label: 'Design Exploration' },
      { id: 'workshop-characters',         label: 'Characters' },
      { id: 'workshop-figma-to-code',      label: 'Figma to Code' },
      { id: 'workshop-component-forge',    label: 'Component Forge' },
      { id: 'workshop-agents',             label: 'Multi-Agent Pipeline' },
      { id: 'workshop-workspace',          label: 'Workspace' },
      { id: 'workshop-no-widows',          label: 'No Widows' },
      { id: 'workshop-character-from-image', label: 'Character from Image' },
      { id: 'workshop-character-builder',    label: 'Character Builder' },
    ]),
  },
];
