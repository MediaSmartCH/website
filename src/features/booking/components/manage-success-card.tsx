/**
 * Terminal state shown after a successful reschedule or cancellation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

import { formatHumanDate, formatTimeOnly } from '@features/booking/lib/booking-formatting';

import { useTranslations } from '@shared/i18n/translator';

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

export default SuccessCard;
