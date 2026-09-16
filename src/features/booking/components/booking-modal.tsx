import React from 'react';
import { ArrowLeft, Clock, Loader2, X } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import {
  BookingSlot,
  createBooking,
  fetchAvailability,
} from '@features/booking/api/booking-api';
import BookingCalendar from '@features/booking/components/booking-calendar';
import BookingForm from '@features/booking/components/booking-form';
import BookingSuccess from '@features/booking/components/booking-success';
import TimeStep from '@features/booking/components/booking-time-step';
import { useBookingScrollLock } from '@features/booking/hooks/use-booking-scroll-lock';
import { HORIZON_DAYS, dateKeyInBookingTz, formatHumanDate } from '@features/booking/lib/booking-formatting';

import { useAppSelector } from '@shared/hooks/store-hooks';
import { useTranslations } from '@shared/i18n/translator';
import { getRecaptchaToken } from '@shared/lib/recaptcha';
import { logger } from '@shared/lib/logger';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

// Wizard stages. Each one is a single full-width pane so the user is never
// looking at two interactive controls at once. Going back is always possible
// via the explicit "back" button on every non-initial step (or the close X).
type Stage = 'date' | 'time' | 'form' | 'success';

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose }) => {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useBookingScrollLock(open);

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
        logger.error('fetchAvailability failed', err);
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
      // reCAPTCHA v3 token — the create endpoint requires it. null means the
      // widget failed/was not ready; "" is the intentional local bypass.
      const recaptchaToken = await getRecaptchaToken(executeRecaptcha, 'booking_create');
      if (recaptchaToken === null) {
        setSubmitError(t.text('booking.error'));
        return;
      }
      const response = await createBooking({
        name: input.name,
        email: input.email,
        message: input.message.length > 0 ? input.message : null,
        language,
        startUtc: selectedSlot.startUtc,
        website: input.website,
        recaptchaToken,
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
      logger.error('createBooking failed', err);
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
  // `flex-none` keeps it pinned at the top of the flex column; only the
  // sibling content region scrolls.
  const header = (
    <div className="flex-none px-6 sm:px-10 pt-8 sm:pt-10 pb-2">
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
        steps doesn't pop the box to a different height. Layout is a flex
        column so the header stays pinned while only the content area
        scrolls when it overflows — the title and back button never get
        scrolled out of view.
      */}
      <div
        className={`relative w-full sm:w-[560px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-3xl flex flex-col ${panelClass}`}
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
            {/*
              Scrollable content region. `overscroll-contain` stops scroll
              from "chaining" to the page underneath when the user hits the
              top or bottom of this list, which felt jarring on long forms.
            */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-10 pb-6 sm:pb-8">
              {stage === 'date' && (
                <div className="mt-3">
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
                    formattedSlot={formatHumanDate(new Date(selectedSlot.startUtc), language)}
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

export default BookingModal;
