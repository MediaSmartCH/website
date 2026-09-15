/**
 * Cancellation confirmation, with the optional reason passed on to the API.
 */

import React from 'react';
import { AlertCircle, ArrowLeft, Loader2, XCircle } from 'lucide-react';

import { BookingDetail, cancelBooking } from '@features/booking/api/booking-api';
import { formatHumanDate, formatTimeOnly } from '@features/booking/lib/booking-formatting';
import { useTranslations } from '@shared/i18n/translator';

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

export default CancelPanel;
