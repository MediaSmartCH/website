import React from 'react';

interface BookingButtonProps {
  className?: string;
  text: string;
  /** Aria-label override (defaults to `text`). */
  ariaLabel?: string;
}

// The modal and the calendar are only ever needed once a visitor opens the
// booking flow, so they are split out of the initial bundle. Every page renders
// at least one booking button, and a static import would pull that whole
// subtree into the entry chunk.
const BookingModal = React.lazy(() => import('@features/booking/components/booking-modal'));

// Warm the chunks as soon as the visitor shows intent (hover/focus/touch) so the
// modal still opens instantly on click.
let prefetched = false;
const prefetchBookingChunks = () => {
  if (prefetched) return;
  prefetched = true;
  import('@features/booking/components/booking-modal');
};

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
        onPointerEnter={prefetchBookingChunks}
        onFocus={prefetchBookingChunks}
        onTouchStart={prefetchBookingChunks}
        aria-label={ariaLabel ?? text}
        className={className}
      >
        {text}
      </button>
      {open && (
        <React.Suspense fallback={null}>
          <BookingModal open={open} onClose={() => setOpen(false)} />
        </React.Suspense>
      )}
    </>
  );
};

export default BookingButton;
