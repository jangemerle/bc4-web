import {
  LogIn,
  KeyRound,
  UserPlus,
  MailCheck,
  Inbox,
  Layers,
  CheckSquare,
  Search,
  Sparkles,
  CreditCard,
  Receipt,
  Terminal,
  AlertTriangle,
  BarChart3,
  Globe,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HubCard } from '../components/HubCard';
import { HubIcon } from '../components/HubIcon';
import { PageHero } from '../layouts/PageHero';

interface ScreenVaultHubPageProps {
  onNavigate?: (id: string) => void;
}

const ITEMS: { id: string; title: string; subtitle: string; icon: LucideIcon }[] = [
  { id: 'login',            title: 'Login',              subtitle: '// email, password, remember me. no "Welcome back!"',              icon: LogIn },
  { id: 'sign-in',          title: 'Sign In',            subtitle: '// animated mesh background. social + email. one card, no clutter', icon: KeyRound },
  { id: 'signup',           title: 'Signup',             subtitle: '// registration that respects your time',                          icon: UserPlus },
  { id: 'verify-email',     title: 'Email Confirmation', subtitle: '// OTP input with countdown. resend earns its button',            icon: MailCheck },
  { id: 'empty-state',      title: 'Empty State',        subtitle: '// nothing here yet — and that\'s handled gracefully',            icon: Inbox },
  { id: 'modal-examples',   title: 'Modals',             subtitle: '// confirmation, forms, fullscreen. escape always works',         icon: Layers },
  { id: 'todo-list',        title: 'Todo List',          subtitle: '// CRUD, drag, done states. the classics, polished',              icon: CheckSquare },
  { id: 'global-search',    title: 'Global Search',      subtitle: '// Cmd+K. results ranked. keyboard all the way down',             icon: Search },
  { id: 'character-demo',   title: 'Character Demo',     subtitle: '// swap the entire personality. live, in the browser',             icon: Sparkles },
  { id: 'pricing',          title: 'Pricing',            subtitle: '// founding designer certificate. no subscription trap',           icon: CreditCard },
  { id: 'pricing-receipt',  title: 'Pricing Receipt',    subtitle: '// receipt format. dry humour included at no extra cost',          icon: Receipt },
  { id: 'pricing-terminal', title: 'Pricing Terminal',   subtitle: '// stack trace pricing. because why not',                         icon: Terminal },
  { id: '404-terminal',     title: '404 Terminal',       subtitle: '// error page as home turf. easter egg inside',                    icon: AlertTriangle },
  { id: 'dashboard',        title: 'Dashboard',          subtitle: '// 14 card types, charts, dark/light. the real test',              icon: BarChart3 },
  { id: 'landing-v1',       title: 'Landing v1',         subtitle: '// fish audio bones. the one that started it',                      icon: Globe },
  { id: 'landing-v2',       title: 'Landing v2',         subtitle: '// same structure, rewritten copy. voice found',                    icon: Globe },
  { id: 'landing-v3',       title: 'Landing v3',         subtitle: '// ground-up. numbered narrative. the real pitch',                  icon: Globe },
].sort((a, b) => a.title.localeCompare(b.title));

export default function ScreenVaultHubPage({ onNavigate }: ScreenVaultHubPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Screen Vault"
        subtitle="Full screens, production-ready."
        description="Complete UI screens built with Kvalt components. Dark mode, responsive, and ready to copy."
      />
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((item, i) => (
          <HubCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            delay={i * 0.03}
            onClick={() => onNavigate?.(item.id)}
            illustration={(hovered) => <HubIcon icon={item.icon} hovered={hovered} />}
          />
        ))}
      </div>
    </section>
  );
}
