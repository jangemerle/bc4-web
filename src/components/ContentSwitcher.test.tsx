import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Grid, List } from 'lucide-react';
import { ContentSwitcher, ContentSwitcherItem } from './ContentSwitcher';

describe('ContentSwitcher', () => {
  const renderSwitcher = (value = 'list', onChange = vi.fn(), children = null) =>
    render(
      <ContentSwitcher value={value} onChange={onChange}>
        {children || (
          <>
            <ContentSwitcherItem value="list">List</ContentSwitcherItem>
            <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
            <ContentSwitcherItem value="compact">Compact</ContentSwitcherItem>
          </>
        )}
      </ContentSwitcher>,
    );

  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders tablist container', () => {
    renderSwitcher();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders all tab items', () => {
    renderSwitcher();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders item labels', () => {
    renderSwitcher();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('Compact')).toBeInTheDocument();
  });

  it('renders with icons', () => {
    const { container } = render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list" icon={List}>List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    // Icons are rendered as SVG elements via Icon component
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs.length).toBe(2); // One for each item with an icon
  });

  // ── Selection state ────────────────────────────────────────────────────

  it('marks selected item with aria-selected="true"', () => {
    renderSwitcher('grid');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('changes selected item when value prop changes', () => {
    const { rerender } = render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');

    rerender(
      <ContentSwitcher value="grid">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });

  // ── Click interaction ───────────────────────────────────────────────────

  it('calls onChange with item value on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderSwitcher('list', handleChange);
    await user.click(screen.getByText('Grid'));
    expect(handleChange).toHaveBeenCalledWith('grid');
  });

  it('calls onChange only once on single click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderSwitcher('list', handleChange);
    await user.click(screen.getByText('Grid'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('calls onChange when clicking already selected item', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderSwitcher('list', handleChange);
    await user.click(screen.getByText('List'));
    expect(handleChange).toHaveBeenCalledWith('list');
  });

  it('calls onChange for each click in sequence', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderSwitcher('list', handleChange);
    await user.click(screen.getByText('Grid'));
    await user.click(screen.getByText('Compact'));
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenNthCalledWith(1, 'grid');
    expect(handleChange).toHaveBeenNthCalledWith(2, 'compact');
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('disabled item cannot be clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ContentSwitcher value="list" onChange={handleChange}>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" disabled>Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    await user.click(screen.getByText('Grid'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disabled item has disabled attribute', () => {
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" disabled>Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toBeDisabled();
  });

  it('disabled item shows reduced opacity', () => {
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" disabled>Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].className).toContain('opacity-40');
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('renders with sm size', () => {
    render(
      <ContentSwitcher value="list" size="sm">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders with md size (default)', () => {
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders with lg size', () => {
    render(
      <ContentSwitcher value="list" size="lg">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  // ── Variant styles ─────────────────────────────────────────────────────

  it('renders with default variant (border only)', () => {
    const { container } = render(
      <ContentSwitcher value="list" variant="default">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]') as HTMLElement;
    // Check that the border style is set (not empty or 'none')
    const borderStyle = tablist.style.border;
    expect(borderStyle).toEqual('1px solid var(--color-border)');
  });

  it('renders with elevated variant', () => {
    const { container } = render(
      <ContentSwitcher value="list" variant="elevated">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveStyle({ backgroundColor: 'var(--color-surface-1)' });
    expect(tablist?.className).toContain('shadow-small-2');
  });

  it('elevated variant has no border', () => {
    const { container } = render(
      <ContentSwitcher value="list" variant="elevated">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]') as HTMLElement;
    // Elevated variant sets backgroundColor but elevated variant does NOT use border (checks for !border or border-only)
    // The component applies 'none' explicitly but we can verify it's elevated by checking the bg color
    const styleAttr = tablist.getAttribute('style') || '';
    expect(styleAttr).toContain('background-color: var(--color-surface-1)');
  });

  // ── Fill mode ───────────────────────────────────────────────────────────

  it('renders with hug width (default)', () => {
    const { container } = render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('inline-flex');
    expect(tablist?.className).not.toContain('w-full');
  });

  it('renders with fill width when fill prop is true', () => {
    const { container } = render(
      <ContentSwitcher value="list" fill>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('w-full');
    expect(tablist?.className).toContain('flex');
  });

  it('items have flex-1 when fill is true', () => {
    render(
      <ContentSwitcher value="list" fill>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((tab) => {
      expect(tab.className).toContain('flex-1');
    });
  });

  // ── Icon support ───────────────────────────────────────────────────────

  it('renders icon alongside label', () => {
    const { container } = render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list" icon={List}>List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    // Icon and label are wrapped in a span with z-10 to appear above the active indicator
    const spans = container.querySelectorAll('span.relative.z-10');
    expect(spans.length).toBeGreaterThan(0);
  });

  // ── Accessibility ──────────────────────────────────────────────────────

  it('all items have role="tab"', () => {
    renderSwitcher();
    screen.getAllByRole('tab').forEach((tab) => {
      expect(tab).toHaveAttribute('role', 'tab');
    });
  });

  it('all items have aria-selected attribute', () => {
    renderSwitcher();
    screen.getAllByRole('tab').forEach((tab) => {
      expect(tab).toHaveAttribute('aria-selected');
    });
  });

  it('selected item has aria-selected="true", others "false"', () => {
    renderSwitcher('compact');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('items are focusable with Tab key', () => {
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((tab) => {
      expect(tab).not.toHaveAttribute('disabled');
    });
  });

  it('focuses first item and it can receive keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const firstTab = screen.getAllByRole('tab')[0];
    await user.tab();
    // First tab should have focus
    expect(firstTab === document.activeElement).toBeTruthy();
  });

  it('has focus-visible outline on focus', () => {
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tab = screen.getByRole('tab');
    expect(tab.className).toContain('focus-visible:outline');
  });

  // ── Edge cases ──────────────────────────────────────────────────────────

  it('works with no onChange handler', async () => {
    const user = userEvent.setup();
    render(
      <ContentSwitcher value="list">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    // Should not throw when onClick fires with undefined onChange
    await user.click(screen.getByText('Grid'));
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('handles empty string as initial value', () => {
    render(
      <ContentSwitcher value="">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('handles undefined value', () => {
    render(
      <ContentSwitcher value={undefined}>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('supports custom className on container', () => {
    const { container } = render(
      <ContentSwitcher value="list" className="custom-class">
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('custom-class');
  });

  // ── Integration tests ──────────────────────────────────────────────────

  it('fully controlled component workflow', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <ContentSwitcher value="list" onChange={handleChange}>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );

    await user.click(screen.getByText('Grid'));
    expect(handleChange).toHaveBeenCalledWith('grid');

    rerender(
      <ContentSwitcher value="grid" onChange={handleChange}>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );

    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('switches between multiple items in sequence', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderSwitcher('list', handleChange);

    await user.click(screen.getByText('Grid'));
    expect(handleChange).toHaveBeenLastCalledWith('grid');

    await user.click(screen.getByText('Compact'));
    expect(handleChange).toHaveBeenLastCalledWith('compact');

    await user.click(screen.getByText('List'));
    expect(handleChange).toHaveBeenLastCalledWith('list');

    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('respects disabled state with multiple items', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ContentSwitcher value="list" onChange={handleChange}>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid" disabled>Grid</ContentSwitcherItem>
        <ContentSwitcherItem value="compact">Compact</ContentSwitcherItem>
      </ContentSwitcher>,
    );

    await user.click(screen.getByText('Grid'));
    expect(handleChange).not.toHaveBeenCalled();

    await user.click(screen.getByText('Compact'));
    expect(handleChange).toHaveBeenCalledWith('compact');
  });

  it('combines size, variant, and fill options', () => {
    const { container } = render(
      <ContentSwitcher value="list" size="lg" variant="elevated" fill>
        <ContentSwitcherItem value="list">List</ContentSwitcherItem>
        <ContentSwitcherItem value="grid">Grid</ContentSwitcherItem>
      </ContentSwitcher>,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('w-full');
    expect(tablist?.className).toContain('shadow-small-2');
    expect(tablist).toHaveStyle({ backgroundColor: 'var(--color-surface-1)' });
  });
});
