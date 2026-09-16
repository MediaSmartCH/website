import { fetchWithDeployment } from '@shared/lib/fetch-with-deployment';

export interface BookingSlot {
  startUtc: string;
  endUtc: string;
}

export interface AvailabilityResponse {
  success: boolean;
  slots: BookingSlot[];
  generatedAt: string;
}

export interface CreateBookingPayload {
  name: string;
  email: string;
  message: string | null;
  language: 'fr' | 'en';
  startUtc: string;
  /** Honeypot: must be left empty by a real human. */
  website?: string;
  /** reCAPTCHA v3 token (action `booking_create`); "" when bypassed locally. */
  recaptchaToken?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  booking?: {
    id: string;
    startUtc: string;
    endUtc: string;
    meetLink: string | null;
    manageUrl: string;
    cancelUrl: string;
  };
  error?: { field: string; code: string; message: string };
  message?: string;
}

// Wraps the booking API endpoints. We keep them in one module so the modal
// component stays thin and so changes to error handling / URL prefixes ripple
// in one place.

function toIsoDate(date: Date): string {
  // We send UTC ISO timestamps so the backend never has to guess the timezone.
  return date.toISOString().slice(0, 10);
}

/**
 * How long a visitor may be left watching the calendar spinner.
 *
 * Availability is computed from a live Google Calendar call, which has no
 * deadline of its own: a slow or unreachable calendar used to leave the modal
 * spinning for as long as the platform allowed. Matches the contact form.
 */
const AVAILABILITY_TIMEOUT_MS = 10_000;

/**
 * Loads the bookable slots between two dates.
 *
 * Rejects with an `AbortError` when the caller's own signal fires — the modal
 * relies on that to tell "the visitor closed me" apart from a real failure — and
 * with `availability_timeout` when the request simply took too long.
 */
export async function fetchAvailability(
  from: Date,
  to: Date,
  signal?: AbortSignal,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({
    from: toIsoDate(from),
    to: toIsoDate(to),
  });

  const controller = new AbortController();
  const abortForCaller = () => controller.abort();
  if (signal?.aborted) abortForCaller();
  signal?.addEventListener('abort', abortForCaller);

  let timedOut = false;
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, AVAILABILITY_TIMEOUT_MS);

  try {
    const response = await fetchWithDeployment(
      `/api/booking/availability?${params.toString()}`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      throw new Error(`availability_${response.status}`);
    }
    return (await response.json()) as AvailabilityResponse;
  } catch (error) {
    // Our own deadline is a failure to report, not a cancellation to swallow.
    if (timedOut) throw new Error('availability_timeout');
    throw error;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', abortForCaller);
  }
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  const response = await fetchWithDeployment('/api/booking/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as CreateBookingResponse;
  if (!response.ok && !data.error) {
    return {
      success: false,
      message: data.message ?? `create_${response.status}`,
    };
  }
  return data;
}

export interface BookingDetail {
  id: string;
  attendeeName: string;
  attendeeEmail: string;
  message: string | null;
  language: 'fr' | 'en';
  startUtc: string;
  endUtc: string;
  status: 'confirmed' | 'cancelled';
}

export interface LookupResponse {
  success: boolean;
  booking?: BookingDetail;
  message?: string;
  /** HTTP status if the request was rejected; 200/201 otherwise. */
  status: number;
}

export async function lookupBooking(
  id: string,
  token: string,
  signal?: AbortSignal,
): Promise<LookupResponse> {
  const params = new URLSearchParams({ id, token });
  const response = await fetchWithDeployment(
    `/api/booking/lookup?${params.toString()}`,
    { signal },
  );
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    booking?: BookingDetail;
    message?: string;
  };
  return {
    success: !!data.success,
    booking: data.booking,
    message: data.message,
    status: response.status,
  };
}

export interface MutationResponse {
  success: boolean;
  message?: string;
  status: number;
}

export async function cancelBooking(
  id: string,
  token: string,
  reason: string | null,
): Promise<MutationResponse> {
  const response = await fetchWithDeployment('/api/booking/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, token, reason }),
  });
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };
  return {
    success: !!data.success,
    message: data.message,
    status: response.status,
  };
}

export interface RescheduleResponse extends MutationResponse {
  booking?: {
    id: string;
    startUtc: string;
    endUtc: string;
    manageUrl: string;
    cancelUrl: string;
  };
}

export async function rescheduleBooking(
  id: string,
  token: string,
  startUtc: string,
): Promise<RescheduleResponse> {
  const response = await fetchWithDeployment('/api/booking/reschedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, token, startUtc }),
  });
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    booking?: RescheduleResponse['booking'];
    message?: string;
  };
  return {
    success: !!data.success,
    booking: data.booking,
    message: data.message,
    status: response.status,
  };
}
