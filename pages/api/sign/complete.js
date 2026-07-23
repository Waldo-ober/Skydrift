import { markSigned } from '../../../lib/dataStore';
import { hashNdaText, getClientIp, getUserAgent } from '../../../lib/signing';
import { NDA_VERSION } from '../../../lib/ndaDocument';

// POST /api/sign/complete
// Body: { sessionId, email, name, typedName, agreed }
// This is the moment a signature becomes real: captures IP, user agent,
// timestamp, and a hash of the exact NDA text agreed to. This is the
// single source of truth for "has this person actually signed" — the
// signing page itself is just the UI in front of this.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, email, name, typedName, agreed } = req.body || {};

  if (!sessionId || !email || !typedName || !agreed) {
    return res.status(400).json({ error: 'Missing required signing information' });
  }
  if (typedName.trim().length < 2) {
    return res.status(400).json({ error: 'Please type your full legal name' });
  }

  try {
    await markSigned({
      email,
      name,
      typedName: typedName.trim(),
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
      ndaHash: hashNdaText(),
      ndaVersion: NDA_VERSION,
      sessionId,
    });

    // TODO once ready: trigger the Zapier webhook here to fan out to
    // Follow Up Boss + Mailchimp, e.g.
    // await fetch(process.env.ZAPIER_WEBHOOK_URL, { method: 'POST', body: JSON.stringify({ name, email }) });

    return res.status(200).json({ signed: true });
  } catch (err) {
    console.error('sign/complete error:', err);
    return res.status(500).json({ error: 'Could not record your signature' });
  }
}
