import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NDA_TEXT } from '../../lib/ndaDocument';

export default function Sign() {
  const router = useRouter();
  const { sessionId, name, email } = router.query;
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSign(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/sign/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email, name, typedName, agreed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSigned(true);
      setTimeout(() => {
        router.push(`/access/verified?email=${encodeURIComponent(email)}`);
      }, 900);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head><title>Sign the NDA — Sky Drift</title></Head>
      <main className="wrap" style={{ padding: '80px 6vw', maxWidth: 680 }}>
        <span className="mono-label">Confidential &middot; Sky Drift</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '2rem', textTransform: 'uppercase', margin: '14px 0 8px' }}>
          Mutual Non-Disclosure Agreement
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
          Signing as <strong style={{ color: 'var(--ink)' }}>{name}</strong> ({email})
        </p>

        <div className="panel" style={{ marginBottom: 28, maxHeight: 360, overflowY: 'auto' }}>
          <pre style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 15, lineHeight: 1.7,
            whiteSpace: 'pre-wrap', color: 'var(--ink-soft)', margin: 0,
          }}>
            {NDA_TEXT}
          </pre>
        </div>

        {!signed ? (
          <form onSubmit={handleSign} className="panel">
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, fontSize: 14, color: 'var(--ink-soft)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 3 }}
                required
              />
              I have read and agree to the terms of this Non-Disclosure Agreement.
            </label>

            <label className="field-label" htmlFor="typedName">Type your full legal name to sign</label>
            <input
              id="typedName"
              className="field"
              required
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={name}
            />

            {error && <p style={{ color: '#a8562e', fontSize: '0.85rem' }}>{error}</p>}

            <button className="btn btn-dark" type="submit" disabled={submitting || !agreed} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Signing…' : 'Sign and Continue →'}
            </button>

            <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.6 }}>
              By signing, you agree to our <a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy &amp; Data Notice</a>. Your name, email, phone, IP address, and device information are recorded as part of the signature audit trail. Texas law also requires you to receive this <a href="/documents/IABS-Kim-Hill-Real-Estate-Group.pdf" target="_blank" style={{ textDecoration: 'underline' }}>Information About Brokerage Services (IABS)</a> notice.
            </p>
          </form>
        ) : (
          <div className="status-badge success" style={{ display: 'block', padding: 20, fontSize: 13 }}>
            ✓ Signed &mdash; redirecting to your access page…
          </div>
        )}
      </main>
    </>
  );
}
