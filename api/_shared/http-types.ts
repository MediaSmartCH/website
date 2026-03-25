import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';

// Keep API handler typing local so the repo does not depend on the Vercel builder package.
export interface ApiRequest extends IncomingMessage {
  body?: Record<string, unknown>;
  headers: IncomingHttpHeaders;
  method?: string;
  query?: Record<string, string | string[]>;
}

export interface ApiResponse extends ServerResponse {
  json: (body: unknown) => void;
  send: (body: unknown) => void;
  status: (statusCode: number) => ApiResponse;
}
