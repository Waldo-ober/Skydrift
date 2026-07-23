import { getSupabaseAdmin } from './supabaseClient';

/**
 * Data access layer with two backends:
 *  - Real Supabase, once NEXT_PUBLIC_SUPABASE_URL is a real project URL.
 *  - An in-memory store (this file), used automatically until then, so the
 *    entire request → sign → access-check flow can be tested locally with
 *    ZERO external accounts.
 *
 * The in-memory store resets whenever the server restarts — that's
 * expected and fine for local testing, but obviously not for production.
 */

const usingRealSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

// --- in-memory fallback state (module-level, survives across requests
// within the same running server process) ---
const memory = {
  ndaRequests: [], // { name, email, phone, status, session_id, source, created_at, signed_at }
  ndaSignatures: new Map(), // email -> { name, typed_name, ip, user_agent, nda_hash, nda_version, signed_at }
};

export async function insertRequest({ name, email, phone, source, sessionId }) {
  if (usingRealSupabase()) {
    const admin = getSupabaseAdmin();
    return admin.from('nda_requests').insert({
      name, email, phone, status: 'requested', source, session_id: sessionId,
    });
  }
  memory.ndaRequests.push({
    name, email, phone, status: 'requested', session_id: sessionId, source,
    created_at: new Date().toISOString(),
  });
}

export async function findRequestBySession(sessionId) {
  if (usingRealSupabase()) {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('nda_requests')
      .select('name, email, phone')
      .eq('session_id', sessionId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  return memory.ndaRequests.find((r) => r.session_id === sessionId) || null;
}

export async function markSigned({
  email, name, typedName, ip, userAgent, ndaHash, ndaVersion, sessionId,
}) {
  const signedAt = new Date().toISOString();
  if (usingRealSupabase()) {
    const admin = getSupabaseAdmin();
    await admin
      .from('nda_requests')
      .update({ status: 'signed', signed_at: signedAt })
      .eq('session_id', sessionId);
    return admin.from('nda_signatures').upsert(
      {
        email, name, typed_name: typedName, ip_address: ip, user_agent: userAgent,
        nda_hash: ndaHash, nda_version: ndaVersion, signed_at: signedAt,
      },
      { onConflict: 'email' }
    );
  }
  const req = memory.ndaRequests.find((r) => r.session_id === sessionId);
  if (req) {
    req.status = 'signed';
    req.signed_at = signedAt;
  }
  memory.ndaSignatures.set(email, {
    name, typed_name: typedName, ip_address: ip, user_agent: userAgent,
    nda_hash: ndaHash, nda_version: ndaVersion, signed_at: signedAt,
  });
}

export async function checkAccess(email) {
  if (usingRealSupabase()) {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('nda_signatures')
      .select('name, signed_at')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return { hasAccess: !!data, signedAt: data?.signed_at || null };
  }
  const record = memory.ndaSignatures.get(email);
  return { hasAccess: !!record, signedAt: record?.signed_at || null };
}

export function isUsingMemoryStore() {
  return !usingRealSupabase();
}
