import { insertRequest } from '../../../lib/dataStore';
import { generateSessionId } from '../../../lib/signing';
import { validateEmail, validatePhone } from '../../../lib/validation';

// POST /api/sign/start
// Body: { name, email, phone }
// Called when a visitor submits the "Get the Full Story" form.
// Logs the lead immediately (even if they abandon before signing) and
// returns a sessionId that ties this request to the signing page.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone } = req.body || {};
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return res.status(400).json({ error: emailCheck.error });
  }

  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) {
    return res.status(400).json({ error: phoneCheck.error });
  }

  try {
    const sessionId = generateSessionId();
    await insertRequest({
      name: name.trim(),
      email: emailCheck.value,
      phone: phoneCheck.value,
      source: req.headers.referer || 'direct',
      sessionId,
    });

    const signingUrl = `/access/sign?sessionId=${sessionId}&name=${encodeURIComponent(name.trim())}&email=${encodeURIComponent(emailCheck.value)}`;
    return res.status(200).json({ signingUrl });
  } catch (err) {
    console.error('sign/start error:', err);
    return res.status(500).json({ error: 'Could not start the signing process' });
  }
}
