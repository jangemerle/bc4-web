/**
 * CharacterDemo — A realistic SaaS dashboard that demonstrates character switching.
 * This is the Phase 3 "Same App, Different Character" demo.
 *
 * Scenario: "Pulse" — a team analytics dashboard.
 * Uses: Button, Badge, Table, Tabs, Input, Select, Toggle, UserAvatar, Chip, Modal
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3, Users, TrendingUp, Clock, Plus,
  Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Settings, Bell, Search,
  Home, FileText, MessageSquare, Zap, Calendar,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Table, type ColumnDef } from '../components/Table';
import { Tabs, Tab } from '../components/Tabs';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { UserAvatar } from '../components/UserAvatar';
import { Chip } from '../components/Chip';
import { spring } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Demo Data ─────────────────────────────────────────────────────────────────

interface TeamMember extends Record<string, unknown> {
  id: number;
  name: string;
  initials: string;
  role: string;
  tasks: number;
  completed: number;
  streak: number;
  status: 'active' | 'away' | 'offline';
  trend: 'up' | 'down' | 'flat';
}

const teamData: TeamMember[] = [
  { id: 1, name: 'Elena Voss', initials: 'EV', role: 'Lead Designer', tasks: 24, completed: 21, streak: 12, status: 'active', trend: 'up' },
  { id: 2, name: 'Marcus Chen', initials: 'MC', role: 'Frontend Engineer', tasks: 18, completed: 15, streak: 8, status: 'active', trend: 'up' },
  { id: 3, name: 'Sofia Andrade', initials: 'SA', role: 'Product Manager', tasks: 31, completed: 27, streak: 15, status: 'away', trend: 'up' },
  { id: 4, name: 'James Park', initials: 'JP', role: 'Backend Engineer', tasks: 22, completed: 14, streak: 3, status: 'active', trend: 'down' },
  { id: 5, name: 'Aisha Rahman', initials: 'AR', role: 'QA Engineer', tasks: 16, completed: 16, streak: 20, status: 'active', trend: 'up' },
  { id: 6, name: 'Tom Hartley', initials: 'TH', role: 'DevOps', tasks: 12, completed: 10, streak: 6, status: 'offline', trend: 'flat' },
  { id: 7, name: 'Yuki Tanaka', initials: 'YT', role: 'Designer', tasks: 19, completed: 17, streak: 9, status: 'active', trend: 'up' },
];

const stats = [
  { label: 'Active Tasks', value: '142', change: '+12%', trend: 'up' as const, icon: BarChart3 },
  { label: 'Team Members', value: '24', change: '+2', trend: 'up' as const, icon: Users },
  { label: 'Completion Rate', value: '87%', change: '+5%', trend: 'up' as const, icon: TrendingUp },
  { label: 'Avg. Cycle Time', value: '3.2d', change: '-0.4d', trend: 'up' as const, icon: Clock },
];

// ─── Table Columns ──────────────────────────────────────────────────────────

const columns: ColumnDef<TeamMember>[] = [
  {
    key: 'name',
    header: 'Member',
    sortable: true,
    render: (_val, row) => (
      <div className="flex items-center gap-3">
        <UserAvatar initials={row.initials} size="sm" />
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>
            {row.name}
          </span>
          <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {row.role}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (_val, row) => {
      const colors: Record<string, { bg: string; text: string; label: string }> = {
        active: { bg: 'var(--color-success-1)', text: 'var(--color-on-success)', label: 'Active' },
        away: { bg: 'var(--color-warning-1)', text: 'var(--color-on-warning)', label: 'Away' },
        offline: { bg: 'var(--color-surface-4)', text: 'var(--color-on-surface-subtle-1)', label: 'Offline' },
      };
      const c = colors[row.status];
      return (
        <span
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium px-2 py-0.5 rounded-xl"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: row.status === 'active' ? 'var(--color-on-success)' : 'currentColor' }}
          />
          {c.label}
        </span>
      );
    },
  },
  {
    key: 'tasks',
    header: 'Tasks',
    sortable: true,
    align: 'right',
    render: (_val, row) => (
      <span className="font-sans text-sm tabular-nums" style={{ color: 'var(--color-on-surface)' }}>
        {row.completed}/{row.tasks}
      </span>
    ),
  },
  {
    key: 'streak',
    header: 'Streak',
    sortable: true,
    align: 'right',
    render: (_val, row) => (
      <div className="flex items-center justify-end gap-1.5">
        <span className="font-sans text-sm font-semibold tabular-nums" style={{ color: 'var(--color-on-surface)' }}>
          {row.streak}d
        </span>
        {row.trend === 'up' && <ArrowUpRight size={14} style={{ color: 'var(--color-success-1)' }} />}
        {row.trend === 'down' && <ArrowDownRight size={14} style={{ color: 'var(--color-danger-1)' }} />}
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: 40,
    render: () => (
      <Button variant="link" size="xs" iconOnly={MoreHorizontal} aria-label="Actions" />
    ),
  },
];

// ─── Sidebar Nav Item ──────────────────────────────────────────────────────

function SidebarItem({ icon: IconComponent, label, active = false, badge }: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-m cursor-pointer font-sans text-sm font-medium"
      style={{
        backgroundColor: active ? 'var(--color-surface-3)' : 'transparent',
        color: active ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-1)',
      }}
    >
      <IconComponent size={18} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && <Badge variant="accent">{badge}</Badge>}
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, change, trend, icon: IconComponent }: typeof stats[number]) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col gap-3 p-5 rounded-lg"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        boxShadow: shadows['small-1'],
      }}
      whileHover={reducedMotion ? undefined : { y: -2, boxShadow: shadows['small-2'] }}
      transition={spring.snappy}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          {label}
        </span>
        <div className="p-1.5 rounded-m" style={{ backgroundColor: 'var(--color-surface-3)' }}>
          <IconComponent size={16} style={{ color: 'var(--color-on-surface-subtle-1)' }} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
          {value}
        </span>
        <span
          className="font-sans text-xs font-medium mb-1"
          style={{ color: trend === 'up' ? 'var(--color-success-1)' : 'var(--color-danger-1)' }}
        >
          {change}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Demo ──────────────────────────────────────────────────────────────

export default function CharacterDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  return (
    <div className="w-full h-full flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* ── App Sidebar ─────────────────────────────────── */}
      <div
        className="w-[220px] shrink-0 flex flex-col p-4 gap-1 border-r"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          borderColor: 'var(--color-surface-4)',
        }}
      >
        {/* App Logo */}
        <div className="flex items-center gap-2 px-3 py-3 mb-4">
          <div className="w-7 h-7 rounded-m flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-1)' }}>
            <Zap size={16} style={{ color: 'var(--color-on-primary)' }} />
          </div>
          <span className="font-display text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
            Pulse
          </span>
        </div>

        <SidebarItem icon={Home} label="Dashboard" active />
        <SidebarItem icon={BarChart3} label="Analytics" />
        <SidebarItem icon={Users} label="Team" />
        <SidebarItem icon={FileText} label="Reports" />
        <SidebarItem icon={MessageSquare} label="Messages" badge={3} />
        <SidebarItem icon={Calendar} label="Schedule" />

        <div className="flex-1" />

        <SidebarItem icon={Settings} label="Settings" />
      </div>

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--color-surface-4)' }}
        >
          <div className="flex items-center gap-4">
            <h1 className="font-display text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
              Dashboard
            </h1>
            <Chip size="sm">This week</Chip>
          </div>

          <div className="flex items-center gap-3">
            <Input
              size="sm"
              placeholder="Search..."
              iconLeft={Search}
              style={{ width: 200 }}
            />
            <Button variant="elevated" size="sm" iconOnly={Bell} aria-label="Notifications" />
            <UserAvatar initials="JG" size="sm" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Table Section */}
          <div
            className="flex flex-col gap-4 p-5 rounded-lg flex-1"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              boxShadow: shadows['small-1'],
            }}
          >
            {/* Table Header */}
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                <Tab value="overview">Overview</Tab>
                <Tab value="performance">Performance</Tab>
                <Tab value="activity">Activity</Tab>
              </Tabs>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Toggle
                    size="sm"
                    checked={liveUpdates}
                    onChange={(e) => setLiveUpdates(e.target.checked)}
                  />
                  <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                    Live
                  </span>
                </div>
                <Select
                  size="sm"
                  placeholder="Period"
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  options={[
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                  ]}
                />
                <Button variant="secondary" size="sm" iconLeft={Filter}>Filter</Button>
                <Button variant="primary" size="sm" iconLeft={Plus}>Add Member</Button>
              </div>
            </div>

            {/* Data Table */}
            <Table
              columns={columns}
              data={teamData}
              selectable
              stickyHeader
              horizontalLines
            />
          </div>
        </div>
      </div>
    </div>
  );
}
