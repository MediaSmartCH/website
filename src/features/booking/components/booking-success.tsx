/**
 * Final step of the booking modal: confirmation, meeting link and manage link.
 */

import React from 'react';
import { CheckCircle2, Video } from 'lucide-react';

import { formatHumanDate } from '@features/booking/lib/booking-formatting';

import { useTranslations } from '@shared/i18n/translator';

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

  const whenLabel = formatHumanDate(confirmation.start, language);

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

export default BookingSuccess;
