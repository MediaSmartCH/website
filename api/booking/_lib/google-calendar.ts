import { getRuntimeEnv } from './config';

// Thin wrapper around the Google Calendar v3 REST API. We avoid pulling the
// `googleapis` package (heavy, slow cold-start) and stay on direct `fetch`
// with manual refresh-token handling. A single-user refresh token is enough
// because the calendar is always the booking owner's, never the visitor's.

interface AccessTokenCacheEntry {
  token: string;
  expiresAt: number;
}

const globalCache = globalThis as typeof globalThis & {
  __mediaSmartGoogleAccessToken?: AccessTokenCacheEntry;
};

export class GoogleCalendarError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GoogleCalendarError';
  }
}

async function getAccessToken(): Promise<string> {
  const cached = globalCache.__mediaSmartGoogleAccessToken;
  // Keep a 60s safety margin so a slow request doesn't expire mid-call.
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const env = getRuntimeEnv();
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    refresh_token: env.googleRefreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new GoogleCalendarError(
      `Google OAuth refresh failed (${response.status}): ${body.slice(0, 300)}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new GoogleCalendarError('Google OAuth response missing access_token');
  }

  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  globalCache.__mediaSmartGoogleAccessToken = {
    token: data.access_token,
    expiresAt,
  };
  return data.access_token;
}

interface BusyInterval {
  start: Date;
  end: Date;
}

// Wraps Calendar.freebusy.query to return busy intervals merged across
// however many calendars we're checking. For now we only check one (the
// booking owner's primary calendar), but the array shape keeps the door open
// for multi-calendar setups without breaking callers.
export async function getBusyIntervals(
  rangeStart: Date,
  rangeEnd: Date,
): Promise<BusyInterval[]> {
  const env = getRuntimeEnv();
  const accessToken = await getAccessToken();

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/freeBusy',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: rangeStart.toISOString(),
        timeMax: rangeEnd.toISOString(),
        timeZone: 'UTC',
        items: [{ id: env.googleCalendarId }],
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new GoogleCalendarError(
      `Calendar freeBusy failed (${response.status}): ${body.slice(0, 300)}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
  };

  const busy = data.calendars?.[env.googleCalendarId]?.busy ?? [];
  return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

export interface CreateEventInput {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  timeZone: string;
  attendeeName: string;
  attendeeEmail: string;
}

export interface CalendarEvent {
  id: string;
  htmlLink?: string;
  meetLink?: string;
}

export async function createEvent(input: CreateEventInput): Promise<CalendarEvent> {
  const env = getRuntimeEnv();
  const accessToken = await getAccessToken();

  // sendUpdates=none: we send our own branded confirmation via Resend, we don't
  // want Google sending a generic invite too.
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.googleCalendarId)}/events?sendUpdates=none&conferenceDataVersion=1`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.start.toISOString(), timeZone: input.timeZone },
      end: { dateTime: input.end.toISOString(), timeZone: input.timeZone },
      attendees: [
        { email: input.attendeeEmail, displayName: input.attendeeName },
      ],
      // Auto-create a Google Meet link so both parties have a join URL without
      // anyone having to set one up manually.
      conferenceData: {
        createRequest: {
          requestId: `mediasmart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: { useDefault: true },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new GoogleCalendarError(
      `Calendar event create failed (${response.status}): ${body.slice(0, 300)}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    id?: string;
    htmlLink?: string;
    hangoutLink?: string;
  };
  if (!data.id) {
    throw new GoogleCalendarError('Calendar event response missing id');
  }
  return {
    id: data.id,
    htmlLink: data.htmlLink,
    meetLink: data.hangoutLink,
  };
}

export async function deleteEvent(eventId: string): Promise<void> {
  const env = getRuntimeEnv();
  const accessToken = await getAccessToken();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.googleCalendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  // 410 Gone: the event was already deleted upstream; idempotent from our POV.
  if (!response.ok && response.status !== 410) {
    const body = await response.text().catch(() => '');
    throw new GoogleCalendarError(
      `Calendar event delete failed (${response.status}): ${body.slice(0, 300)}`,
      response.status,
    );
  }
}

export async function updateEventTime(
  eventId: string,
  start: Date,
  end: Date,
  timeZone: string,
): Promise<void> {
  const env = getRuntimeEnv();
  const accessToken = await getAccessToken();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.googleCalendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: { dateTime: start.toISOString(), timeZone },
      end: { dateTime: end.toISOString(), timeZone },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new GoogleCalendarError(
      `Calendar event update failed (${response.status}): ${body.slice(0, 300)}`,
      response.status,
    );
  }
}
