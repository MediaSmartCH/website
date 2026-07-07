import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Mail,
  XCircle,
} from 'lucide-react';

import { useAppSelector } from 'services/hooks/hooks';
import { useTranslations } from 'services/locales/safe';
import {
  BookingDetail,
  BookingSlot,
  cancelBooking,
  fetchAvailability,
  lookupBooking,
  rescheduleBooking,
} from 'services/api/booking';
import BookingCalendar from 'components/booking/BookingCalendar';

const BOOKING_TIMEZONE = 'Europe/Zurich';
const HORIZON_DAYS = 28;

type ViewMode = 'overview' | 'reschedule' | 'cancel';

interface ConfirmationState {
  kind: 'rescheduled' | 'cancelled';
  /** Used by the rescheduled state to render the new time inline. */
  newStartUtc?: string;
}

// `?id=&token=` are required. `?action=cancel` makes the page open straight on
// the cancel-confirm screen instead of the overview — that's what the
// "cancel" link in the email points to.

const BookingManagePage: React.FC = () => {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const token = searchParams.get('token') ?? '';
  const initialAction = searchParams.get('action');

  const [booking, setBooking] = React.useState<BookingDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);
  const [view, setView] = React.useState<ViewMode>(
    initialAction === 'cancel' ? 'cancel' : 'overview',
  );
  const [confirmation, setConfirmation] = React.useState<ConfirmationState | null>(null);

  // Lookup the booking on mount. The token verifies authenticity; without
  // a matching token the API responds 403 and we render the "not found"
  // panel — same UX for both, no need to distinguish 403 from 404 here.
  React.useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      setErrorStatus(400);
      return;
    }
    const controller = new AbortController();
    lookupBooking(id, token, controller.signal)
      .then((res) => {
        if (!res.success || !res.booking) {
          setErrorStatus(res.status);
        } else {
          setBooking(res.booking);
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('lookupBooking failed', err);
        setErrorStatus(500);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, token]);

  const isLight = theme === 'light';
  const surface = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]'
    : 'bg-[#1B1A35] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]';
  const subtle = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';

  if (loading) {
    return (
      <ManageShell theme={theme}>
        <div className={`rounded-3xl p-10 sm:p-12 ${surface} flex flex-col items-center gap-3 text-center`}>
          <Loader2 size={28} strokeWidth={2.2} className={`animate-spin ${subtle}`} />
          <p className={`font-poppins text-[14px] ${subtle}`}>{t.text('booking.manage.loading')}</p>
        </div>
      </ManageShell>
    );
  }

  if (errorStatus !== null || !booking) {
    return (
      <ManageShell theme={theme}>
        <div className={`rounded-3xl p-10 sm:p-12 ${surface} flex flex-col items-center text-center`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dc2626]/10">
            <AlertCircle size={26} strokeWidth={2.2} className="text-[#dc2626]" />
          </div>
          <p className="mt-5 font-redDisplay font-bold text-[22px] sm:text-[26px]">
            {t.text('booking.manage.notFound')}
          </p>
          <p className={`mt-2 font-poppins text-[14px] ${subtle}`}>
            {t.text('booking.manage.notFoundDescription')}
          </p>
          <Link
            to={`/${language}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-5 py-3 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
            {t.text('booking.manage.backHome')}
          </Link>
        </div>
      </ManageShell>
    );
  }

  // The success screens get their own short-circuit. We keep the booking in
  // state so the "what changed" details remain accurate even if the visitor
  // navigates back/forward in the browser.
  if (confirmation?.kind === 'cancelled') {
    return (
      <ManageShell theme={theme}>
        <SuccessCard
          theme={theme}
          icon="cancelled"
          title={t.text('booking.manage.cancel.successTitle')}
          description={t.text('booking.manage.cancel.successDescription')}
          ctaLabel={t.text('booking.manage.bookAgain')}
          ctaHref={`/${language}`}
        />
      </ManageShell>
    );
  }

  if (confirmation?.kind === 'rescheduled') {
    return (
      <ManageShell theme={theme}>
        <SuccessCard
          theme={theme}
          icon="success"
          title={t.text('booking.manage.reschedule.successTitle')}
          description={t.text('booking.manage.reschedule.successDescription')}
          ctaLabel={t.text('booking.manage.backHome')}
          ctaHref={`/${language}`}
          extra={
            confirmation.newStartUtc ? (
              <p className={`mt-3 font-poppins text-[14px] ${subtle}`}>
                {formatHumanDate(new Date(confirmation.newStartUtc), language)}
              </p>
            ) : null
          }
        />
      </ManageShell>
    );
  }

  // Bookings already cancelled get a permanent terminal panel.
  if (booking.status === 'cancelled') {
    return (
      <ManageShell theme={theme}>
        <div className={`rounded-3xl p-10 sm:p-12 ${surface} flex flex-col items-center text-center`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dc2626]/10">
            <XCircle size={26} strokeWidth={2.2} className="text-[#dc2626]" />
          </div>
          <p className="mt-5 font-redDisplay font-bold text-[22px] sm:text-[26px]">
            {t.text('booking.manage.statusCancelled')}
          </p>
          <p className={`mt-2 font-poppins text-[14px] ${subtle}`}>
            {t.text('booking.manage.statusCancelledDescription')}
          </p>
          <Link
            to={`/${language}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-5 py-3 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90"
          >
            {t.text('booking.manage.bookAgain')}
          </Link>
        </div>
      </ManageShell>
    );
  }

  if (view === 'reschedule') {
    return (
      <ManageShell theme={theme}>
        <ReschedulePanel
          booking={booking}
          language={language}
          theme={theme}
          t={t}
          onBack={() => setView('overview')}
          onSuccess={(newStartUtc) =>
            setConfirmation({ kind: 'rescheduled', newStartUtc })
          }
          token={token}
        />
      </ManageShell>
    );
  }

  if (view === 'cancel') {
    return (
      <ManageShell theme={theme}>
        <CancelPanel
          booking={booking}
          language={language}
          theme={theme}
          t={t}
          token={token}
          onBack={() => setView('overview')}
          onSuccess={() => setConfirmation({ kind: 'cancelled' })}
        />
      </ManageShell>
    );
  }

  // Overview --------------------------------------------------------------
  return (
    <ManageShell theme={theme}>
      <div className={`rounded-3xl p-8 sm:p-10 ${surface}`}>
        <p className="font-redDisplay font-bold text-[22px] sm:text-[28px]">
          {t.text('booking.manage.title')}
        </p>

        <div className={`mt-6 rounded-2xl border ${isLight ? 'border-black/8 bg-[#F7F8FF]' : 'border-white/8 bg-white/5'} p-5`}>
          <p className={`text-[12px] font-poppins uppercase tracking-[0.08em] ${subtle}`}>
            {t.text('booking.manage.scheduledFor')}
          </p>
          <p className="mt-1 font-redDisplay font-semibold text-[18px] sm:text-[20px] capitalize">
            {formatHumanDate(new Date(booking.startUtc), language)}
          </p>
          <p className={`mt-3 inline-flex items-center gap-2 text-[13px] font-poppins ${subtle}`}>
            <Mail size={14} strokeWidth={2.2} />
            {booking.attendeeName} · {booking.attendeeEmail}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setView('reschedule')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-5 py-3 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90"
          >
            <CalendarClock size={16} strokeWidth={2.2} />
            {t.text('booking.manage.actions.reschedule')}
          </button>
          <button
            type="button"
            onClick={() => setView('cancel')}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[14px] font-poppins font-semibold transition-colors ${
              isLight
                ? 'border-[#dc2626]/30 text-[#dc2626] hover:bg-[#dc2626]/8'
                : 'border-[#ff6b6b]/40 text-[#ff8888] hover:bg-[#ff6b6b]/12'
            }`}
          >
            <XCircle size={16} strokeWidth={2.2} />
            {t.text('booking.manage.actions.cancel')}
          </button>
        </div>
      </div>
    </ManageShell>
  );
};

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

interface ShellProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
}

const ManageShell: React.FC<ShellProps> = ({ children, theme }) => {
  const isLight = theme === 'light';
  return (
    <div
      className={`min-h-[calc(100vh-200px)] py-12 px-5 sm:px-8 ${isLight ? 'bg-[#F6F6F6]' : 'bg-[#0F0E22]'}`}
    >
      {/*
        The manage link carries the booking id + token in the URL. Suppress the
        Referer entirely on this page so the token never leaks to any resource
        the page loads.
      */}
      <Helmet>
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <div className="mx-auto max-w-[640px]">{children}</div>
    </div>
  );
};

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

interface CancelPanelProps {
  booking: BookingDetail;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  t: ReturnType<typeof useTranslations>;
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

const CancelPanel: React.FC<CancelPanelProps> = ({
  booking,
  language,
  theme,
  t,
  token,
  onBack,
  onSuccess,
}) => {
  const [reason, setReason] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const isLight = theme === 'light';
  const surface = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]'
    : 'bg-[#1B1A35] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]';
  const subtle = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const inputClass = isLight
    ? 'bg-white border-black/10 text-[#14172D] placeholder:text-[#9CA3AF] focus:border-[#b514fd] focus:ring-2 focus:ring-[#b514fd]/15'
    : 'bg-[#1B1A35] border-white/10 text-[#F6F6F6] placeholder:text-[#7A7E97] focus:border-[#b514fd] focus:ring-2 focus:ring-[#b514fd]/25';
  const backClass = isLight ? 'text-[#4B5563] hover:text-[#14172D]' : 'text-[#CFCDE0] hover:text-white';
  const keepClass = isLight
    ? 'border-black/10 text-[#14172D] hover:bg-black/5'
    : 'border-white/10 text-[#F6F6F6] hover:bg-white/10';

  const handleCancel = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await cancelBooking(
        booking.id,
        token,
        reason.trim().length > 0 ? reason.trim() : null,
      );
      if (!res.success) {
        setSubmitError(res.message ?? t.text('booking.error'));
        return;
      }
      onSuccess();
    } catch (err) {
      console.error('cancelBooking failed', err);
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
        {t.text('booking.manage.cancel.confirmTitle')}
      </p>
      <p className={`mt-2 font-poppins text-[14px] ${subtle}`}>
        {formatHumanDate(new Date(booking.startUtc), language)}
      </p>
      <p className={`mt-3 font-poppins text-[14px] ${subtle}`}>
        {t.text('booking.manage.cancel.confirmDescription')}
      </p>

      <div className="mt-5 flex flex-col gap-1.5">
        <label htmlFor="cancel-reason" className="text-[13px] font-poppins font-medium">
          {t.text('booking.manage.cancel.reasonLabel')}
        </label>
        <textarea
          id="cancel-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t.text('booking.manage.cancel.reasonPlaceholder')}
          rows={4}
          maxLength={500}
          className={`w-full resize-none rounded-xl border px-4 py-3 text-[14px] font-poppins outline-none transition-colors ${inputClass}`}
        />
      </div>

      {submitError && (
        <p className="mt-4 rounded-xl border border-[#dc2626]/30 bg-[#dc2626]/8 px-4 py-3 text-[13px] font-poppins text-[#dc2626]">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dc2626] px-5 py-3 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(220,38,38,0.45)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 size={16} strokeWidth={2.4} className="animate-spin" />}
          {submitting
            ? t.text('booking.manage.cancel.cancelling')
            : t.text('booking.manage.cancel.confirmButton')}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-[14px] font-poppins font-semibold transition-colors disabled:opacity-50 ${keepClass}`}
        >
          {t.text('booking.manage.cancel.keepButton')}
        </button>
      </div>
    </div>
  );
};

interface SuccessCardProps {
  theme: 'light' | 'dark';
  icon: 'success' | 'cancelled';
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  extra?: React.ReactNode;
}

const SuccessCard: React.FC<SuccessCardProps> = ({
  theme,
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  extra,
}) => {
  const isLight = theme === 'light';
  const surface = isLight
    ? 'bg-white text-[#14172D] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]'
    : 'bg-[#1B1A35] text-[#F6F6F6] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]';
  const subtle = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';

  return (
    <div className={`rounded-3xl p-10 sm:p-12 ${surface} flex flex-col items-center text-center`}>
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          icon === 'success'
            ? 'bg-[linear-gradient(135deg,#b514fd,#5f75f5)] shadow-[0_18px_36px_-10px_rgba(181,20,253,0.5)]'
            : 'bg-[#dc2626]/12'
        }`}
      >
        {icon === 'success' ? (
          <CheckCircle2 size={32} strokeWidth={2.4} className="text-white" />
        ) : (
          <XCircle size={32} strokeWidth={2.4} className="text-[#dc2626]" />
        )}
      </div>
      <p className="mt-6 font-redDisplay font-bold text-[22px] sm:text-[26px]">{title}</p>
      <p className={`mt-2 font-poppins text-[14px] ${subtle}`}>{description}</p>
      {extra}
      <Link
        to={ctaHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-5 py-3 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Date helpers
// ----------------------------------------------------------------------------

function formatHumanDate(date: Date, language: 'fr' | 'en'): string {
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

function formatTimeOnly(date: Date, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default BookingManagePage;
