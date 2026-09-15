/**
 * Second step of the booking modal: the times available on the chosen day.
 */

import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

import { BookingSlot } from '@features/booking/api/booking-api';
import { formatDayHuman, formatTimeOnly } from '@features/booking/lib/booking-formatting';
import { useTranslations } from '@shared/i18n/translator';

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

export default TimeStep;
