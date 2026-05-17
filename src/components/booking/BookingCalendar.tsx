import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ResolvedTheme } from 'store/slices/common/themeUtils';
import { AppLanguage } from 'config/languages';
import { SafeTranslator } from 'services/locales/safe';

interface BookingCalendarProps {
  /** Map from YYYY-MM-DD (Europe/Zurich) to number of free slots that day. */
  slotsByDate: Map<string, number>;
  /** Currently selected YYYY-MM-DD, or null. */
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  /** Whether availability is still loading; disables interaction. */
  loading: boolean;
  language: AppLanguage;
  theme: ResolvedTheme;
  t: SafeTranslator;
  /** Earliest selectable date in BOOKING_TIMEZONE. */
  earliestDate: Date;
  /** Latest selectable date (inclusive) in BOOKING_TIMEZONE. */
  latestDate: Date;
}

const BOOKING_TIMEZONE = 'Europe/Zurich';

// Returns the date as YYYY-MM-DD anchored in BOOKING_TIMEZONE.
function zonedDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  return parts;
}

function zonedDayOfMonth(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BOOKING_TIMEZONE,
      day: 'numeric',
    }).format(date),
  );
}

function zonedMonthIndex(date: Date): number {
  // 1..12, returned as a 0-based index to match Date.getMonth.
  const m = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BOOKING_TIMEZONE,
      month: 'numeric',
    }).format(date),
  );
  return m - 1;
}

function zonedYear(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BOOKING_TIMEZONE,
      year: 'numeric',
    }).format(date),
  );
}

function zonedWeekday(date: Date): number {
  const short = new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'short',
  }).format(date);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(short);
}

// We render a six-row grid (max 42 cells) starting from the Monday of the
// week that contains the 1st of the displayed month. Days outside the month
// are rendered greyed out and non-interactive.
const WEEK_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

interface MonthGridCell {
  date: Date;
  key: string;
  inMonth: boolean;
}

function buildMonthGrid(year: number, monthIndex0: number): MonthGridCell[] {
  // First day of the month at noon UTC. Noon avoids DST midnight glitches.
  const monthStart = new Date(Date.UTC(year, monthIndex0, 1, 12, 0, 0));
  const startWeekday = zonedWeekday(monthStart);
  // Convert Sunday=0..Sat=6 into Monday=0..Sun=6 for a Mon-first grid.
  const leadingBlanks = (startWeekday + 6) % 7;

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const dayOffset = i - leadingBlanks;
    const cellDate = new Date(
      Date.UTC(year, monthIndex0, 1 + dayOffset, 12, 0, 0),
    );
    const inMonth = zonedMonthIndex(cellDate) === monthIndex0;
    cells.push({
      date: cellDate,
      key: zonedDateKey(cellDate),
      inMonth,
    });
  }
  return cells;
}

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  slotsByDate,
  selectedDate,
  onSelectDate,
  loading,
  language: _language,
  theme,
  t,
  earliestDate,
  latestDate,
}) => {
  const isLight = theme === 'light';

  // The visible month: defaults to the month containing `earliestDate`. The
  // user can navigate previous/next within the [earliest..latest] window.
  const [visibleYearMonth, setVisibleYearMonth] = React.useState(() => ({
    year: zonedYear(earliestDate),
    month: zonedMonthIndex(earliestDate),
  }));

  const earliestKey = zonedDateKey(earliestDate);
  const latestKey = zonedDateKey(latestDate);
  const earliestMonthOrdinal = zonedYear(earliestDate) * 12 + zonedMonthIndex(earliestDate);
  const latestMonthOrdinal = zonedYear(latestDate) * 12 + zonedMonthIndex(latestDate);
  const visibleOrdinal = visibleYearMonth.year * 12 + visibleYearMonth.month;

  const canGoBack = visibleOrdinal > earliestMonthOrdinal;
  const canGoForward = visibleOrdinal < latestMonthOrdinal;

  const goPrev = () => {
    if (!canGoBack) return;
    setVisibleYearMonth((prev) => {
      const next = prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 };
      return next;
    });
  };
  const goNext = () => {
    if (!canGoForward) return;
    setVisibleYearMonth((prev) => {
      const next = prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 };
      return next;
    });
  };

  const cells = React.useMemo(
    () => buildMonthGrid(visibleYearMonth.year, visibleYearMonth.month),
    [visibleYearMonth.year, visibleYearMonth.month],
  );

  const monthLabel = t.text(`booking.months.${MONTH_KEYS[visibleYearMonth.month]}`);

  const headerTextClass = isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]';
  const navButtonClass = isLight
    ? 'text-[#4B5563] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent'
    : 'text-[#CFCDE0] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent';
  const weekdayLabelClass = isLight ? 'text-[#6B7280]' : 'text-[#9CA0BA]';

  return (
    <div className="w-full">
      {/* Header — month label + nav arrows */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoBack}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${navButtonClass}`}
          aria-label={t.text('booking.previousMonth')}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <p
          className={`font-redDisplay font-semibold text-[18px] capitalize ${headerTextClass}`}
        >
          {monthLabel} {visibleYearMonth.year}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoForward}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${navButtonClass}`}
          aria-label={t.text('booking.nextMonth')}
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Weekday header row */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_KEYS.map((dayKey) => (
          <div
            key={dayKey}
            className={`text-center text-[11px] font-poppins font-medium uppercase tracking-[0.08em] ${weekdayLabelClass}`}
          >
            {t.text(`booking.days.${dayKey}`)}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const isOutOfMonth = !cell.inMonth;
          const isBeforeEarliest = cell.key < earliestKey;
          const isAfterLatest = cell.key > latestKey;
          const slotCount = slotsByDate.get(cell.key) ?? 0;
          const hasSlots = slotCount > 0;
          const isSelected = selectedDate === cell.key;
          const isDisabled =
            isOutOfMonth || isBeforeEarliest || isAfterLatest || !hasSlots || loading;

          // Visual state lookup: out-of-month is greyed; in-range with slots
          // gets a subtle dot; selected gets the brand gradient pill.
          const cellClasses = isSelected
            ? 'bg-[linear-gradient(135deg,#b514fd,#5f75f5)] text-white shadow-[0_8px_20px_-6px_rgba(181,20,253,0.55)]'
            : isDisabled
              ? isLight
                ? isOutOfMonth
                  ? 'text-[#D1D5DB]'
                  : 'text-[#D1D5DB] cursor-not-allowed'
                : isOutOfMonth
                  ? 'text-[#4A4D63]'
                  : 'text-[#4A4D63] cursor-not-allowed'
              : isLight
                ? 'text-[#14172D] hover:bg-black/5 cursor-pointer'
                : 'text-[#F6F6F6] hover:bg-white/10 cursor-pointer';

          return (
            <button
              key={cell.key}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectDate(cell.key)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-[14px] font-poppins font-medium transition-colors ${cellClasses}`}
              aria-label={cell.key}
              aria-pressed={isSelected}
            >
              <span>{zonedDayOfMonth(cell.date)}</span>
              {/* Tiny dot beneath available days */}
              {!isSelected && hasSlots && !isDisabled && (
                <span
                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#b514fd]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
