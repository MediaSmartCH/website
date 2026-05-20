import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Loader2, Video, X } from 'lucide-react';

import { useAppSelector } from 'services/hooks/hooks';
import { useTranslations } from 'services/locales/safe';
import {
  BookingSlot,
  createBooking,
  fetchAvailability,
} from 'services/api/booking';

import BookingCalendar from './BookingCalendar';
import BookingForm from './BookingForm';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

// Wizard stages. Each one is a single full-width pane so the user is never
// looking at two interactive controls at once. Going back is always possible
// via the explicit "back" button on every non-initial step (or the close X).
type Stage = 'date' | 'time' | 'form' | 'success';

const BOOKING_TIMEZONE = 'Europe/Zurich';

// 28 days of horizon matches the backend constant. Kept identical client-side
// so the calendar never offers anything the server would later refuse.
const HORIZON_DAYS = 28;

function dateKeyInBookingTz(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function formatSlotForUser(date: Date, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDayHuman(dateKey: string, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateKey}T12:00:00Z`));
}

function formatTimeOnly(date: Date, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Locks body scroll while the modal is open so the underlying page doesn't
// drift on iOS Safari and on desktop scroll wheels.
function useBodyScrollLock(active: boolean): void {
  React.useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose }) => {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);

  useBodyScrollLock(open);

  // Availability state ------------------------------------------------------
  const [slots, setSlots] = React.useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);

  const [stage, setStage] = React.useState<Stage>('date');
  const [selectedDateKey, setSelectedDateKey] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<BookingSlot | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [confirmation, setConfirmation] = React.useState<{
    start: Date;
    end: Date;
    meetLink: string | null;
    manageUrl: string;
  } | null>(null);

  // Reset every piece of state when the modal closes so re-opening starts
  // clean. We keep this in one place rather than scattering setters across
  // multiple effects.
  React.useEffect(() => {
    if (open) return;
    setStage('date');
    setSelectedDateKey(null);
    setSelectedSlot(null);
    setSubmitting(false);
    setSubmitError(null);
    setConfirmation(null);
    setSlotsError(null);
  }, [open]);

  // Window of dates we expose. We compute fresh on each modal open so the
  // calendar reflects the current day after the page sits idle for a while.
  const dateRange = React.useMemo(() => {
    const earliest = new Date();
    const latest = new Date(earliest.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000);
    return { from: earliest, to: latest };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoadingSlots(true);
    setSlotsError(null);

    fetchAvailability(dateRange.from, dateRange.to, controller.signal)
      .then((res) => {
        if (!res.success) {
          setSlotsError(t.text('booking.error'));
          return;
        }
        setSlots(res.slots);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('fetchAvailability failed', err);
        setSlotsError(t.text('booking.error'));
      })
      .finally(() => setLoadingSlots(false));

    return () => controller.abort();
  }, [open, dateRange.from, dateRange.to, t]);

  // Pre-compute per-day slot index for the calendar (which days have dots)
  // and per-day slot list (which time options to show when a day is picked).
  const { slotsByDate, slotsForSelectedDate } = React.useMemo(() => {
    const byDate = new Map<string, BookingSlot[]>();
    for (const slot of slots) {
      const key = dateKeyInBookingTz(new Date(slot.startUtc));
      const list = byDate.get(key);
      if (list) list.push(slot);
      else byDate.set(key, [slot]);
    }
    const counts = new Map<string, number>();
    byDate.forEach((list, key) => counts.set(key, list.length));
    return {
      slotsByDate: counts,
      slotsForSelectedDate: selectedDateKey ? byDate.get(selectedDateKey) ?? [] : [],
    };
  }, [slots, selectedDateKey]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  // ESC closes the modal — only when not mid-submit, to avoid losing data
  // the user just entered.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener?.('keydown', onKey);
    return () => window.removeEventListener?.('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submitting]);

  if (!open) return null;

  const isLight = theme === 'light';

  const overlayClass = isLight ? 'bg-black/40' : 'bg-black/60';
  const panelClass = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)]'
    : 'bg-[#14172d] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const closeButtonClass = isLight
    ? 'bg-black/5 text-[#14172D] hover:bg-black/10'
    : 'bg-white/8 text-[#F6F6F6] hover:bg-white/15';
  const backButtonClass = isLight
    ? 'text-[#4B5563] hover:text-[#14172D]'
    : 'text-[#CFCDE0] hover:text-white';

  const handleSubmitForm = async (input: {
    name: string;
    email: string;
    message: string;
    website: string;
  }) => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createBooking({
        name: input.name,
        email: input.email,
        message: input.message.length > 0 ? input.message : null,
        language,
        startUtc: selectedSlot.startUtc,
        website: input.website,
      });
      if (!response.success || !response.booking) {
        setSubmitError(response.error?.message ?? response.message ?? t.text('booking.error'));
        return;
      }
      setConfirmation({
        start: new Date(response.booking.startUtc),
        end: new Date(response.booking.endUtc),
        meetLink: response.booking.meetLink,
        manageUrl: response.booking.manageUrl,
      });
      setStage('success');
    } catch (err) {
      console.error('createBooking failed', err);
      setSubmitError(t.text('booking.error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Close when the backdrop is clicked. target===currentTarget guard keeps
  // clicks inside the modal from bubbling up and dismissing it.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // Centralised header — same on every step so it doesn't jump around.
  const header = (
    <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-2">
      <p
        id="booking-modal-title"
        className={`font-redDisplay font-bold text-[24px] sm:text-[28px] ${isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]'}`}
      >
        {t.text('booking.title')}
      </p>
      <p className={`mt-1 text-[14px] font-poppins ${subtleText}`}>
        {t.text('booking.subtitle')}
      </p>
      <p className={`mt-3 inline-flex items-center gap-1.5 text-[12px] font-poppins font-medium uppercase tracking-[0.08em] ${subtleText}`}>
        <Clock size={13} strokeWidth={2.2} /> {t.text('booking.duration')} · {t.text('booking.timezone')}
      </p>
    </div>
  );

  // Reusable back row — kept inline rather than a sub-component because every
  // step's "back" target differs and the markup is trivial.
  const renderBackRow = (onBack: () => void, label?: string) => (
    <button
      type="button"
      onClick={onBack}
      className={`inline-flex items-center gap-2 text-[13px] font-poppins font-medium transition-colors ${backButtonClass}`}
    >
      <ArrowLeft size={14} strokeWidth={2.2} />
      {label ?? t.text('booking.navigation.back')}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center backdrop-blur-sm ${overlayClass}`}
    >
      {/*
        Pin the modal envelope to a fixed sm+ size so navigating between
        steps doesn't pop the box to a different height. The form is the
        tallest step (~660px); we round to 680 to leave breathing room.
        On mobile we leave height auto and rely on the page's own scroll.
      */}
      <div
        className={`relative w-full sm:w-[560px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-3xl overflow-y-auto ${panelClass}`}
      >
        {/* Close button — pinned top-right */}
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          aria-label="Close"
          className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${closeButtonClass}`}
        >
          <X size={18} strokeWidth={2.2} />
        </button>

        {stage === 'success' && confirmation ? (
          <BookingSuccess
            confirmation={confirmation}
            language={language}
            theme={theme}
            t={t}
            onClose={handleClose}
          />
        ) : (
          <>
            {header}
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">
              {stage === 'date' && (
                <div className="mt-6">
                  {loadingSlots ? (
                    <div className={`flex flex-col items-center justify-center py-12 gap-3 ${subtleText}`}>
                      <Loader2 size={22} strokeWidth={2.2} className="animate-spin" />
                      <p className="text-[13px] font-poppins">{t.text('booking.loading')}</p>
                    </div>
                  ) : slotsError ? (
                    <p className="rounded-xl border border-[#dc2626]/30 bg-[#dc2626]/8 px-4 py-3 text-[13px] font-poppins text-[#dc2626]">
                      {slotsError}
                    </p>
                  ) : (
                    <BookingCalendar
                      slotsByDate={slotsByDate}
                      selectedDate={selectedDateKey}
                      onSelectDate={(key) => {
                        // Auto-advance so the user doesn't need a "continuer"
                        // button on this step.
                        setSelectedDateKey(key);
                        setSelectedSlot(null);
                        setStage('time');
                      }}
                      loading={loadingSlots}
                      language={language}
                      theme={theme}
                      t={t}
                      earliestDate={dateRange.from}
                      latestDate={dateRange.to}
                    />
                  )}
                </div>
              )}

              {stage === 'time' && selectedDateKey && (
                <TimeStep
                  slots={slotsForSelectedDate}
                  selectedDateKey={selectedDateKey}
                  language={language}
                  theme={theme}
                  t={t}
                  onBack={() => {
                    setSelectedSlot(null);
                    setStage('date');
                  }}
                  onPickSlot={(slot) => {
                    setSelectedSlot(slot);
                    setStage('form');
                  }}
                  backRow={renderBackRow}
                />
              )}

              {stage === 'form' && selectedSlot && (
                <div className="mt-6">
                  {/* BookingForm renders its own back button at the top — no
                      need to duplicate it from the parent. */}
                  <BookingForm
                    formattedSlot={formatSlotForUser(new Date(selectedSlot.startUtc), language)}
                    language={language}
                    theme={theme}
                    t={t}
                    submitting={submitting}
                    errorMessage={submitError}
                    onBack={() => setStage('time')}
                    onSubmit={handleSubmitForm}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Sub-component: time-picking step. Shown after a date is chosen.
// Single-pane (no calendar visible) so the user can only act on one thing.
// ----------------------------------------------------------------------------

interface TimeStepProps {
  slots: BookingSlot[];
  selectedDateKey: string;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  t: ReturnType<typeof useTranslations>;
  onBack: () => void;
  onPickSlot: (slot: BookingSlot) => void;
  backRow: (onBack: () => void, label?: string) => React.ReactElement;
}

const TimeStep: React.FC<TimeStepProps> = ({
  slots,
  selectedDateKey,
  language,
  theme,
  t,
  onBack,
  onPickSlot,
  backRow,
}) => {
  const isLight = theme === 'light';
  const headingClass = isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const slotInactive = isLight
    ? 'border-black/10 text-[#14172D] hover:border-[#b514fd] hover:bg-[#b514fd]/5'
    : 'border-white/10 text-[#F6F6F6] hover:border-[#b514fd] hover:bg-[#b514fd]/15';

  return (
    <div className="mt-6">
      {backRow(onBack)}

      <p className={`mt-5 font-redDisplay font-semibold text-[20px] ${headingClass}`}>
        {t.text('booking.selectTime')}
      </p>
      <p className={`mt-1 text-[13px] font-poppins capitalize ${subtleText}`}>
        {formatDayHuman(selectedDateKey, language)}
      </p>

      <div className="mt-5">
        {slots.length === 0 ? (
          <p className={`text-[13px] font-poppins ${subtleText}`}>
            {t.text('booking.info.noSlotsAvailable')}
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.startUtc}
                type="button"
                onClick={() => onPickSlot(slot)}
                className={`rounded-xl border px-3 py-2.5 text-[13px] font-poppins font-medium transition-colors ${slotInactive}`}
              >
                {formatTimeOnly(new Date(slot.startUtc), language)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Sub-component: success state shown after a successful create.
// ----------------------------------------------------------------------------

interface BookingSuccessProps {
  confirmation: {
    start: Date;
    end: Date;
    meetLink: string | null;
    manageUrl: string;
  };
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  t: ReturnType<typeof useTranslations>;
  onClose: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  confirmation,
  language,
  theme,
  t,
  onClose,
}) => {
  const isLight = theme === 'light';
  const headingClass = isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const buttonClass = isLight
    ? 'bg-[#14172D] text-white hover:opacity-90'
    : 'bg-white text-[#14172D] hover:opacity-90';
  const meetButtonClass = 'bg-[linear-gradient(135deg,#b514fd,#5f75f5)] text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] hover:opacity-90';

  const whenLabel = formatSlotForUser(confirmation.start, language);

  return (
    <div className="flex flex-col items-center text-center px-6 py-12 sm:px-12 sm:py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] shadow-[0_18px_36px_-10px_rgba(181,20,253,0.5)]">
        <CheckCircle2 size={32} strokeWidth={2.4} className="text-white" />
      </div>
      <p className={`mt-6 font-redDisplay font-bold text-[24px] sm:text-[28px] ${headingClass}`}>
        {t.text('booking.confirmation.title')}
      </p>
      <p className={`mt-2 text-[14px] sm:text-[15px] font-poppins ${subtleText}`}>
        {t.text('booking.confirmation.scheduledFor')} <span className={`font-medium ${isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]'}`}>{whenLabel}</span>.
      </p>
      <p className={`mt-3 text-[13px] font-poppins ${subtleText}`}>
        {t.text('booking.confirmation.emailSent')}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {confirmation.meetLink && (
          <a
            href={confirmation.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-poppins font-semibold transition-opacity ${meetButtonClass}`}
          >
            <Video size={16} strokeWidth={2.2} /> Google Meet
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-poppins font-semibold transition-opacity ${buttonClass}`}
        >
          {t.text('booking.navigation.back')}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
