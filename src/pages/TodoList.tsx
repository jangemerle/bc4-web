/**
 * TodoList — Timeline/Chronological layout (Sketch proposal #7)
 *
 * Editorial F-pattern with tasks grouped by date along a vertical timeline.
 * Single centered column (max-w-2xl), generous whitespace, calm density.
 *
 * Kvalt components used: Button, Input, Checkbox, Chip, Badge, SearchInput
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, MoreHorizontal, Star, Flag, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { Badge } from '../components/Badge';
import { SearchInput } from '../components/SearchInput';
import { spring, duration } from '../tokens/motion';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
  tags: string[];
  priority?: 'high' | 'medium' | 'low';
  dueTime?: string;
}

interface TimelineGroup {
  label: string;
  sublabel?: string;
  todos: Todo[];
}

// ─── Sample data ────────────────────────────────────────────────────────────

const initialGroups: TimelineGroup[] = [
  {
    label: 'Today',
    sublabel: 'Monday, March 17',
    todos: [
      {
        id: '1',
        text: 'Review design tokens for color system',
        completed: false,
        starred: true,
        tags: ['Design'],
        priority: 'high',
        dueTime: '10:00 AM',
      },
      {
        id: '2',
        text: 'Update component documentation for Button variants',
        completed: false,
        starred: false,
        tags: ['Docs', 'Components'],
        priority: 'medium',
      },
      {
        id: '3',
        text: 'Fix checkbox animation on reduced motion',
        completed: true,
        starred: false,
        tags: ['Bug'],
      },
      {
        id: '4',
        text: 'Sync with Jan on sprint priorities',
        completed: false,
        starred: false,
        tags: ['Meeting'],
        dueTime: '2:30 PM',
      },
    ],
  },
  {
    label: 'Tomorrow',
    sublabel: 'Tuesday, March 18',
    todos: [
      {
        id: '5',
        text: 'Build skeleton loading states for Data Table',
        completed: false,
        starred: false,
        tags: ['Components'],
        priority: 'medium',
      },
      {
        id: '6',
        text: 'Write motion guidelines for page transitions',
        completed: false,
        starred: true,
        tags: ['Philosophy', 'Motion'],
      },
    ],
  },
  {
    label: 'Wednesday',
    sublabel: 'March 19',
    todos: [
      {
        id: '7',
        text: 'Prepare Screen Vault demo for stakeholder review',
        completed: false,
        starred: false,
        tags: ['Presentation'],
        priority: 'high',
        dueTime: '11:00 AM',
      },
      {
        id: '8',
        text: 'Audit color contrast ratios for WCAG AA',
        completed: false,
        starred: false,
        tags: ['Accessibility'],
      },
      {
        id: '9',
        text: 'Update illustrations catalog with new assets',
        completed: false,
        starred: false,
        tags: ['Design'],
      },
    ],
  },
];

// ─── Priority indicator ─────────────────────────────────────────────────────

function PriorityDot({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors: Record<string, string> = {
    high: 'var(--color-danger-1)',
    medium: 'var(--color-warning-1, #e8a500)',
    low: 'var(--color-on-surface-subtle-2)',
  };
  return (
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: colors[priority],
        flexShrink: 0,
      }}
      title={`${priority} priority`}
    />
  );
}

// ─── Single todo item ───────────────────────────────────────────────────────

function TodoItem({
  todo,
  onToggle,
  onToggleStar,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onToggleStar: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: duration.fast } }}
      transition={spring.default}
      className="group flex items-start gap-3 py-2.5 px-3 -mx-3 rounded-xl transition-colors duration-150"
      style={{
        backgroundColor: hovered ? 'var(--color-surface-1)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <div className="pt-0.5">
        <Checkbox
          size="sm"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          hovered={hovered}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Task text */}
        <span
          className="font-sans text-md font-medium leading-[1.5] tracking-[0.14px]"
          style={{
            color: todo.completed
              ? 'var(--color-on-surface-subtle-2)'
              : 'var(--color-on-surface)',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        >
          {todo.text}
        </span>

        {/* Meta row: tags + due time */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {todo.priority && <PriorityDot priority={todo.priority} />}
          {todo.tags.map((tag) => (
            <Chip key={tag} size="sm" clickable={false}>
              {tag}
            </Chip>
          ))}
          {todo.dueTime && (
            <span
              className="inline-flex items-center gap-1 font-sans text-sm font-medium"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              <Clock size={11} />
              {todo.dueTime}
            </span>
          )}
        </div>
      </div>

      {/* Right actions: star + more */}
      <div
        className="flex items-center gap-1 pt-0.5 shrink-0 transition-opacity duration-150"
        style={{ opacity: hovered || todo.starred ? 1 : 0 }}
      >
        <button
          onClick={() => onToggleStar(todo.id)}
          className="p-1 rounded-md cursor-pointer border-none bg-transparent transition-colors duration-150"
          style={{
            color: todo.starred
              ? 'var(--color-warning-1, #e8a500)'
              : 'var(--color-on-surface-subtle-2)',
          }}
          aria-label={todo.starred ? 'Unstar' : 'Star'}
        >
          <Star size={14} fill={todo.starred ? 'currentColor' : 'none'} />
        </button>
        <button
          className="p-1 rounded-md cursor-pointer border-none bg-transparent"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
          aria-label="More options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Timeline group ─────────────────────────────────────────────────────────

function TimelineGroupSection({
  group,
  isFirst,
  isLast,
  onToggle,
  onToggleStar,
}: {
  group: TimelineGroup;
  isFirst: boolean;
  isLast: boolean;
  onToggle: (id: string) => void;
  onToggleStar: (id: string) => void;
}) {
  const activeCount = group.todos.filter((t) => !t.completed).length;
  const completedCount = group.todos.filter((t) => t.completed).length;

  return (
    <div className="flex gap-5">
      {/* Timeline spine */}
      <div className="flex flex-col items-center w-3 shrink-0">
        {/* Dot */}
        <div
          className="mt-1.5 rounded-full shrink-0"
          style={{
            width: 10,
            height: 10,
            backgroundColor: isFirst
              ? 'var(--color-primary-1)'
              : 'var(--color-surface-4)',
            border: isFirst ? 'none' : '2px solid var(--color-surface-3)',
          }}
        />
        {/* Line */}
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
        )}
      </div>

      {/* Group content */}
      <div className="flex-1 min-w-0 pb-10">
        {/* Header */}
        <div className="flex items-baseline gap-3 mb-1">
          <h3
            className="font-display text-lg font-bold leading-[1.3]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {group.label}
          </h3>
          {group.sublabel && (
            <span
              className="font-sans text-sm font-medium"
              style={{ color: 'var(--color-on-surface-subtle-2)' }}
            >
              {group.sublabel}
            </span>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            {activeCount > 0 && (
              <Badge size="sm" variant="neutral">{activeCount}</Badge>
            )}
            {completedCount > 0 && (
              <span
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {completedCount} done
              </span>
            )}
          </div>
        </div>

        {/* Todo items */}
        <div className="flex flex-col mt-3">
          <AnimatePresence>
            {group.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onToggleStar={onToggleStar}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function TodoList() {
  const [groups, setGroups] = useState<TimelineGroup[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = ['all', 'active', 'completed', 'starred'];

  // Toggle completion
  const handleToggle = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        todos: g.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      })),
    );
  };

  // Toggle star
  const handleToggleStar = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        todos: g.todos.map((t) =>
          t.id === id ? { ...t, starred: !t.starred } : t,
        ),
      })),
    );
  };

  // Add new task to "Today"
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const id = `new-${Date.now()}`;
    setGroups((prev) =>
      prev.map((g, i) =>
        i === 0
          ? {
              ...g,
              todos: [
                ...g.todos,
                {
                  id,
                  text: newTask.trim(),
                  completed: false,
                  starred: false,
                  tags: [],
                },
              ],
            }
          : g,
      ),
    );
    setNewTask('');
  };

  // Filter groups
  const filteredGroups = groups
    .map((g) => ({
      ...g,
      todos: g.todos.filter((t) => {
        // Search filter
        if (
          searchQuery &&
          !t.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        )
          return false;

        // Status filter
        if (activeFilter === 'active') return !t.completed;
        if (activeFilter === 'completed') return t.completed;
        if (activeFilter === 'starred') return t.starred;
        return true;
      }),
    }))
    .filter((g) => g.todos.length > 0);

  // Count totals
  const totalActive = groups.reduce(
    (sum, g) => sum + g.todos.filter((t) => !t.completed).length,
    0,
  );
  const totalCompleted = groups.reduce(
    (sum, g) => sum + g.todos.filter((t) => t.completed).length,
    0,
  );

  return (
    <div
      className="flex flex-col items-center min-h-screen px-6 py-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-[640px] flex flex-col gap-10">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1
              className="font-display text-headline-l font-bold"
              style={{ color: 'var(--color-on-surface)' }}
            >
              My Tasks
            </h1>
            <div className="flex items-center gap-2">
              <span
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {totalActive} active · {totalCompleted} done
              </span>
              <Button
                variant="elevated"
                size="sm"
                iconOnly={Calendar}
                aria-label="Calendar view"
              />
            </div>
          </div>
          <p
            className="font-sans text-base font-medium"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Stay on top of your work, one day at a time.
          </p>
        </div>

        {/* ── Add task input ──────────────────────────────────── */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
              }}
            />
          </div>
          <Button
            iconOnly={Plus}
            aria-label="Add task"
            onClick={handleAddTask}
          />
        </div>

        {/* ── Search + Filters ────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <SearchInput
            size="sm"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />

          <div className="flex items-center gap-1.5">
            {filters.map((f) => (
              <Chip
                key={f}
                size="sm"
                onClick={() => setActiveFilter(f)}
                className={
                  activeFilter === f
                    ? 'ring-1 ring-[var(--color-primary-1)]'
                    : ''
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Chip>
            ))}
          </div>
        </div>

        {/* ── Timeline ────────────────────────────────────────── */}
        <div className="flex flex-col">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, i) => (
              <TimelineGroupSection
                key={group.label}
                group={group}
                isFirst={i === 0}
                isLast={i === filteredGroups.length - 1}
                onToggle={handleToggle}
                onToggleStar={handleToggleStar}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 py-16">
              <Flag
                size={32}
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              />
              <p
                className="font-sans text-base font-medium text-center"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                {searchQuery
                  ? 'No tasks match your search.'
                  : 'All clear — nothing to show.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
