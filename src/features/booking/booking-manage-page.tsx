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

import { useAppSelector } from '@shared/hooks/store-hooks';
import { useTranslations } from '@shared/i18n/translator';
import {
  BookingDetail,
  BookingSlot,
  cancelBooking,
  fetchAvailability,
  lookupBooking,
  rescheduleBooking,
} from '@features/booking/api/booking-api';
import CancelPanel from '@features/booking/components/cancel-panel';
import ManageShell from '@features/booking/components/manage-shell';
import ReschedulePanel from '@features/booking/components/reschedule-panel';
import SuccessCard from '@features/booking/components/manage-success-card';
import {
  BOOKING_TIMEZONE,
  HORIZON_DAYS,
  formatHumanDate,
  formatTimeOnly,
} from '@features/booking/lib/booking-formatting';


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

export default BookingManagePage;
