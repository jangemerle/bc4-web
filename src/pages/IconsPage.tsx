/**
 * Icons page — browsable, searchable icon library grouped by category
 * Data sourced from lucide.dev/api/categories
 */

import { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { Icon } from '../components/Icon';
import { SearchInput } from '../components/SearchInput';
import { iconCategories, categoryNames } from '../data/icon-categories';
import { iconTags } from '../data/icon-tags';
import { cn } from '../lib/cn';

// ─── Convert kebab-case to PascalCase ────────────────────────────────────────

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => {
      // Handle number segments like "arrow-down-0-1"
      if (/^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

// ─── Build icon registry once ────────────────────────────────────────────────

const allIcons = LucideIcons as unknown as Record<string, LucideIcon>;

interface IconEntry {
  name: string;       // kebab-case display name
  component: LucideIcon;
  categories: string[];
  tags: string[];
}

const iconRegistry: IconEntry[] = Object.entries(iconCategories)
  .map(([name, cats]) => {
    const pascal = kebabToPascal(name);
    const comp = allIcons[pascal];
    if (!comp || typeof comp !== 'object') return null;
    return { name, component: comp as LucideIcon, categories: cats, tags: iconTags[name] ?? [] };
  })
  .filter((x) => x !== null)
  .map((x) => x as IconEntry)
  .sort((a, b) => a.name.localeCompare(b.name));

// Pre-built search haystack (name words + tags)
const searchIndex: { entry: IconEntry; haystack: string }[] = iconRegistry.map((entry) => ({
  entry,
  haystack: [entry.name.replace(/-/g, ' '), ...entry.tags].join(' ').toLowerCase(),
}));

// ─── Build category → icons map ──────────────────────────────────────────────

const categoryOrder = Object.keys(categoryNames).sort((a, b) =>
  categoryNames[a].localeCompare(categoryNames[b]),
);

const iconsByCategory: Record<string, IconEntry[]> = {};
for (const cat of categoryOrder) {
  iconsByCategory[cat] = iconRegistry.filter((ic) => ic.categories.includes(cat));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IconsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return activeCategory ? (iconsByCategory[activeCategory] ?? []) : iconRegistry;

    const pool = activeCategory
      ? searchIndex.filter(({ entry }) => entry.categories.includes(activeCategory))
      : searchIndex;

    const matches = pool.filter(({ haystack }) => haystack.includes(q));
    // Rank: name match first, tag match second
    matches.sort((a, b) => {
      const aName = a.entry.name.replace(/-/g, ' ');
      const bName = b.entry.name.replace(/-/g, ' ');
      const aScore = aName === q ? 0 : aName.includes(q) ? 1 : 2;
      const bScore = bName === q ? 0 : bName.includes(q) ? 1 : 2;
      return aScore - bScore;
    });
    return matches.map(({ entry }) => entry);
  }, [search, activeCategory]);

  // Group by category for display
  const grouped = useMemo(() => {
    if (activeCategory) {
      return [{ category: activeCategory, label: categoryNames[activeCategory], icons: filtered }];
    }

    // Show all categories with their filtered icons
    const groups: { category: string; label: string; icons: IconEntry[] }[] = [];
    for (const cat of categoryOrder) {
      const icons = filtered.filter((ic) => ic.categories.includes(cat));
      if (icons.length > 0) {
        groups.push({ category: cat, label: categoryNames[cat], icons });
      }
    }
    return groups;
  }, [filtered, activeCategory]);

  // Deduplicate when showing all — only show each icon once (in its first category)
  const deduped = useMemo(() => {
    if (activeCategory) return grouped;
    const seen = new Set<string>();
    return grouped.map((g) => {
      const unique = g.icons.filter((ic) => {
        if (seen.has(ic.name)) return false;
        seen.add(ic.name);
        return true;
      });
      return { ...g, icons: unique };
    }).filter((g) => g.icons.length > 0);
  }, [grouped, activeCategory]);

  const totalCount = activeCategory
    ? filtered.length
    : iconRegistry.length;

  const matchCount = filtered.length;

  return (
    <>
      {/* Search + count */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-80">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons…"
            size="md"
          />
        </div>
        <span
          className="font-sans text-md font-medium"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {search && matchCount !== totalCount
            ? `${matchCount} of ${totalCount} icons`
            : `${totalCount} icons`}
        </span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-full font-sans text-sm font-semibold transition-colors duration-150 cursor-pointer',
            !activeCategory
              ? 'bg-[var(--color-inverted-surface)] text-[var(--color-on-inverted-surface)]'
              : 'bg-[var(--color-surface-3)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-4)]',
          )}
        >
          All
        </button>
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn(
              'px-3 py-1.5 rounded-full font-sans text-sm font-semibold transition-colors duration-150 cursor-pointer',
              activeCategory === cat
                ? 'bg-[var(--color-inverted-surface)] text-[var(--color-on-inverted-surface)]'
                : 'bg-[var(--color-surface-3)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-4)]',
            )}
          >
            {categoryNames[cat]}
          </button>
        ))}
      </div>

      {/* Icon grid grouped by category */}
      {deduped.length === 0 && (
        <p
          className="font-sans text-base font-medium py-16 text-center"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          No icons found for "{search}"
        </p>
      )}

      {deduped.map((group) => (
        <div key={group.category} className="mb-10">
          <h3
            className="font-display text-headline-s font-bold mb-4"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {group.label}
            <span
              className="font-sans text-md font-medium ml-2"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              {group.icons.length}
            </span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.icons.map((ic) => (
              <div
                key={ic.name}
                className="flex flex-col items-center gap-2 p-3 rounded-m w-[88px] hover:bg-[var(--color-surface-3)] transition-colors duration-150"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <Icon icon={ic.component} size="lg" style={{ color: 'var(--color-on-surface)' }} />
                <span
                  className="font-sans text-xs font-medium text-center leading-tight break-all"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {ic.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
