import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/sign/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      window.location.href = data.signingUrl;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sky Drift — 768 Acres, Central Texas</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <header style={s.nav} className="rnav">
        <div style={s.brandRow}>
          <div style={s.logoBadge}><img src="/logo-icon-white.svg" alt="" style={s.logoIcon} /></div>
          <div style={s.brand}>Sky Drift</div>
        </div>
        <a href="#access" style={s.navBtn}>Get the Full Story</a>
      </header>

      <section style={s.hero}>
        <img src="/images/header.jpg" alt="Aerial view of the ranch at dusk" style={s.heroImg} />
        <div style={s.heroScrim} />
        <img src="/images/clouds-white.webp" alt="" style={s.heroClouds} />
                <div className="wrap" style={s.heroContent}>
          <div className="mono-label" style={{ color: 'var(--white)', opacity: 0.85 }}>
            An Exclusive Off-Market Offering &middot; Central Texas
          </div>
          <h1 style={s.h1}>
            768 Acres.<br /><span style={{ fontStyle: 'italic', fontWeight: 500 }}>One Legacy.</span>
          </h1>
          <p style={s.heroSub}>
            768 contiguous acres in the gateway to the Central Texas Hill Country, inside the &ldquo;Texas Triangle&rdquo; &mdash; a private lake, multiple residences, regenerative grazing, and a growing hospitality vision, all assembled into one remarkable holding. Opportunities of this scale are increasingly difficult to find.
          </p>
          <button className="btn btn-dark" onClick={() => setShowForm(true)}>
            Get the Full Story &rarr;
          </button>
          <div style={s.ctaHint}>Price, address, and verified land data included.</div>
        </div>
      </section>


      <main className="wrap" style={{ padding: '70px 6vw' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,2.2vw,1.9rem)', maxWidth: '36ch', marginBottom: 40 }}>
          The story behind Sky Drift is best told through the numbers.
        </p>

        <div className="panel" style={{ marginBottom: 60 }}>
          <div className="rfact-grid">
            <div><div style={s.figure}>768±</div><div style={s.figLabel}>Contiguous acres, single assembled holding</div></div>
            <div><div style={s.figure}>2021</div><div style={s.figLabel}>Holistic grazing management implemented</div></div>
            <div><div style={s.figure}>2023</div><div style={s.figLabel}>Savory Institute EOV certification achieved</div></div>
            <div><div style={s.figure}>2 hrs</div><div style={s.figLabel}>From Austin, TX (~85 mi)</div></div>
            <div><div style={s.figure}>2.5 hrs</div><div style={s.figLabel}>From Dallas, TX</div></div>
            <div><div style={s.figure}>~1 hr</div><div style={s.figLabel}>From Waco, Temple &amp; Killeen</div></div>
                      </div>
        </div>

        {/* Vision pulled up: the retreat dream before the data */}
        <div className="rsplit">
          <div style={{ padding: '30px 0', order: 1 }}>
            <span className="mono-label">Yours to Finish, Your Way</span>
            <h2 style={s.h2}>A Lakeside Retreat, Already Underway</h2>
            <p style={s.p}>Approximately 70% complete and ready for the next owner to finish according to their vision. More than a concept, the retreat is already taking shape &mdash; with framing complete, infrastructure underway, and a contractor estimate available for completion.</p>
          </div>
          <img src="/images/cabins-lake.jpg" alt="Cabins along the lake at golden hour" style={{ ...s.splitImg, order: 2 }} />
        </div>

        <div className="rsplit" style={{ marginTop: 50 }}>
          <img src="/images/cow-verified.jpg" alt="Cattle on the ranch" style={s.splitImg} />
          <div style={{ padding: '30px 0' }}>
            <span className="mono-label">A Story Backed by Real Data</span>
            <h2 style={s.h2}>Stewardship Backed by Independent Verification</h2>
            <p style={s.p}>Since 2021, the ranch has participated in the Savory Institute&rsquo;s Ecological Outcome Verification program, achieving certification in 2023. It&rsquo;s a measurable commitment to improving soil health and land stewardship &mdash; not simply a marketing claim.</p>
          </div>
        </div>

        <div className="rland-block" style={{ marginTop: 70 }}>
          <div style={s.landMedia}>
            <img src="/images/all-4-cabins.jpg" alt="Cabins nestled in the cedars" style={s.landMediaImg} />
            <div style={s.landScrim} />
            <span style={{ position: 'relative', zIndex: 2, color: 'var(--white)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9 }}>
              Central Texas &middot; Exact Location Withheld
            </span>
            <h2 style={{ ...s.h2, position: 'relative', zIndex: 2, color: 'var(--white)', marginTop: 14, fontSize: 'clamp(2rem,3.6vw,3rem)' }}>
              The Land &amp;<br />The Lifestyle
            </h2>
          </div>
          <div style={s.landSide}>
            <figure style={s.landCard}>
              <img src="/images/aerial-lake.jpg" alt="Aerial of the lake and cabins at golden hour" style={s.landCardImg} />
              <figcaption style={s.landCaption}><span>Golden Hour, the Lake</span></figcaption>
            </figure>
            <figure style={s.landCard}>
              <img src="/images/web-3.jpg" alt="Cattle at the pond, golden hour" style={s.landCardImg} />
              <figcaption style={s.landCaption}><span>Morning on the Range</span></figcaption>
            </figure>
          </div>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,2.6vw,2.1rem)', textAlign: 'center', maxWidth: '60ch', margin: '70px auto 10px' }}>
          The Possibilities, Not Just a Property
        </p>
        <p style={{ ...s.p, textAlign: 'center', maxWidth: '64ch', margin: '0 auto 50px' }}>
          Unobstructed horizons, one of the region&rsquo;s darkest skies, and water secured at a scale most Central Texas ranches this size don&rsquo;t have. The right steward won&rsquo;t just own it &mdash; they&rsquo;ll continue what&rsquo;s already been started here.
        </p>

        <div className="rpillar-grid-4">
          {[
            ['01', 'Cabin Retreats', 'The first chapter of a micro-resort. Modern luxury design, private decks, nestled in the cedars.', false],
            ['02', 'Night Sky Preserve', 'Some of the darkest, most unobstructed skies in the region.', true],
            ['03', 'Stewardship', 'Native grass pastures, regenerating cropland, and a working ranch story — with fields well suited to hay, cover crops, and orchards.', false],
            ['04', 'Hospitality', 'A naturally beautiful backdrop for meaningful events.', true],
          ].map(([n, title, body, dark]) => (
            <div key={n} style={dark ? s.pillarDark : s.pillarLight}>
              <span className="mono-label" style={dark ? { color: 'var(--white)', opacity: 0.8 } : {}}>{n}</span>
              <h3 style={{ ...s.h3, color: dark ? 'var(--white)' : 'var(--ink)' }}>{title}</h3>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14.5, margin: 0, color: dark ? 'rgba(251,249,243,0.85)' : 'var(--ink-soft)' }}>{body}</p>
            </div>
          ))}
        </div>

        <div id="access" style={s.access}>
          <span className="mono-label">Confidential &middot; By Invitation</span>
          <h2 style={{ ...s.h2, marginTop: 14 }}>For the Buyer Who Sees More Than Acreage.</h2>
          <p style={{ ...s.p, maxWidth: 520, margin: '0 auto 30px' }}>
            The price, the address, verified land data, water rights, and every photo &mdash; it&rsquo;s all one quick step away. Just sign a standard confidentiality agreement and it&rsquo;s yours.
          </p>
          <button className="btn btn-dark" onClick={() => setShowForm(true)}>
            Request the Confidential Offering &rarr;
          </button>
        </div>
      </main>

      {showForm && (
        <div style={s.modalOverlay} onClick={() => setShowForm(false)}>
          <div className="panel" style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <button style={s.modalClose} onClick={() => setShowForm(false)} aria-label="Close">&times;</button>
            <p style={{ ...s.p, fontSize: '0.9rem', marginBottom: 20 }}>
              Tell us who you are and we&rsquo;ll send over the price, the address, and everything else &mdash; right after a quick NDA.
            </p>
            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="name">Full name</label>
              <input id="name" className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label className="field-label" htmlFor="phone">Phone</label>
              <input id="phone" className="field" placeholder="+1 512 555 1234" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {error && <p style={{ color: '#a8562e', fontSize: '0.85rem' }}>{error}</p>}
              <button className="btn btn-dark" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'One moment…' : 'Get the Full Story →'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 14, lineHeight: 1.6 }}>
                We collect your name, email, and phone to grant access. See our <a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy &amp; Data Notice</a>.
              </p>
            </form>
          </div>
        </div>
      )}

      <footer style={s.footer}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--white)' }}>Sky Drift</div>
        <div>A private Texas offering &middot; Confidential &middot; <a href="/privacy" style={{ textDecoration: 'underline' }}>Privacy &amp; Data Notice</a></div>
      </footer>
    </>
  );
}

const s = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 6vw', background: 'rgba(251,249,243,0.92)', backdropFilter: 'blur(4px)' },
  brand: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 20 },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoBadge: { width: 38, height: 38, background: 'transparent', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoIcon: { width: 20, height: 25 },
  navBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid var(--ink)', padding: '10px 18px', borderRadius: 2 },
  hero: { position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'flex-end' },
  heroImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  heroScrim: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(29,27,22,0.9) 4%, rgba(29,27,22,0.25) 55%)' },
  heroClouds: { position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 'min(380px, 42vw)', opacity: 0.85, zIndex: 1, pointerEvents: 'none' },
  heroContent: { position: 'relative', zIndex: 2, padding: '0 6vw 7vw', maxWidth: 820 },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(2.4rem,6vw,4.6rem)', lineHeight: 1.05, color: 'var(--white)', marginBottom: 22, textTransform: 'uppercase' },
  heroSub: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem,1.6vw,1.3rem)', maxWidth: '46ch', color: 'rgba(251,249,243,0.92)', margin: '0 0 30px', lineHeight: 1.6 },
  ctaHint: { marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.04em', color: 'rgba(251,249,243,0.75)' },
  factGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 30 },
  figure: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(1.7rem,2.6vw,2.2rem)', color: 'var(--ink)', marginBottom: 8 },
  figLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: 'var(--ink-soft)' },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' },
  splitImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 },
  h2: { fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', marginBottom: 16, textTransform: 'uppercase' },
  h3: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', textTransform: 'uppercase', margin: '14px 0 10px' },
  p: { fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.7 },
  landBlock: { display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 70, borderRadius: 6, overflow: 'hidden' },
  landMedia: { position: 'relative', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%' },
  landMediaImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  landScrim: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(29,27,22,0.35), rgba(29,27,22,0.55))' },
  landSide: { display: 'flex', flexDirection: 'column' },
  landCard: { margin: 0, position: 'relative', flex: 1, minHeight: 210, overflow: 'hidden' },
  landCardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  landCaption: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px', background: 'linear-gradient(to top, rgba(29,27,22,0.75), transparent)', color: 'var(--white)', fontSize: 13 },
  pillarGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, background: 'var(--line)' },
  pillarLight: { background: 'var(--white)', padding: '32px 22px' },
  pillarDark: { background: 'var(--ink)', padding: '32px 22px' },
  access: { textAlign: 'center', background: 'var(--cream-deep)', borderRadius: 6, padding: '60px 6vw', marginTop: 70 },
  footer: { background: 'var(--ink)', color: 'rgba(251,249,243,0.6)', padding: '44px 6vw', textAlign: 'center', fontSize: 12 },
  photoPending: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-deep)', border: '1px dashed var(--ink-soft)', color: 'var(--ink-soft)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, textAlign: 'center', padding: 20 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(29,27,22,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5vw' },
  modalCard: { position: 'relative', maxWidth: 420, width: '100%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' },
  modalClose: { position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', fontSize: 26, lineHeight: 1, cursor: 'pointer', color: 'var(--ink-soft)' },
};
