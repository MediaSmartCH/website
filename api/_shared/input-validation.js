const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;

const fieldLimits = {
  contact: {
    name: 120,
    email: 254,
    phone: 40,
    message: 5000,
    projectType: 120,
  },
  newsletter: {
    email: 254,
    source: 80,
  },
};

function normalizeSingleLineText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMultilineText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g, '')
    .trim();
}

function isWithinLength(value, maxLength) {
  return value.length <= maxLength;
}

function isValidEmailStrict(value) {
  if (!emailRegex.test(value) || value.length > fieldLimits.contact.email) {
    return false;
  }

  if (value.includes('..')) {
    return false;
  }

  const [local, domain] = value.split('@');
  if (!local || !domain) {
    return false;
  }

  if (local.startsWith('.') || local.endsWith('.')) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.some((label) => label.startsWith('-') || label.endsWith('-') || label.length === 0)) {
    return false;
  }

  return true;
}

function hasFilledHoneypot(value) {
  return normalizeSingleLineText(value).length > 0;
}

module.exports = {
  emailRegex,
  fieldLimits,
  hasFilledHoneypot,
  isValidEmailStrict,
  isWithinLength,
  normalizeMultilineText,
  normalizeSingleLineText,
};
