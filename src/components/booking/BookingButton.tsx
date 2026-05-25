import React from 'react';

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
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default BookingButton;
