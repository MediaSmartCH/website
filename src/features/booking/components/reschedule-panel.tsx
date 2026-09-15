/**
 * Reschedule flow: loads availability, lets the visitor pick a new slot, and submits it.
 *
 * The booking's own slot stays selectable — the server filters it out of the busy
 * set — so moving by half an hour does not collide with itself.
 */

import React from 'react';
import { AlertCircle, ArrowLeft, CalendarClock, Loader2 } from 'lucide-react';

import BookingCalendar from '@features/booking/components/booking-calendar';
import {
  BookingDetail,
  BookingSlot,
  fetchAvailability,
  rescheduleBooking,
} from '@features/booking/api/booking-api';
import {
  BOOKING_TIMEZONE,
  HORIZON_DAYS,
  formatHumanDate,
  formatTimeOnly,
} from '@features/booking/lib/booking-formatting';
import { useTranslations } from '@shared/i18n/translator';

interface ReschedulePanelProps {
  booking: BookingDetail;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  t: ReturnType<typeof useTranslations>;
  token: string;
  onBack: () => void;
  onSuccess: (newStartUtc: string) => void;
}

const ReschedulePanel: React.FC<ReschedulePanelProps> = ({
  booking,
  language,
  theme,
  t,
  token,
  onBack,
  onSuccess,
}) => {
  const [slots, setSlots] = React.useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(true);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<BookingSlot | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const dateRange = React.useMemo(() => {
    const earliest = new Date();
    const latest = new Date(earliest.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000);
    return { from: earliest, to: latest };
  }, []);

  React.useEffect(() => {
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
        console.error('reschedule fetchAvailability failed', err);
        setSlotsError(t.text('booking.error'));
      })
      .finally(() => setLoadingSlots(false));
    return () => controller.abort();
  }, [dateRange.from, dateRange.to, t]);

  const { slotsByDate, slotsForSelectedDate } = React.useMemo(() => {
    const byDate = new Map<string, BookingSlot[]>();
    for (const slot of slots) {
      const key = new Intl.DateTimeFormat('en-CA', {
        timeZone: BOOKING_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(slot.startUtc));
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

  const isLight = theme === 'light';
  const surface = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]'
    : 'bg-[#1B1A35] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]';
  const subtle = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const backClass = isLight ? 'text-[#4B5563] hover:text-[#14172D]' : 'text-[#CFCDE0] hover:text-white';
  const slotInactive = isLight
    ? 'border-black/10 text-[#14172D] hover:border-[#b514fd] hover:bg-[#b514fd]/5'
    : 'border-white/10 text-[#F6F6F6] hover:border-[#b514fd] hover:bg-[#b514fd]/15';
  const slotActive =
    'border-transparent bg-[linear-gradient(135deg,#b514fd,#5f75f5)] text-white shadow-[0_8px_20px_-6px_rgba(181,20,253,0.55)]';

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await rescheduleBooking(booking.id, token, selectedSlot.startUtc);
      if (!res.success) {
        setSubmitError(res.message ?? t.text('booking.error'));
        return;
      }
      onSuccess(res.booking?.startUtc ?? selectedSlot.startUtc);
    } catch (err) {
      console.error('rescheduleBooking failed', err);
      setSubmitError(t.text('booking.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 ${surface}`}>
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex items-center gap-2 text-[13px] font-poppins font-medium transition-colors ${backClass}`}
      >
        <ArrowLeft size={14} strokeWidth={2.2} />
        {t.text('booking.navigation.back')}
      </button>

      <p className="mt-4 font-redDisplay font-bold text-[22px] sm:text-[26px]">
        {t.text('booking.manage.reschedule.title')}
      </p>
      <p className={`mt-1 font-poppins text-[13px] ${subtle}`}>
        {formatHumanDate(new Date(booking.startUtc), language)} →
      </p>

      <div className="mt-6">
        {loadingSlots ? (
          <div className={`flex flex-col items-center justify-center py-10 gap-3 ${subtle}`}>
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

      {selectedDateKey && slotsForSelectedDate.length > 0 && (
        <div className="mt-6">
          <p className={`text-[12px] font-poppins uppercase tracking-[0.08em] ${subtle}`}>
            {t.text('booking.selectTime')}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {slotsForSelectedDate.map((slot) => {
              const isSelected = selectedSlot?.startUtc === slot.startUtc;
              return (
                <button
                  key={slot.startUtc}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-[13px] font-poppins font-medium transition-colors ${
                    isSelected ? slotActive : slotInactive
                  }`}
                >
                  {formatTimeOnly(new Date(slot.startUtc), language)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {submitError && (
        <p className="mt-5 rounded-xl border border-[#dc2626]/30 bg-[#dc2626]/8 px-4 py-3 text-[13px] font-poppins text-[#dc2626]">
          {submitError}
        </p>
      )}

      {selectedSlot && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-6 py-3.5 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 size={16} strokeWidth={2.4} className="animate-spin" />}
          {submitting
            ? t.text('booking.manage.reschedule.submitting')
            : t.text('booking.manage.reschedule.submit')}
        </button>
      )}
    </div>
  );
};

export default ReschedulePanel;
