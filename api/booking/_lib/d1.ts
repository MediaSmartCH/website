// The D1 client now lives in `api/_shared` because the security counters used
// by every endpoint (rate limits, outbound-mail quotas) need it too, not just
// the booking flow. Re-exported here so the booking modules — and the tests
// that mock this path — keep importing it from where they always have.
export * from '../../_shared/d1.js';
