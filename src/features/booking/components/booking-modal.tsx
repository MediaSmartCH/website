import React from 'react';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
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

import ModalShell from '@shared/components/modal-shell';
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

  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
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

  // The duration + timezone line sits under the shell's title block, which
  // already renders the heading, the subtitle and the locale controls.
  const durationLine = (
    <p className={`mt-3 inline-flex items-center gap-1.5 text-[12px] font-poppins font-medium uppercase tracking-[0.08em] ${subtleText}`}>
      <Clock size={13} strokeWidth={2.2} /> {t.text('booking.duration')} · {t.text('booking.timezone')}
    </p>
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
    <ModalShell
      titleId="booking-modal-title"
      title={t.text('booking.title')}
      subtitle={t.text('booking.subtitle')}
      headerFooter={durationLine}
      closeLabel={t.text('booking.navigation.close')}
      closeDisabled={submitting}
      onClose={handleClose}
      bodyClassName="sm:min-h-[460px]"
    >
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
          {stage === 'date' && (
            <div>
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
            <div className="mt-2">
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
        </>
      )}
    </ModalShell>
  );
};

export default BookingModal;
