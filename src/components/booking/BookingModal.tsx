import React from 'react';
import { CheckCircle2, Clock, Loader2, Video, X } from 'lucide-react';

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

type Stage = 'picking' | 'form' | 'success';

const BOOKING_TIMEZONE = 'Europe/Zurich';

// 28 days of horizon matches the backend constant. We keep them in sync by
// reading the constant from the API responses' first/last slots; this client
// constant is the conservative default the calendar opens at.
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

function formatSlotTimeOnly(date: Date, language: 'fr' | 'en'): string {
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

  const [stage, setStage] = React.useState<Stage>('picking');
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
    setStage('picking');
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

  // Pre-compute per-day slot index for the calendar (which days have slots)
  // and per-day slot list (which time options to show in the right pane).
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

  // Color tokens for the panels. Light side stays mostly white with subtle
  // shadows; dark side is the same navy family used by the rest of the site.
  const overlayClass = isLight ? 'bg-black/40' : 'bg-black/60';
  const panelClass = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)]'
    : 'bg-[#14172d] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]';
  const dividerClass = isLight ? 'lg:border-l lg:border-black/8' : 'lg:border-l lg:border-white/8';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const closeButtonClass = isLight
    ? 'bg-black/5 text-[#14172D] hover:bg-black/10'
    : 'bg-white/8 text-[#F6F6F6] hover:bg-white/15';

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className={`fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center backdrop-blur-sm ${overlayClass}`}
    >
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      <div
        className={`relative w-full sm:max-w-[920px] sm:max-h-[90vh] sm:rounded-3xl overflow-y-auto ${panelClass}`}
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
            {/* Left pane — context + calendar */}
            <div className="p-6 sm:p-8 lg:p-10">
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

              <div className="mt-6">
                {loadingSlots ? (
                  <div className={`flex flex-col items-center justify-center py-12 gap-3 ${subtleText}`}>
                    <Loader2 size={22} strokeWidth={2.2} className="animate-spin" />
                    <p className="text-[13px] font-poppins">{t.text('booking.loading')}</p>
                  </div>
                ) : slotsError ? (
                  <p className={`rounded-xl border border-[#dc2626]/30 bg-[#dc2626]/8 px-4 py-3 text-[13px] font-poppins text-[#dc2626]`}>
                    {slotsError}
                  </p>
                ) : (
                  <BookingCalendar
                    slotsByDate={slotsByDate}
                    selectedDate={selectedDateKey}
                    onSelectDate={(key) => {
                      setSelectedDateKey(key);
                      setSelectedSlot(null);
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
            </div>

            {/* Right pane — slots OR form, depending on stage */}
            <div className={`p-6 sm:p-8 lg:p-10 ${dividerClass}`}>
              {stage === 'picking' && (
                <SlotsPane
                  slots={slotsForSelectedDate}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                  onContinue={() => setStage('form')}
                  selectedDateKey={selectedDateKey}
                  language={language}
                  theme={theme}
                  t={t}
                />
              )}
              {stage === 'form' && selectedSlot && (
                <BookingForm
                  formattedSlot={formatSlotForUser(new Date(selectedSlot.startUtc), language)}
                  language={language}
                  theme={theme}
                  t={t}
                  submitting={submitting}
                  errorMessage={submitError}
                  onBack={() => setStage('picking')}
                  onSubmit={handleSubmitForm}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Sub-component: right-side pane during the "picking" stage.
// Shows the day's slot grid, or a placeholder when no date is selected yet.
// ----------------------------------------------------------------------------

interface SlotsPaneProps {
  slots: BookingSlot[];
  selectedSlot: BookingSlot | null;
  onSelectSlot: (slot: BookingSlot) => void;
  onContinue: () => void;
  selectedDateKey: string | null;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  t: ReturnType<typeof useTranslations>;
}

const SlotsPane: React.FC<SlotsPaneProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  onContinue,
  selectedDateKey,
  language,
  theme,
  t,
}) => {
  const isLight = theme === 'light';
  const headingClass = isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const slotInactive = isLight
    ? 'border-black/10 text-[#14172D] hover:border-[#b514fd] hover:bg-[#b514fd]/5'
    : 'border-white/10 text-[#F6F6F6] hover:border-[#b514fd] hover:bg-[#b514fd]/15';
  const slotActive =
    'border-transparent bg-[linear-gradient(135deg,#b514fd,#5f75f5)] text-white shadow-[0_8px_20px_-6px_rgba(181,20,253,0.55)]';

  return (
    <div className="flex h-full flex-col">
      <p className={`font-redDisplay font-semibold text-[20px] ${headingClass}`}>
        {selectedDateKey ? t.text('booking.selectTime') : t.text('booking.selectDate')}
      </p>
      {selectedDateKey && (
        <p className={`mt-1 text-[13px] font-poppins ${subtleText}`}>
          {new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
            timeZone: 'Europe/Zurich',
            weekday: 'long',
            day: '2-digit',
            month: 'long',
          }).format(new Date(`${selectedDateKey}T12:00:00Z`))}
        </p>
      )}

      <div className="mt-5 flex-1 overflow-y-auto pr-1">
        {!selectedDateKey ? (
          <p className={`text-[13px] font-poppins ${subtleText}`}>
            {t.text('booking.info.selectDateFirst')}
          </p>
        ) : slots.length === 0 ? (
          <p className={`text-[13px] font-poppins ${subtleText}`}>
            {t.text('booking.info.noSlotsAvailable')}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.startUtc === slot.startUtc;
              return (
                <button
                  key={slot.startUtc}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-[13px] font-poppins font-medium transition-colors ${isSelected ? slotActive : slotInactive}`}
                >
                  {formatSlotTimeOnly(new Date(slot.startUtc), language)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedSlot && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-6 py-3.5 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90"
        >
          {t.text('booking.navigation.continue')}
        </button>
      )}
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
