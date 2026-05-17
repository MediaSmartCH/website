import React from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { ResolvedTheme } from 'store/slices/common/themeUtils';
import { AppLanguage } from 'config/languages';
import { SafeTranslator } from 'services/locales/safe';

interface BookingFormProps {
  formattedSlot: string;
  language: AppLanguage;
  theme: ResolvedTheme;
  t: SafeTranslator;
  submitting: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onSubmit: (payload: {
    name: string;
    email: string;
    message: string;
    website: string;
  }) => void;
}

// Last step of the booking flow: collect attendee info and submit. We keep
// the validation client-side minimal — the server re-validates everything
// anyway. We don't want to duplicate too much logic.

const BookingForm: React.FC<BookingFormProps> = ({
  formattedSlot,
  language: _language,
  theme,
  t,
  submitting,
  errorMessage,
  onBack,
  onSubmit,
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [touched, setTouched] = React.useState<{ name?: boolean; email?: boolean }>({});

  const isLight = theme === 'light';

  const nameError = touched.name && !name.trim() ? t.text('booking.validation.nameRequired') : null;
  const emailError = (() => {
    if (!touched.email) return null;
    const trimmed = email.trim();
    if (!trimmed) return t.text('booking.validation.emailRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return t.text('booking.validation.emailInvalid');
    }
    return null;
  })();

  const canSubmit =
    !submitting &&
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website: honeypot,
    });
  };

  const inputClasses = isLight
    ? 'bg-white border-black/10 text-[#14172D] placeholder:text-[#9CA3AF] focus:border-[#b514fd] focus:ring-2 focus:ring-[#b514fd]/15'
    : 'bg-[#1B1A35] border-white/10 text-[#F6F6F6] placeholder:text-[#7A7E97] focus:border-[#b514fd] focus:ring-2 focus:ring-[#b514fd]/25';

  const labelClass = isLight ? 'text-[#14172D]' : 'text-[#F6F6F6]';
  const subtleText = isLight ? 'text-[#6B7280]' : 'text-[#CFCDE0]';
  const backButtonClass = isLight
    ? 'text-[#4B5563] hover:text-[#14172D]'
    : 'text-[#CFCDE0] hover:text-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex items-center gap-2 self-start text-[13px] font-poppins font-medium transition-colors ${backButtonClass}`}
      >
        <ArrowLeft size={14} strokeWidth={2.2} />
        {t.text('booking.navigation.back')}
      </button>

      <div>
        <p className={`font-redDisplay font-semibold text-[20px] ${labelClass}`}>
          {t.text('booking.yourInformation')}
        </p>
        <p className={`mt-1 text-[13px] font-poppins ${subtleText}`}>
          {formattedSlot}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-name" className={`text-[13px] font-poppins font-medium ${labelClass}`}>
          {t.text('booking.form.fullName')}
        </label>
        <input
          id="booking-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          placeholder={t.text('booking.form.fullNamePlaceholder')}
          autoComplete="name"
          maxLength={120}
          className={`w-full rounded-xl border px-4 py-3 text-[14px] font-poppins transition-colors outline-none ${inputClasses}`}
          aria-invalid={nameError ? 'true' : 'false'}
        />
        {nameError && <p className="text-[12px] font-poppins text-[#dc2626]">{nameError}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-email" className={`text-[13px] font-poppins font-medium ${labelClass}`}>
          {t.text('booking.form.email')}
        </label>
        <input
          id="booking-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          placeholder={t.text('booking.form.emailPlaceholder')}
          autoComplete="email"
          maxLength={254}
          className={`w-full rounded-xl border px-4 py-3 text-[14px] font-poppins transition-colors outline-none ${inputClasses}`}
          aria-invalid={emailError ? 'true' : 'false'}
        />
        {emailError && <p className="text-[12px] font-poppins text-[#dc2626]">{emailError}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-message" className={`text-[13px] font-poppins font-medium ${labelClass}`}>
          {t.text('booking.form.message')}
        </label>
        <textarea
          id="booking-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.text('booking.form.messagePlaceholder')}
          rows={4}
          maxLength={2000}
          className={`w-full resize-none rounded-xl border px-4 py-3 text-[14px] font-poppins transition-colors outline-none ${inputClasses}`}
        />
      </div>

      {/* Honeypot — invisible to humans, irresistible to most bots. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {errorMessage && (
        <p className="rounded-xl border border-[#dc2626]/30 bg-[#dc2626]/8 px-4 py-3 text-[13px] font-poppins text-[#dc2626]">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b514fd,#5f75f5)] px-6 py-3.5 text-[14px] font-poppins font-semibold text-white shadow-[0_10px_24px_-6px_rgba(181,20,253,0.55)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Loader2 size={16} strokeWidth={2.4} className="animate-spin" />}
        {submitting
          ? t.text('booking.form.submitting')
          : t.text('booking.form.submitButton')}
      </button>
    </form>
  );
};

export default BookingForm;
