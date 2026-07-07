import React from 'react';

import ScopedRecaptchaProvider from 'components/common/ScopedRecaptchaProvider';
import BookingModal from './BookingModal';

interface BookingButtonProps {
  className?: string;
  text: string;
  /** Aria-label override (defaults to `text`). */
  ariaLabel?: string;
}

// Trigger + modal pair. Keeping the modal in here lets every site location
// drop a button without thinking about modal state lifting.
const BookingButton: React.FC<BookingButtonProps> = ({
  className,
  text,
  ariaLabel,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel ?? text}
        className={className}
      >
        {text}
      </button>
      {/*
        Mount reCAPTCHA only while the modal is open so the widget/script (and
        its badge) load on demand rather than on every page that renders a
        booking button. The multi-step flow gives the script ample time to be
        ready before the visitor reaches the submit step.
      */}
      {open && (
        <ScopedRecaptchaProvider>
          <BookingModal open={open} onClose={() => setOpen(false)} />
        </ScopedRecaptchaProvider>
      )}
    </>
  );
};

export default BookingButton;
