import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head><title>Privacy & Data Notice — Sky Drift</title></Head>
      <main className="wrap" style={{ padding: '80px 6vw', maxWidth: 720 }}>
        <span className="mono-label">Sky Drift</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '2rem', textTransform: 'uppercase', margin: '14px 0 24px' }}>
          Privacy &amp; Data Notice
        </h1>

        <div className="panel">
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
            This page explains what information we collect when you request access to this listing, and why.
          </p>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', marginBottom: 8 }}>What we collect</h3>
          <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.8, paddingLeft: 20, marginBottom: 20 }}>
            <li>Your name, email address, and phone number, provided when you request access</li>
            <li>Your IP address, browser, and device information, captured at the moment you sign the confidentiality agreement</li>
            <li>The exact version of the agreement you signed, and the date and time you signed it</li>
          </ul>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', marginBottom: 8 }}>Why we collect it</h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
            This information forms the audit trail for your electronic signature on the confidentiality agreement,
            establishing when and by whom it was signed. We also use your contact details to send you access to
            the full property details and to follow up regarding your interest.
          </p>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', marginBottom: 8 }}>How it's used</h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
            Your information is not sold. It is used solely to manage access to this confidential listing and to
            communicate with you about it.
          </p>

          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 30 }}>
            This notice is provided for transparency and does not constitute legal advice.
          </p>
        </div>
      </main>
    </>
  );
}
