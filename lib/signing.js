import crypto from 'crypto';
import { NDA_TEXT, NDA_VERSION } from './ndaDocument';

// Hashes the exact NDA text so we can prove later exactly which version of
// the document a given signature applied to, even if the text is edited
// after the fact.
export function hashNdaText() {
  return crypto.createHash('sha256').update(NDA_TEXT).digest('hex');
}

// Extracts the visitor's real IP address from standard proxy headers.
// Vercel (and most hosts) set x-forwarded-for; falls back to the raw
// socket address for local dev.
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown';
}

// Simple random session id used to tie the initial request form to the
// later signing completion, without needing an account/login system.
export function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}
