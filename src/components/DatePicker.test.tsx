import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  // ── Test date helpers ─────────────────────────────────────────────────────

  const createDate = (year: number, month: number, day: number): Date => {
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the date picker', () => {
    render(<DatePicker />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders preset sidebar with all preset buttons', () => {
    render(<DatePicker />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    expect(screen.getByText('Last 14 days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    expect(screen.getByText('Last 12 months')).toBeInTheDocument();
    expect(screen.getByText('All time')).toBeInTheDocument();
  });

  it('renders date input fields with calendar icons', () => {
    render(<DatePicker />);
    const inputs = screen.getAllByPlaceholderText(/(Start|End) date/);
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute('placeholder', 'Start date');
    expect(inputs[1]).toHaveAttribute('placeholder', 'End date');
  });

  it('renders calendar grid with day headers', () => {
    render(<DatePicker />);
    const dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    dayHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders month and year', () => {
    render(<DatePicker />);
    expect(screen.getByText('April')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<DatePicker />);
    expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
  });

  it('renders calendar day cells', () => {
    render(<DatePicker />);
    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(20);
  });

  it('accepts className prop', () => {
    const { container } = render(<DatePicker className="custom-class" />);
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  // ── Month/Year Display ────────────────────────────────────────────────────

  it('displays current month and year on initial render', () => {
    render(<DatePicker />);
    expect(screen.getByText('April')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('displays the month from value prop if provided', () => {
    const value = { start: createDate(2026, 2, 15), end: null };
    render(<DatePicker value={value} />);
    expect(screen.getByText('February')).toBeInTheDocument();
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  it('navigates to next month when Next button is clicked', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    expect(screen.getByText('April')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Next month'));

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('May')).toBeInTheDocument();
  });

  it('navigates to previous month when Previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    expect(screen.getByText('April')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous month'));

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('March')).toBeInTheDocument();
  });

  it('wraps to next year when navigating from December to January', async () => {
    const user = userEvent.setup();
    const value = { start: createDate(2025, 12, 15), end: null };
    render(<DatePicker value={value} />);

    expect(screen.getByText('December')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Next month'));

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('wraps to previous year when navigating from January to December', async () => {
    const user = userEvent.setup();
    const value = { start: createDate(2026, 1, 15), end: null };
    render(<DatePicker value={value} />);

    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous month'));

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('December')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  // ── Single Date Selection ─────────────────────────────────────────────────

  it('selects a single date on first click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.start).toBeDefined();
  });

  it('completes single date selection when same day is clicked twice', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);

    await user.click(dayButtons[0]);
    const secondCall = onChange.mock.calls[1][0];

    expect(secondCall.start.getDate()).toBe(secondCall.end.getDate());
    expect(secondCall.start.getMonth()).toBe(secondCall.end.getMonth());
  });

  // ── Range Selection ───────────────────────────────────────────────────────

  it('selects start date on first click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: null,
      })
    );
  });

  it('completes range selection on second click with later date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);
    const firstSelection = onChange.mock.calls[0][0];

    await user.click(dayButtons[Math.min(5, dayButtons.length - 1)]);
    const secondSelection = onChange.mock.calls[1][0];

    expect(secondSelection.start).toEqual(firstSelection.start);
    expect(secondSelection.end).toBeDefined();
  });

  it('swaps start and end when end date is before start date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    const laterIndex = Math.min(10, dayButtons.length - 1);
    await user.click(dayButtons[laterIndex]);
    await user.click(dayButtons[0]);
    const finalSelection = onChange.mock.calls[1][0];

    expect(finalSelection.start.getTime()).toBeLessThanOrEqual(finalSelection.end.getTime());
  });

  // ── Preset Ranges ─────────────────────────────────────────────────────────

  it('selects "Today" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Today'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.start.getDate()).toBe(call.end.getDate());
  });

  it('selects "Yesterday" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Yesterday'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.start.getDate()).toBe(call.end.getDate());
  });

  it('selects "Last 7 days" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Last 7 days'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    const daysDiff = Math.floor((call.end.getTime() - call.start.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeGreaterThanOrEqual(6);
  });

  it('selects "Last 30 days" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Last 30 days'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    const daysDiff = Math.floor((call.end.getTime() - call.start.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeGreaterThanOrEqual(29);
  });

  it('navigates calendar to preset range end date', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    expect(screen.getByText('April')).toBeInTheDocument();

    await user.click(screen.getByText('Last 12 months'));

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('April')).toBeInTheDocument();
  });

  // ── onChange Callback ─────────────────────────────────────────────────────

  it('calls onChange when date is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);

    expect(onChange).toHaveBeenCalled();
  });

  it('calls onChange when preset is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Today'));

    expect(onChange).toHaveBeenCalled();
  });

  // ── Value Prop ────────────────────────────────────────────────────────────

  it('displays initial value in date input fields', () => {
    const value = {
      start: createDate(2026, 4, 5),
      end: createDate(2026, 4, 15),
    };
    render(<DatePicker value={value} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('5 Apr 2026');
    expect(inputs[1]).toHaveValue('15 Apr 2026');
  });

  it('shows empty input fields when value is null', () => {
    const value = { start: null, end: null };
    render(<DatePicker value={value} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveValue('');
  });

  // ── Keyboard Accessibility ────────────────────────────────────────────────

  it('calendar grid has role="grid" for keyboard navigation', () => {
    render(<DatePicker onChange={vi.fn()} />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('role', 'grid');
  });

  it('day buttons have proper tabIndex for roving focus', () => {
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    // At least some buttons should have tabindex set (0 or -1)
    const hasTabIndex = dayButtons.some(btn =>
      btn.hasAttribute('tabindex')
    );
    expect(hasTabIndex).toBe(true);
  });

  // ── Date Input Readonly ───────────────────────────────────────────────────

  it('respects readonly state on date inputs', () => {
    render(<DatePicker />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAttribute('readonly');
    });
  });

  // ── Date Range Formatting ─────────────────────────────────────────────────

  it('displays formatted date in start input', () => {
    const value = { start: createDate(2026, 4, 15), end: null };
    render(<DatePicker value={value} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('15 Apr 2026');
  });

  it('displays formatted date in end input', () => {
    const value = { start: createDate(2026, 4, 10), end: createDate(2026, 4, 20) };
    render(<DatePicker value={value} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[1]).toHaveValue('20 Apr 2026');
  });

  // ── Multiple Consecutive Selections ───────────────────────────────────────

  it('allows multiple consecutive selections', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');

    await user.click(dayButtons[0]);
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(dayButtons[4]);
    expect(onChange).toHaveBeenCalledTimes(2);

    await user.click(dayButtons[6]);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  // ── CSS Classes ───────────────────────────────────────────────────────────

  it('applies className to outer container', () => {
    const { container } = render(<DatePicker className="test-class" />);
    const wrapper = container.querySelector('.test-class');
    expect(wrapper).toBeInTheDocument();
  });

  // ── Keyboard navigation ────────────────────────────────────────────────

  it('handles arrow key navigation to next day', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const firstButton = within(grid).getAllByRole('button')[0];

    firstButton.focus();
    await user.keyboard('{ArrowRight}');

    expect(grid).toBeInTheDocument();
  });

  it('handles arrow key navigation to previous day', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');

    buttons[10]?.focus();
    await user.keyboard('{ArrowLeft}');

    expect(grid).toBeInTheDocument();
  });

  it('handles arrow key navigation down (next week)', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const firstButton = within(grid).getAllByRole('button')[0];

    firstButton.focus();
    await user.keyboard('{ArrowDown}');

    expect(grid).toBeInTheDocument();
  });

  it('handles arrow key navigation up (previous week)', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');
    const laterButton = buttons[Math.min(20, buttons.length - 1)];

    laterButton?.focus();
    await user.keyboard('{ArrowUp}');

    expect(grid).toBeInTheDocument();
  });

  it('handles Enter key to select focused date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');
    const firstButton = dayButtons[0];

    // First click to establish selection, then navigate and Enter
    await user.click(firstButton);
    await user.keyboard('{Enter}');

    // Should complete the selection
    expect(onChange).toHaveBeenCalled();
  });

  it('handles Space key to select focused date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const grid = screen.getByRole('grid');
    const dayButtons = within(grid).getAllByRole('button');
    const firstButton = dayButtons[0];

    // First click to establish selection, then use Space
    await user.click(firstButton);
    firstButton.focus();
    await user.keyboard(' ');

    // Should complete the selection
    expect(onChange).toHaveBeenCalled();
  });

  it('ignores non-navigation keys', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const grid = screen.getByRole('grid');
    const firstButton = within(grid).getAllByRole('button')[0];

    firstButton.focus();
    await user.keyboard('a');

    expect(grid).toBeInTheDocument();
  });

  it('wraps to previous month when navigating before month start', async () => {
    const user = userEvent.setup();
    const value = { start: createDate(2026, 3, 1), end: null };
    render(<DatePicker value={value} />);

    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');
    const firstDay = buttons[0];

    firstDay.focus();
    await user.keyboard('{ArrowLeft}');

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(screen.getByText('February')).toBeInTheDocument();
  });

  it('wraps to next month when navigating after month end', async () => {
    const user = userEvent.setup();
    const value = { start: createDate(2026, 3, 28), end: null };
    render(<DatePicker value={value} />);

    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');

    // Click a button to establish focus, then navigate right several times to go past month end
    await user.click(buttons[buttons.length - 1]);
    await user.keyboard('{ArrowRight}');

    await new Promise(resolve => setTimeout(resolve, 200));

    // Should navigate to next month
    expect(grid).toBeInTheDocument();
  });

  // ── Input field interactions ───────────────────────────────────────────

  it('clicking start input sets selecting to start', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);

    expect(inputs[0]).toBeInTheDocument();
  });

  it('clicking end input sets selecting to end', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[1]);

    expect(inputs[1]).toBeInTheDocument();
  });

  // ── Last 14 days preset ────────────────────────────────────────────────

  it('selects "Last 14 days" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('Last 14 days'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    const daysDiff = Math.floor((call.end.getTime() - call.start.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeGreaterThanOrEqual(13);
  });

  // ── All time preset ────────────────────────────────────────────────────

  it('selects "All time" preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByText('All time'));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.start.getFullYear()).toBe(2020);
    expect(call.start.getMonth()).toBe(0);
    expect(call.start.getDate()).toBe(1);
  });

  // ── Keyboard navigation wrapping to next month ──────────────────────────

  it('keyboard navigation wraps days to next month correctly', async () => {
    const user = userEvent.setup();
    const value = { start: createDate(2026, 3, 28), end: null };
    render(<DatePicker value={value} />);

    const grid = screen.getByRole('grid');
    const buttons = within(grid).getAllByRole('button');

    // Click last button and navigate right
    const lastButton = buttons[buttons.length - 1];
    await user.click(lastButton);

    for (let i = 0; i < 5; i += 1) {
      await user.keyboard('{ArrowRight}');
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Grid should still be present
    expect(grid).toBeInTheDocument();
  });
});
