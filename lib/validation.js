// Validation for the "Get the Full Story" request form.
//
// Goal: catch obviously fake/junk input ("12345678", "test@test") without
// adding real friction like SMS verification or email confirmation links —
// this is a legal-document gate, not a bank login, so we're filtering out
// careless/bot submissions, not trying to cryptographically prove identity.

// A reasonably strict but not paranoid email format check.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Common disposable/throwaway email domains — people using these to dodge
// giving a real contact are exactly the "random info" case being filtered.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'fakeinbox.com', 'getnada.com', 'maildrop.cc',
]);

export function validateEmail(email) {
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) return { valid: false, error: 'Email is required.' };
  if (!EMAIL_RE.test(trimmed)) return { valid: false, error: 'Please enter a valid email address.' };
  const domain = trimmed.split('@')[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, error: 'Please use a permanent email address, not a temporary/disposable one.' };
  }
  return { valid: true, value: trimmed };
}

export function validatePhone(phone) {
  const raw = (phone || '').trim();
  const digits = raw.replace(/\D/g, '');

  if (!digits) return { valid: false, error: 'Phone number is required.' };

  // International numbers (E.164) run 7–15 digits total, including country
  // code. This accepts US, UK, EU, etc. without assuming a US-only format.
  if (digits.length < 7 || digits.length > 15) {
    return { valid: false, error: 'Please enter a valid phone number, with country code if outside the US.' };
  }

  // Reject the obviously-fake patterns regardless of country: all the same
  // digit, or a long simple sequential run — exactly the kind of input
  // someone types to get past a form without giving a real number.
  if (/^(\d)\1+$/.test(digits)) {
    return { valid: false, error: 'That doesn\u2019t look like a real phone number.' };
  }
  const ascending = '0123456789012345';
  const descending = '9876543210987654';
  if (digits.length >= 8 && (ascending.includes(digits) || descending.includes(digits))) {
    return { valid: false, error: 'That doesn\u2019t look like a real phone number.' };
  }

  // For a plain 10-digit number (no country code given), apply the US-style
  // sanity check that area/exchange codes can't start with 0 or 1 — this
  // only fires when the number looks like a bare US number to begin with,
  // so it never blocks legitimate international formats.
  if (digits.length === 10 && (/^[01]/.test(digits) || /^\d{3}[01]/.test(digits))) {
    return { valid: false, error: 'Please enter a valid 10-digit phone number.' };
  }

  return { valid: true, value: raw, digits };
}
