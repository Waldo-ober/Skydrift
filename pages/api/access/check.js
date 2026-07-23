import { checkAccess, isUsingMemoryStore } from '../../../lib/dataStore';

// GET /api/access/check?email=someone@example.com
// The gated page calls this after a visitor logs in (via Supabase magic
// link) to decide whether to reveal the full content. This is a SERVER
// check against the database — never trust a value stored in the browser.
export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ hasAccess: false, error: 'Email required' });
  }

  try {
    const result = await checkAccess(email);
    // Surface which storage backend actually answered this — critical for
    // diagnosing "access denied" reports: if this is true, Supabase isn't
    // connected and nothing persists reliably between requests on Vercel.
    return res.status(200).json({ ...result, usingMemoryStore: isUsingMemoryStore() });
  } catch (err) {
    // Temporary, deliberately verbose while we're debugging live access
    // issues — surfaces the real Supabase error (bad key, missing table,
    // RLS block, etc.) instead of a generic failure with no clue why.
    console.error('access check error:', err);
    return res.status(200).json({
      hasAccess: false,
      usingMemoryStore: isUsingMemoryStore(),
      debugError: err.message || String(err),
    });
  }
}
