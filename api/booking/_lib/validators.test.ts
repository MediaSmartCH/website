import { describe, it, expect } from 'vitest';

import { parseAvailabilityRange, validateCreatePayload } from './validators.js';

// Characterisation tests: they pin the validators' current contract (accepted
// shapes, normalisation, and the exact field/code pairs returned on failure)
// so refactoring cannot silently loosen or tighten booking validation.

const validPayload = {
  name: 'Ada Lovelace',
  email: 'Ada@Example.COM',
  message: '  Hello  ',
  language: 'FR',
  startUtc: '2027-02-15T08:00:00.000Z',
};

describe('validateCreatePayload — accepted input', () => {
  it('normalises name, email, message and language', () => {
    const result = validateCreatePayload({ ...validPayload });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.name).toBe('Ada Lovelace');
    expect(result.value.email).toBe('ada@example.com');
    expect(result.value.message).toBe('Hello');
    expect(result.value.language).toBe('fr');
    expect(result.value.startUtc.toISOString()).toBe('2027-02-15T08:00:00.000Z');
  });

  it('accepts a missing message and reports it as null', () => {
    const result = validateCreatePayload({ ...validPayload, message: undefined });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.message).toBeNull();
  });

  it('carries the "website" field through as the honeypot value', () => {
    const result = validateCreatePayload({ ...validPayload, website: 'spam' });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.honeypot).toBe('spam');
  });

  it('accepts both supported languages regardless of case', () => {
    for (const [input, expected] of [['fr', 'fr'], ['EN', 'en']] as const) {
      const result = validateCreatePayload({ ...validPayload, language: input });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.language).toBe(expected);
    }
  });
});

describe('validateCreatePayload — rejected input', () => {
  const cases: Array<[string, Record<string, unknown>, string, string]> = [
    ['blank name', { name: '   ' }, 'name', 'missing'],
    ['non-string name', { name: 42 }, 'name', 'missing'],
    ['name over 120 chars', { name: 'a'.repeat(121) }, 'name', 'too_long'],
    ['blank email', { email: '' }, 'email', 'missing'],
    ['email without @', { email: 'nope' }, 'email', 'invalid'],
    ['email with spaces', { email: 'a b@c.ch' }, 'email', 'invalid'],
    ['email over 254 chars', { email: `${'a'.repeat(250)}@b.ch` }, 'email', 'invalid'],
    ['message over 2000 chars', { message: 'a'.repeat(2001) }, 'message', 'too_long'],
    ['unsupported language', { language: 'de' }, 'language', 'invalid'],
    ['missing language', { language: undefined }, 'language', 'invalid'],
    ['missing slot', { startUtc: '' }, 'startUtc', 'missing'],
    ['unparseable slot', { startUtc: 'not-a-date' }, 'startUtc', 'invalid'],
  ];

  it.each(cases)('rejects %s', (_label, override, field, code) => {
    const result = validateCreatePayload({ ...validPayload, ...override });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.field).toBe(field);
    expect(result.error.code).toBe(code);
  });

  it('checks name before email so the first failure wins', () => {
    const result = validateCreatePayload({ ...validPayload, name: '', email: 'nope' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('name');
  });

  it('accepts a name and message exactly on the length limit', () => {
    const result = validateCreatePayload({
      ...validPayload,
      name: 'a'.repeat(120),
      message: 'a'.repeat(2000),
    });

    expect(result.ok).toBe(true);
  });
});

describe('parseAvailabilityRange', () => {
  it('expands short YYYY-MM-DD dates to cover both whole days', () => {
    const result = parseAvailabilityRange('2027-02-15', '2027-02-16');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.from.toISOString()).toBe('2027-02-15T00:00:00.000Z');
    expect(result.value.to.toISOString()).toBe('2027-02-16T23:59:59.999Z');
  });

  it('accepts full ISO timestamps unchanged', () => {
    const result = parseAvailabilityRange(
      '2027-02-15T09:30:00.000Z',
      '2027-02-15T17:00:00.000Z',
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.from.toISOString()).toBe('2027-02-15T09:30:00.000Z');
  });

  const rejected: Array<[string, string | null, string | null, string]> = [
    ['a missing "from"', null, '2027-02-16', 'from'],
    ['a missing "to"', '2027-02-15', null, 'from'],
    ['an unparseable "from"', 'garbage', '2027-02-16', 'from'],
    ['an unparseable "to"', '2027-02-15', 'garbage', 'to'],
    ['an inverted range', '2027-02-16', '2027-02-15', 'from'],
    ['an inverted range given as timestamps', '2027-02-15T10:00:00.000Z', '2027-02-15T09:00:00.000Z', 'from'],
  ];

  it.each(rejected)('rejects %s', (_label, from, to, field) => {
    const result = parseAvailabilityRange(from, to);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe(field);
  });
});

describe('parseAvailabilityRange — bare dates cover whole days', () => {
  it('leaves an explicit timestamp exactly as given', () => {
    const parsed = parseAvailabilityRange(
      '2027-02-15T08:30:00.000Z',
      '2027-02-20T11:15:00.000Z'
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.to.toISOString()).toBe('2027-02-20T11:15:00.000Z');
  });

  it('still refuses a single day expressed backwards', () => {
    expect(parseAvailabilityRange('2027-02-20', '2027-02-15').ok).toBe(false);
  });

  it('accepts the same day for from and to, which now spans that day', () => {
    const parsed = parseAvailabilityRange('2027-02-15', '2027-02-15');

    expect(parsed.ok).toBe(true);
  });
});
