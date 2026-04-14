import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs, Tab } from './Tabs';

describe('Tabs', () => {
  const renderTabs = (value = 'overview', onChange = vi.fn()) =>
    render(
      <Tabs value={value} onChange={onChange}>
        <Tab value="overview">Overview</Tab>
        <Tab value="files">Files</Tab>
        <Tab value="settings">Settings</Tab>
      </Tabs>,
    );

  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders tablist container', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders all tab items', () => {
    renderTabs();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders tab labels', () => {
    renderTabs();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  // ── Selection ─────────────────────────────────────────────────────────

  it('marks selected tab with aria-selected', () => {
    renderTabs('files');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('selected tab has tabIndex 0, others have -1', () => {
    renderTabs('overview');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  // ── Click interaction ─────────────────────────────────────────────────

  it('calls onChange with tab value on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('overview', handleChange);
    await user.click(screen.getByText('Files'));
    expect(handleChange).toHaveBeenCalledWith('files');
  });

  // ── Keyboard navigation ───────────────────────────────────────────────

  it('moves focus right with ArrowRight', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('overview', handleChange);

    // Focus the first tab
    screen.getAllByRole('tab')[0].focus();
    await user.keyboard('{ArrowRight}');

    expect(handleChange).toHaveBeenCalledWith('files');
  });

  it('moves focus left with ArrowLeft', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('files', handleChange);

    screen.getAllByRole('tab')[1].focus();
    await user.keyboard('{ArrowLeft}');

    expect(handleChange).toHaveBeenCalledWith('overview');
  });

  it('wraps to last tab on ArrowLeft from first', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('overview', handleChange);

    screen.getAllByRole('tab')[0].focus();
    await user.keyboard('{ArrowLeft}');

    expect(handleChange).toHaveBeenCalledWith('settings');
  });

  it('moves to first tab on Home', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('settings', handleChange);

    screen.getAllByRole('tab')[2].focus();
    await user.keyboard('{Home}');

    expect(handleChange).toHaveBeenCalledWith('overview');
  });

  it('moves to last tab on End', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderTabs('overview', handleChange);

    screen.getAllByRole('tab')[0].focus();
    await user.keyboard('{End}');

    expect(handleChange).toHaveBeenCalledWith('settings');
  });

  // ── Disabled ──────────────────────────────────────────────────────────

  it('disabled tab cannot be clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Tabs value="overview" onChange={handleChange}>
        <Tab value="overview">Overview</Tab>
        <Tab value="disabled" disabled>Disabled</Tab>
      </Tabs>,
    );
    await user.click(screen.getByText('Disabled'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('all tabs have type="button"', () => {
    renderTabs();
    screen.getAllByRole('tab').forEach((tab) => {
      expect(tab).toHaveAttribute('type', 'button');
    });
  });
});
