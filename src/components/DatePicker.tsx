/**
 * Design System — DatePicker component
 * Source: Figma / Topic Board New / Date Picker
 *
 * Features:
 *   - Range selection (click start, click end)
 *   - Single date selection (click same day twice)
 *   - Preset ranges (Today, Yesterday, Last 7/14/30 days, etc.)
 *   - Month/year navigation
 *   - Optional time inputs (placeholder for now)
 *   - Keyboard accessible
 *
 * Usage:
 *   <DatePicker
 *     value={{ start: new Date(), end: new Date() }}
 *     onChange={(range) => console.log(range)}
 *   />
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../lib/cn';
import { duration as dur, ease, transition } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerProps {
  /** Current selected range */
  value?: DateRange;
  /** Called when range changes */
  onChange?: (range: DateRange) => void;
  /** Class name for the outer container */
  className?: string;
}

type PresetKey = 'today' | 'yesterday' | 'last7' | 'last14' | 'last30' | 'last12m' | 'allTime';

interface Preset {
  key: PresetKey;
  label: string;
  getRange: () => DateRange;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const d = startOfDay(day).getTime();
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  return d > s && d < e;
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/** Get the calendar grid for a given month. Returns 6 weeks × 7 days. */
function getCalendarDays(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (Date | null)[][] = [];
  let day = 1 - startOffset;

  for (let w = 0; w < 6; w++) {
    const week: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (day < 1 || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(new Date(year, month, day));
      }
      day++;
    }
    // Skip fully empty trailing weeks
    if (week.every(d => d === null) && w > 0) break;
    weeks.push(week);
  }
  return weeks;
}

function daysAgo(n: number): DateRange {
  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - n);
  return { start, end };
}

const PRESETS: Preset[] = [
  { key: 'today', label: 'Today', getRange: () => { const d = startOfDay(new Date()); return { start: d, end: d }; } },
  { key: 'yesterday', label: 'Yesterday', getRange: () => { const d = startOfDay(new Date()); d.setDate(d.getDate() - 1); return { start: d, end: d }; } },
  { key: 'last7', label: 'Last 7 days', getRange: () => daysAgo(7) },
  { key: 'last14', label: 'Last 14 days', getRange: () => daysAgo(14) },
  { key: 'last30', label: 'Last 30 days', getRange: () => daysAgo(30) },
  { key: 'last12m', label: 'Last 12 months', getRange: () => daysAgo(365) },
  { key: 'allTime', label: 'All time', getRange: () => ({ start: new Date(2020, 0, 1), end: startOfDay(new Date()) }) },
];

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Day Cell ────────────────────────────────────────────────────────────────

type DayPosition = 'none' | 'start' | 'middle' | 'end' | 'single';

interface DayCellProps {
  date: Date | null;
  position: DayPosition;
  isStart: boolean;
  isEnd: boolean;
  isToday: boolean;
  isDisabled: boolean;
  /** Is this cell at the start of a week row (Monday) */
  isRowStart: boolean;
  /** Is this cell at the end of a week row (Sunday) */
  isRowEnd: boolean;
  /** Whether this day has keyboard focus (roving tabindex) */
  isFocusTarget: boolean;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
  onClick: (date: Date) => void;
}

function DayCell({ date, position, isStart, isEnd, isToday: today, isDisabled, isRowStart, isRowEnd, isFocusTarget, reducedMotion, onClick }: DayCellProps) {
  const { isPressed, pressHandlers } = usePress({ disabled: !date || isDisabled });
  const selected = isStart || isEnd;
  const inRange = position === 'middle' || position === 'start' || position === 'end';

  if (!date) {
    return <div className="w-10 h-10" />;
  }

  // Range background: left half, right half
  const showLeftBg = inRange && !isStart && !isRowStart;
  const showRightBg = inRange && !isEnd && !isRowEnd;
  // Gradient fading at row boundaries
  const gradientLeft = inRange && isRowStart && !isStart;
  const gradientRight = inRange && isRowEnd && !isEnd;

  return (
    <div className="relative w-10 h-10">
      {/* Range background - left half */}
      {(showLeftBg || gradientLeft) && (
        <div
          className="absolute top-0 bottom-0 left-0 right-1/2"
          style={{
            background: gradientLeft
              ? 'linear-gradient(to right, transparent, var(--color-secondary-1))'
              : 'var(--color-secondary-1)',
          }}
        />
      )}
      {/* Range background - right half */}
      {(showRightBg || gradientRight) && (
        <div
          className="absolute top-0 bottom-0 left-1/2 right-0"
          style={{
            background: gradientRight
              ? 'linear-gradient(to left, transparent, var(--color-secondary-1))'
              : 'var(--color-secondary-1)',
          }}
        />
      )}
      {/* Start/end connector backgrounds */}
      {isStart && inRange && (
        <div className="absolute top-0 bottom-0 left-1/2 right-0" style={{ backgroundColor: 'var(--color-secondary-1)' }} />
      )}
      {isEnd && inRange && (
        <div className="absolute top-0 bottom-0 left-0 right-1/2" style={{ backgroundColor: 'var(--color-secondary-1)' }} />
      )}

      {/* Day button */}
      <motion.button
        data-date={date.toISOString()}
        tabIndex={isFocusTarget ? 0 : -1}
        className={cn(
          'absolute inset-0 rounded-m flex items-center justify-center font-sans text-md font-bold cursor-pointer',
          'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
          isDisabled && 'opacity-30 cursor-default',
        )}
        style={{
          backgroundColor: selected ? 'var(--color-primary-1)' : 'transparent',
          color: selected
            ? 'var(--color-on-primary)'
            : isDisabled
            ? 'var(--color-on-surface-subtle-2)'
            : 'var(--color-on-surface)',
        }}
        animate={{ scale: reducedMotion ? 1 : isPressed ? 0.9 : 1 }}
        transition={transition.feedback}
        onClick={() => !isDisabled && onClick(date)}
        whileHover={!isDisabled && !selected ? { backgroundColor: 'var(--color-surface-3)' } : undefined}
        {...pressHandlers}
      >
        {date.getDate()}
        {/* Today indicator dot */}
        {today && !selected && (
          <span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-xl"
            style={{ backgroundColor: 'var(--color-primary-1)' }}
          />
        )}
      </motion.button>
    </div>
  );
}

// ─── Calendar Grid ───────────────────────────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number;
  range: DateRange;
  focusedDate: Date | null;
  reducedMotion: boolean;
  onFocusedDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function CalendarGrid({ year, month, range, focusedDate, reducedMotion, onFocusedDateChange, onDayClick, onPrevMonth, onNextMonth }: CalendarGridProps) {
  const weeks = useMemo(() => getCalendarDays(year, month), [year, month]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Focus the target day button when focusedDate changes
  useEffect(() => {
    if (!focusedDate || !gridRef.current) return;
    const btn = gridRef.current.querySelector<HTMLElement>(`[data-date="${focusedDate.toISOString()}"]`);
    btn?.focus();
  }, [focusedDate]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) return;
    e.preventDefault();

    const base = focusedDate ?? new Date(year, month, 1);
    let newDay = base.getDate();

    if (e.key === 'ArrowRight') newDay += 1;
    else if (e.key === 'ArrowLeft') newDay -= 1;
    else if (e.key === 'ArrowDown') newDay += 7;
    else if (e.key === 'ArrowUp') newDay -= 7;
    else if (e.key === 'Enter' || e.key === ' ') {
      if (focusedDate) onDayClick(focusedDate);
      return;
    }

    if (newDay < 1) {
      // Move to previous month
      onPrevMonth();
      const prevDaysInMonth = new Date(year, month, 0).getDate();
      onFocusedDateChange(new Date(year, month - 1, prevDaysInMonth + newDay));
    } else if (newDay > daysInMonth) {
      // Move to next month
      onNextMonth();
      onFocusedDateChange(new Date(year, month + 1, newDay - daysInMonth));
    } else {
      onFocusedDateChange(new Date(year, month, newDay));
    }
  }, [focusedDate, year, month, daysInMonth, onDayClick, onPrevMonth, onNextMonth, onFocusedDateChange]);

  const getDayPosition = useCallback((date: Date | null): DayPosition => {
    if (!date || !range.start || !range.end) return 'none';
    if (isSameDay(range.start, range.end) && isSameDay(date, range.start)) return 'single';
    if (isSameDay(date, range.start)) return 'start';
    if (isSameDay(date, range.end)) return 'end';
    if (isInRange(date, range.start, range.end)) return 'middle';
    return 'none';
  }, [range]);

  return (
    <div className="flex flex-col gap-3">
      {/* Month/year header */}
      <div className="flex items-center justify-between h-10">
        <Button
          variant="link"
          size="sm"
          iconOnly={ChevronLeft}
          aria-label="Previous month"
          onClick={onPrevMonth}
        />

        <div className="flex items-center gap-5">
          <span className="font-sans text-base font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {MONTHS[month]}
          </span>
          <span className="font-sans text-base font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {year}
          </span>
        </div>

        <Button
          variant="link"
          size="sm"
          iconOnly={ChevronRight}
          aria-label="Next month"
          onClick={onNextMonth}
        />
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="w-10 h-10 flex items-center justify-center">
            <span className="font-sans text-md" style={{ color: 'var(--color-on-surface-subtle-2)' }}>{day}</span>
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div ref={gridRef} className="flex flex-col gap-1" role="grid" onKeyDown={handleGridKeyDown}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7" role="row">
            {week.map((date, di) => {
              const pos = getDayPosition(date);
              return (
                <DayCell
                  key={di}
                  date={date}
                  position={pos}
                  isStart={!!date && isSameDay(date, range.start)}
                  isEnd={!!date && isSameDay(date, range.end)}
                  isToday={!!date && isToday(date)}
                  isDisabled={false}
                  isRowStart={di === 0}
                  isRowEnd={di === 6}
                  isFocusTarget={!!date && !!focusedDate && isSameDay(date, focusedDate)}
                  reducedMotion={reducedMotion}
                  onClick={onDayClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Preset Sidebar ──────────────────────────────────────────────────────────

interface PresetSidebarProps {
  activePreset: PresetKey | null;
  onSelect: (preset: Preset) => void;
}

function PresetSidebar({ activePreset, onSelect }: PresetSidebarProps) {
  return (
    <div
      className="flex flex-col gap-2 p-5 w-40 shrink-0 self-stretch"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >
      {PRESETS.map(preset => {
        const active = activePreset === preset.key;
        return (
          <Button
            key={preset.key}
            variant={active ? 'primary' : 'secondary'}
            size="sm"
            className={cn(
              'w-full justify-center',
              active && 'bg-[var(--color-inverted-surface)] hover:bg-[var(--color-inverted-surface)]',
            )}
            style={active ? { color: 'var(--color-on-inverted-surface)' } : undefined}
            onClick={() => onSelect(preset)}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}

// ─── DatePicker ──────────────────────────────────────────────────────────────

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const reducedMotion = useReducedMotion();
  const now = new Date();
  const [viewYear, setViewYear] = useState(value?.start?.getFullYear() ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.start?.getMonth() ?? now.getMonth());
  const [range, setRange] = useState<DateRange>(value ?? { start: null, end: null });
  const [selecting, setSelecting] = useState<'start' | 'end' | 'done'>('start');
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const updateRange = useCallback((newRange: DateRange) => {
    setRange(newRange);
    onChange?.(newRange);
  }, [onChange]);

  const handleDayClick = useCallback((date: Date) => {
    const d = startOfDay(date);
    setActivePreset(null);

    if (selecting === 'start' || selecting === 'done') {
      // Start new selection
      updateRange({ start: d, end: null });
      setSelecting('end');
    } else {
      // Finish selection
      if (range.start && d.getTime() < range.start.getTime()) {
        // Clicked before start — swap
        updateRange({ start: d, end: range.start });
      } else if (range.start && isSameDay(d, range.start)) {
        // Same day — single day selection
        updateRange({ start: d, end: d });
      } else {
        updateRange({ start: range.start, end: d });
      }
      setSelecting('done');
    }
  }, [selecting, range.start, updateRange]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const handlePreset = useCallback((preset: Preset) => {
    const r = preset.getRange();
    updateRange(r);
    setActivePreset(preset.key);
    setSelecting('done');
    // Navigate calendar to show end date
    if (r.end) {
      setViewYear(r.end.getFullYear());
      setViewMonth(r.end.getMonth());
    }
  }, [updateRange]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  }, [viewMonth]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const nextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  }, [viewMonth]);

  return (
    <div
      className={cn('inline-flex rounded-lg overflow-hidden', className)}
      style={{
        backgroundColor: 'var(--color-surface-1)',
        boxShadow: shadows['medium-2'],
      }}
    >
      {/* Preset sidebar */}
      <PresetSidebar activePreset={activePreset} onSelect={handlePreset} />

      {/* Main panel */}
      <div className="flex flex-col gap-5 p-5">
        {/* Date inputs */}
        <div className="flex items-center gap-3">
          <Input
            size="sm"
            iconLeft={Calendar}
            readOnly
            value={range.start ? formatDate(range.start) : ''}
            placeholder="Start date"
            className="flex-1"
            onClick={() => setSelecting('start')}
          />

          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>–</span>

          <Input
            size="sm"
            iconLeft={Calendar}
            readOnly
            value={range.end ? formatDate(range.end) : ''}
            placeholder="End date"
            className="flex-1"
            onClick={() => setSelecting('end')}
          />
        </div>

        {/* Calendar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewYear}-${viewMonth}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
            transition={reducedMotion ? { duration: 0 } : { duration: dur.fast, ease: ease.standard }}
          >
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              range={range}
              focusedDate={focusedDate}
              reducedMotion={reducedMotion}
              onFocusedDateChange={setFocusedDate}
              onDayClick={handleDayClick}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
