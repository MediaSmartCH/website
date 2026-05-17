import { fetchWithDeployment } from './fetchWithDeployment';

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

export async function fetchAvailability(
  from: Date,
  to: Date,
  signal?: AbortSignal,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({
    from: toIsoDate(from),
    to: toIsoDate(to),
  });
  const response = await fetchWithDeployment(
    `/api/booking/availability?${params.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`availability_${response.status}`);
  }
  return (await response.json()) as AvailabilityResponse;
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
