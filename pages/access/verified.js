import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Verified() {
  const router = useRouter();
  const { email } = router.query;
  const [status, setStatus] = useState('checking');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [dataRoomOpen, setDataRoomOpen] = useState(false);

  const GALLERY_IMAGES = [
    { src: '/images/g11.jpg', alt: 'Property view' },
    { src: '/images/g12.jpg', alt: 'Property view' },
    { src: '/images/g13.jpg', alt: 'Property view' },
    { src: '/images/g14.jpg', alt: 'Property view' },
    { src: '/images/g15.jpg', alt: 'Property view' },
    { src: '/images/g16.jpg', alt: 'Property view' },
    { src: '/images/g17.jpg', alt: 'Property view' },
    { src: '/images/g19.jpg', alt: 'Property view' },
    { src: '/images/g110.jpg', alt: 'Property view' },
    { src: '/images/g112.jpg', alt: 'Property view' },
    { src: '/images/g113.jpg', alt: 'Property view' },
    { src: '/images/g114.jpg', alt: 'Property view' },
    { src: '/images/g116.jpg', alt: 'Property view' },
    { src: '/images/g117.jpg', alt: 'Property view' },
    { src: '/images/g118.jpg', alt: 'Property view' },
    { src: '/images/g120.jpg', alt: 'Property view' },
    { src: '/images/g121.jpg', alt: 'Property view' },
    { src: '/images/g122.jpg', alt: 'Property view' },
    { src: '/images/g123.jpg', alt: 'Property view' },
  ];

  const RENDERED_IMAGES = [
    { src: '/images/render-cabin-porch.png', alt: 'Generated concept of an evening on a finished cabin porch' },
    { src: '/images/render-living-room.jpg', alt: 'Generated concept of a finished cabin living room' },
    { src: '/images/render-kitchen.jpg', alt: 'Generated concept of a finished cabin kitchen' },
    { src: '/images/render-bedroom.jpg', alt: 'Generated concept of a finished cabin bedroom' },
    { src: '/images/render-bathroom.jpg', alt: 'Generated concept of a finished cabin bathroom' },
    { src: '/images/render-lake.png', alt: 'Generated concept of fishing on the lake at golden hour' },
  ];

  const ALL_GALLERY_IMAGES = [...GALLERY_IMAGES, ...RENDERED_IMAGES];

  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e) {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % ALL_GALLERY_IMAGES.length);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const [usingMemoryStore, setUsingMemoryStore] = useState(null);
  const [debugError, setDebugError] = useState(null);

  useEffect(() => {
    if (!email) return;
    fetch(`/api/access/check?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        setUsingMemoryStore(!!data.usingMemoryStore);
        setDebugError(data.debugError || null);
        setStatus(data.hasAccess ? 'granted' : 'denied');
      })
      .catch(() => setStatus('denied'));
  }, [email]);

  return (
    <>
      <Head>
        <title>Full Details — Sky Drift</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      {status === 'checking' && (
        <main className="wrap" style={{ padding: '100px 6vw' }}>
          <p style={{ color: 'var(--ink-soft)' }}>Checking your access…</p>
        </main>
      )}

      {status === 'denied' && (
        <main className="wrap" style={{ padding: '100px 6vw', maxWidth: 640 }}>
          <div className="panel">
            <h1 style={{ fontSize: '1.6rem', textTransform: 'uppercase' }}>We couldn&rsquo;t verify your access</h1>
            <p style={{ color: 'var(--ink-soft)' }}>This link isn&rsquo;t tied to a completed NDA signature for {email || 'this email'}.</p>
            {usingMemoryStore && (
              <p style={{ color: '#a8562e', fontSize: 13, marginTop: 12, padding: 12, background: '#f7ece6', borderRadius: 4 }}>
                <strong>Diagnostic:</strong> This site is currently running in temporary memory mode &mdash; Supabase is not connected. Signatures aren&rsquo;t being permanently saved, and won&rsquo;t reliably persist between requests. Add the Supabase environment variables in Vercel and redeploy to fix this.
              </p>
            )}
            {debugError && (
              <p style={{ color: '#a8562e', fontSize: 13, marginTop: 12, padding: 12, background: '#f7ece6', borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                <strong>Diagnostic (Supabase error):</strong> {debugError}
              </p>
            )}
            <a className="btn btn-dark" href="/">Back to the listing →</a>
          </div>
        </main>
      )}

      {status === 'granted' && (
        <>
          <header style={s.nav} className="rnav">
            <div style={s.brandRow}>
              <div style={s.logoBadge}><img src="/logo-icon-white.svg" alt="" style={s.logoIcon} /></div>
              <div style={s.brand}>Sky Drift</div>
            </div>
            <span style={s.verifiedPill}>Verified Access</span>
          </header>

          <div style={s.pageHead}>
            <img src="/images/header.jpg" alt="Aerial view of the ranch" style={s.pageHeadImg} />
            <div style={s.pageHeadScrim} />
            <img src="/images/clouds-white.webp" alt="" style={s.heroClouds} />
                        <div className="wrap" style={s.pageHeadContent}>
              <span className="mono-label" style={{ color: 'var(--white)', opacity: 0.85 }}>
                An Exclusive Off-Market Offering
              </span>
              <h1 style={s.h1}>The Full Story</h1>
              <div style={{ marginTop: 14, fontSize: 14.5, color: 'rgba(251,249,243,0.85)' }}>
                Sky Drift &middot; Purmela, Coryell County, Texas &middot; 768± Acres
              </div>
              <div style={{ marginTop: 8, fontSize: 13.5, fontStyle: 'italic', color: 'rgba(251,249,243,0.75)' }}>
                The land is Cordero Fields. Sky Drift is what it becomes.
              </div>
            </div>
          </div>

          <main className="wrap" style={{ padding: '70px 6vw' }}>

            {/* THE INVITATION — centered editorial */}
            <p style={s.centeredLede}>There Are Places That Hold Memory in Their Soil</p>
            <p style={s.centeredBody}>
              A ranch shaped by thoughtful hands over time — where the land itself still sings, oaks stand sentinel, and the
              Texas sky stretches endless and honest. It awaits an owner who won&rsquo;t just hold it, but continue it.
              This isn&rsquo;t just a transaction. It&rsquo;s an invitation to continue a story already written in light, water, and wind.
            </p>

            {/* THE FOUNDATION — Water & Life, Land Stewardship, Infrastructure & Access, The Sky Itself */}
            <div className="rsplit">
              <img src="/images/water-life-new.jpg" alt="Cabins overlooking the lake" style={s.splitImg} />
              <div style={{ padding: '30px 0' }}>
                <span className="mono-label">The Foundation</span>
                <h2 style={s.h2}>Water &amp; Life</h2>
                <p style={s.p}>Water is the foundation of everything at Sky Drift. The private lake, seven tanks, and five productive wells support healthy wildlife, productive grazing, resilient native grasses, and long-term sustainability. More than an amenity, this established water system represents years of planning and investment that would be difficult to recreate today.</p>
              </div>
            </div>

            <div className="rsplit" style={{ marginTop: 50 }}>
              <div style={{ padding: '30px 0', order: 1 }}>
                <span className="mono-label">The Foundation</span>
                <h2 style={s.h2}>Land Stewardship</h2>
                <p style={s.p}>Years of intentional stewardship have strengthened the ranch&rsquo;s soils, improved forage production, and restored native grasslands. Supported by Ecological Outcome Verification (EOV), Sky Drift offers measurable progress &mdash; not simply future potential.</p>
              </div>
              <img src="/images/land-stewardship-new.jpg" alt="Sheep on the land, tied to the Cordero Fields heritage" style={{ ...s.splitImg, order: 2 }} />
            </div>

            <div className="rsplit" style={{ marginTop: 50 }}>
              <img src="/images/barnyard-dusk.jpg" alt="Ranch barnyard, barns, and homes at dusk" style={s.splitImg} />
              <div style={{ padding: '30px 0' }}>
                <span className="mono-label">The Foundation</span>
                <h2 style={s.h2}>Infrastructure &amp; Access</h2>
                <p style={s.p}>Great ranches are built over time. Interior roads, bridges, cross fencing, working pens, barns, multiple residences, and established utilities allow the next owner to begin enjoying and operating the ranch immediately rather than spending years developing basic infrastructure.</p>
                <p style={s.p}>Two additional planned cabin sites already have septic systems installed, providing future expansion potential for additional guest accommodations.</p>
              </div>
            </div>

            <div className="rsplit" style={{ marginTop: 50 }}>
              <div style={{ padding: '30px 0', order: 1 }}>
                <span className="mono-label">The Foundation</span>
                <h2 style={s.h2}>The Sky Itself</h2>
                <p style={s.p}>Unobstructed horizons and some of the darkest skies in the region make the sky itself one of Sky Drift&rsquo;s greatest assets &mdash; a natural stage for stargazing, and the very thing the ranch is named for.</p>
              </div>
              <figure style={{ margin: 0, order: 2 }}>
                <img src="/images/sky-itself-new2.jpg" alt="The night sky over Sky Drift" style={s.splitImg} />
              </figure>
            </div>

            <div className="rsplit" style={{ marginTop: 50 }}>
              <img src="/images/lakeside-retreat-new.jpg" alt="The four cabins at the Lakeside Retreat" style={s.splitImg} />
              <div style={{ padding: '30px 0' }}>
                <span className="mono-label">The Foundation</span>
                <h2 style={s.h2}>Cabins &amp; Accommodations</h2>
                <p style={s.p}>Four architecturally designed Luxury Guest Cabins overlook the lake and are approximately 70% complete, ready to be finished to the buyer&rsquo;s own specifications. Much of the planning, engineering, and construction has already been completed, creating a significant head start for anyone pursuing a private retreat or luxury hospitality concept.</p>
              </div>
            </div>

            {/* THE NAME & ESSENCE — land-block full-bleed treatment */}
            <div className="rland-block" style={{ marginTop: 60 }}>
              <div style={s.landMedia}>
                <img src="/images/name-essence-new.jpg" alt="Pond at golden hour" style={s.landMediaImg} />
                <div style={s.landScrim} />
                <span style={{ position: 'relative', zIndex: 2, color: 'var(--white)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9 }}>
                  The Name &amp; Essence
                </span>
                <h2 style={{ ...s.h2, position: 'relative', zIndex: 2, color: 'var(--white)', marginTop: 14, fontSize: 'clamp(2rem,3.6vw,3rem)' }}>
                  Sky Drift
                </h2>
                <p style={{ position: 'relative', zIndex: 2, color: 'var(--white)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: '1.5rem', marginTop: 10 }}>
                  &ldquo;Where Sky and Soul Drift Together&rdquo;
                </p>
              </div>
              <div style={s.landSide}>
                <figure style={s.landCard}>
                  <div style={{ ...s.landCardSolid }} />
                  <figcaption style={s.landCaption}>
                    <span style={{ fontWeight: 700 }}>Sky</span><br />
                    <span style={{ fontSize: 12.5, opacity: 0.9 }}>Golden hour light, dramatic clouds, and a Milky Way that makes this place feel infinite.</span>
                  </figcaption>
                </figure>
                <figure style={s.landCard}>
                  <div style={{ ...s.landCardSolid, background: 'var(--dusk)' }} />
                  <figcaption style={s.landCaption}>
                    <span style={{ fontWeight: 700 }}>Drift</span><br />
                    <span style={{ fontSize: 12.5, opacity: 0.9 }}>The unhurried movement of wind through native grasses, and the wide-open quiet of the land.</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* THE EXPERIENCE VISION */}
            <p style={{ ...s.centeredLede, marginTop: 70 }}>Luxury Hospitality Opportunities</p>
            <div className="rpillar-grid-3">
              {[
                ['Glamping & Cabin Stays', 'Potential for luxury cabin stays under the big sky, with private decks and immersive connection to the land.', '/images/agri-glamping.jpg'],
                ['Stargazing Experiences', 'Potential for dark sky experiences, with signature programs built around telescopes and storytelling.', '/images/agri-stargazing.jpg'],
                ['Culinary Agritourism', 'Potential for culinary and ranch experiences, from farm-to-table dinners to foraging walks and cooking classes.', '/images/agri-culinary.jpg'],
                ['Nature Immersion', 'Potential for guided fishing, birding, wildlife tracking, and photography experiences.', '/images/agri-nature.jpg'],
                ['Wellness & Retreats', 'Potential for wellness retreats, with yoga and meditation pavilions and sound baths under the oaks.', '/images/agri-wellness.jpg'],
                ['Signature Events', 'Potential for destination gatherings &mdash; weddings, family reunions, and corporate offsites.', '/images/agri-events.jpg'],
              ].map(([title, body, img]) => (
                <div key={title} style={s.pillarImg}>
                  <img src={img} alt={title} style={s.pillarImgBg} />
                  <div style={s.pillarImgScrim} />
                  <h3 style={{ ...s.h3, color: 'var(--white)', position: 'relative', zIndex: 2, margin: '0 0 6px' }}>{title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.4, margin: 0, color: 'rgba(251,249,243,0.9)', position: 'relative', zIndex: 2 }}>{body}</p>
                </div>
              ))}
            </div>
            <p style={{ ...s.p, textAlign: 'center', maxWidth: '70ch', margin: '20px auto 0' }}>
              These aren&rsquo;t hypotheticals &mdash; they&rsquo;re a market. Sky Drift sits ~1 hr from Waco, Temple, and Killeen and ~2 hr from Austin and Fort Worth, inside one of the fastest-growing agritourism catchments in the country, minutes from SpaceX McGregor.
            </p>


            {/* THE PROOF — Verified. Not Promised. */}
            <p style={{ ...s.centeredLede, marginTop: 70 }}>The Proof</p>
            <div className="panel">
              <h3 style={{ ...s.h3, fontSize: '1.5rem', marginBottom: 12 }}>Verified. Not Promised.</h3>
              <p style={{ ...s.p, marginBottom: 20 }}>Savory Institute EOV, awarded 2023 and monitored yearly since. Cornell soil-health data, 2021 vs 2023:</p>
              <div className="rproof-wrap">
              <table style={s.proofTable} cellSpacing={0}>
                <thead>
                  <tr>
                    <th style={s.proofTh}>Indicator</th>
                    <th style={{ ...s.proofTh, textAlign: 'center' }}>2021</th>
                    <th style={{ ...s.proofTh, textAlign: 'center' }}>2023</th>
                    <th style={{ ...s.proofTh, textAlign: 'center' }}>Rating 0&ndash;100</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Soil organic matter (%)', '3.3', '5.3', '61 → 99'],
                    ['Aggregate stability', '34.0', '51.7', '56 → 87'],
                    ['Active carbon', '466', '507', '42 → 51'],
                    ['Overall soil-health score', '63', '68', '—'],
                  ].map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ ...s.proofTd, textAlign: j === 0 ? 'left' : 'center', fontWeight: j === 3 ? 600 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <a href="/documents/EOV-report-2021-2025.pdf" target="_blank" className="btn btn-dark" style={{ width: 'auto', display: 'inline-flex', marginTop: 22 }}>
                Download Full EOV Report (PDF)
              </a>
            </div>

            {/* PROPERTY DATA */}
            <div className="panel" style={{ marginTop: 40 }}>
              <div className="panel-title">Property Inventory</div>
              <div className="fact-row"><span>Total acreage</span><span className="v">768± ac</span></div>
              <div className="fact-row"><span>Location</span><span className="v">Purmela, Coryell County, TX</span></div>
              <div className="fact-row"><span>Price guidance</span><span className="v">$7.5M</span></div>
              <div className="fact-row"><span>Water</span><span className="v">Private lake &middot; 5 wells &middot; 7 tanks</span></div>
              <div className="fact-row"><span>Grazing</span><span className="v">700+ ac total &middot; ~230 ac hot-wire (high-density) &middot; pens</span></div>
              <div className="fact-row"><span>Certification</span><span className="v">Savory EOV &mdash; verified 2023</span></div>
              <div className="fact-row"><span>Residences</span><span className="v">1 primary (1,464 sf) + 2 additional homes</span></div>
              <div className="fact-row"><span>Luxury Guest Cabins</span><span className="v">4 cabins &middot; ~660 sf each &middot; ~70% complete</span></div>
              <div className="fact-row"><span>Barns</span><span className="v">3 barns &middot; 9,800 sf total</span></div>
              <div className="fact-row"><span>Fencing</span><span className="v">Perimeter &amp; cross-fenced &mdash; field-net construction helps protect livestock from predators</span></div>
              <div className="fact-row"><span>Minerals</span><span className="v">Subject to review of current title commitments</span></div>
            </div>

            {/* BUILT, NOT PROMISED */}
            <div className="panel">
              <div className="panel-title">Built, Not Promised</div>
              <p style={s.p}>Sky Drift is already a functioning ranch with established water infrastructure, interior roads, bridges, grazing improvements, barns, residences, and guest accommodations underway. Rather than beginning with raw land, the next owner inherits years of thoughtful planning, investment, and stewardship.</p>
            </div>

            <div className="panel">
              <div className="panel-title">Aerial Tour</div>
              <div style={s.videoFrame}>
                <img src="/images/video-thumb.jpg" alt="Video thumbnail" style={s.videoThumbImg} />
                <div style={s.playBtn}>
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: 'var(--ink)', marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Photo Gallery</div>
              <div className="rgallery-2col">
                {(galleryExpanded ? GALLERY_IMAGES : GALLERY_IMAGES.slice(0, 6)).map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    style={{ ...s.galleryImg2col, cursor: 'pointer' }}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </div>
              {GALLERY_IMAGES.length > 6 && (
                <button
                  style={{ width: 'auto', display: 'inline-flex', marginTop: 16, border: '1px solid var(--ink)', background: 'none', cursor: 'pointer', padding: '12px 24px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  onClick={() => setGalleryExpanded(!galleryExpanded)}
                >
                  {galleryExpanded ? 'Show Less' : `View More (${GALLERY_IMAGES.length - 6} more)`}
                </button>
              )}
            </div>

            <div className="panel">
              <div className="panel-title">Concept Renderings</div>
              <div className="rgallery-2col">
                {RENDERED_IMAGES.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    style={{ ...s.galleryImg2col, cursor: 'pointer' }}
                    onClick={() => setLightboxIndex(GALLERY_IMAGES.length + i)}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 14 }}>
                Generated concept renderings &mdash; they&rsquo;re included to illustrate the finished look of the cabins and the broader vision for the property, not the current as-built condition.
              </p>
            </div>

            {/* IDEAL STEWARDS · CTA · DATA ROOM */}
            <div className="panel">
              <div className="panel-title">Brand Complete</div>
              <p style={s.p}>Identity, story, and an existing audience are already in place &mdash; a business with a head of steam, not a name to build from zero.</p>
              <div style={{ ...s.stackRow, marginTop: 10 }}>
                <span style={{ fontWeight: 600 }}>A Note on What&rsquo;s Included</span>
                <span style={s.stackBody}>Sky Drift can transfer as raw land and improvements, or as a going concern &mdash; brand, story, presale audience, and the ranch operation. We&rsquo;ll walk through the options privately so the structure fits how you intend to operate.</span>
              </div>
            </div>

            <p style={{ ...s.centeredLede, marginTop: 70 }}>The Ideal Stewards</p>
            <div className="panel">
              <p style={s.p}>Whether your vision is a private family legacy ranch, a regenerative working operation, or a boutique hospitality destination, Sky Drift provides the foundation that would take years to recreate.</p>
            </div>

            <div style={s.contactCard}>
              <div style={s.contactHeaderRow}>
                <img src="/images/kim-headshot.png" alt="Kim Hill" style={s.contactPhoto} />
                <div>
                  <span className="mono-label" style={{ color: 'var(--white)', opacity: 0.8 }}>Accredited Land Consultant</span>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--white)', margin: '4px 0 0' }}>Kim Hill</h3>
                </div>
                <img src="/images/kim-hill-logo.png" alt="Kim Hill Real Estate Group" style={s.contactLogo} />
                <div style={s.contactButtonRow}>
                  <a className="btn btn-dark" style={{ whiteSpace: 'nowrap' }} href="#">Schedule a Private Tour</a>
                  <a style={{ ...s.btnOutline, whiteSpace: 'nowrap' }} href="#">Ask a Question</a>
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginTop: 24 }}>
              <div className="panel-title">Data Room</div>
              <p style={{ ...s.p, marginBottom: 16 }}>Every document a qualified buyer expects &mdash; from the Offering Memorandum and due diligence package to infrastructure records, well information, and cabin documentation &mdash; is organized in one secure location.</p>
              <button className="btn btn-dark" style={{ width: 'auto', display: 'inline-flex', border: 'none', cursor: 'pointer' }} onClick={() => setDataRoomOpen(true)}>
                Open Data Room →
              </button>
            </div>
          </main>

          {dataRoomOpen && (
            <div style={s.lightboxOverlay} onClick={() => setDataRoomOpen(false)}>
              <div className="panel" style={s.dataRoomModal} onClick={(e) => e.stopPropagation()}>
                <button style={s.modalClose} onClick={() => setDataRoomOpen(false)} aria-label="Close">&times;</button>
                <div className="panel-title">Data Room</div>

                <div style={s.dataRoomItem}>
                  <h3 style={s.h3}>Confidential Offering Memorandum</h3>
                  <p style={s.p}>The full presentation &mdash; property story, verified ecological data, improvements, terms, and photography, in one document.</p>
                  <a className="btn btn-dark" style={{ width: 'auto', display: 'inline-flex' }} href="/documents/Sky-Drift-Offering-Memorandum.pdf" target="_blank">Download the Offering Memorandum →</a>
                </div>

                <div style={s.dataRoomItem}>
                  <h3 style={s.h3}>Confidential Due-Diligence Appendix</h3>
                  <p style={s.p}>Ownership, surveys, and historical title; parcel and mapping records; ecological monitoring data; well and water infrastructure; on-site sewage permits; and regulatory items. Preliminary seller-review compilation &mdash; not a title opinion or representation of completeness.</p>
                  <a className="btn btn-dark" style={{ width: 'auto', display: 'inline-flex' }} href="/documents/Sky-Drift-Due-Diligence-Appendix.pdf" target="_blank">Download the Due-Diligence Appendix →</a>
                </div>

                <div style={{ ...s.dataRoomItem, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <h3 style={s.h3}>Cabin Cost-to-Complete</h3>
                  <p style={s.p}>A four-cabin Luxury Guest Cabin retreat is roughly 70% complete. An itemized bid to finish construction is coming soon &mdash; so you can underwrite the upside yourself.</p>
                  <button className="btn btn-dark" style={{ width: 'auto', display: 'inline-flex', border: 'none', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    Download Cost-to-Complete Bid (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer style={{ background: 'var(--ink)', color: 'rgba(251,249,243,0.55)', padding: '30px 6vw', textAlign: 'center', fontSize: 12 }}>
            This page is confidential and provided under signed non-disclosure agreement. Do not forward or share.
          </footer>

          {lightboxIndex !== null && (
            <div
              style={s.lightboxOverlay}
              onClick={() => setLightboxIndex(null)}
            >
              <button
                style={{ ...s.lightboxNav, left: 20 }}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length); }}
                aria-label="Previous"
              >&larr;</button>

              <img
                src={ALL_GALLERY_IMAGES[lightboxIndex].src}
                alt={ALL_GALLERY_IMAGES[lightboxIndex].alt}
                style={s.lightboxImg}
                onClick={(e) => e.stopPropagation()}
              />

              <button
                style={{ ...s.lightboxNav, right: 20 }}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % ALL_GALLERY_IMAGES.length); }}
                aria-label="Next"
              >&rarr;</button>

              <button style={s.lightboxClose} onClick={() => setLightboxIndex(null)} aria-label="Close">&times;</button>

              <div style={s.lightboxCounter}>{lightboxIndex + 1} / {ALL_GALLERY_IMAGES.length}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}

const s = {
  nav: { background: 'var(--cream)', padding: '18px 6vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 18 },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoBadge: { width: 36, height: 36, background: 'transparent', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoIcon: { width: 19, height: 23 },
  verifiedPill: { fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontFamily: "'IBM Plex Mono', monospace" },
  pageHead: { position: 'relative', minHeight: '52vh', display: 'flex', alignItems: 'flex-end' },
  pageHeadImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  pageHeadScrim: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(29,27,22,0.92), rgba(29,27,22,0.3))' },
  heroClouds: { position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', width: 'min(340px, 40vw)', opacity: 0.85, zIndex: 1, pointerEvents: 'none' },
  pageHeadContent: { position: 'relative', zIndex: 2, paddingBottom: 40 },
  h1: { fontSize: 'clamp(2.2rem,4vw,3.2rem)', textTransform: 'uppercase', color: 'var(--white)' },
  centeredLede: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', textTransform: 'uppercase', textAlign: 'center', maxWidth: '24ch', margin: '0 auto 16px' },
  centeredBody: { fontFamily: "'Cormorant Garamond', serif", textAlign: 'center', maxWidth: '66ch', margin: '0 auto 60px', color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.75 },
  p: { fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink-soft)', fontSize: 16.5, lineHeight: 1.7 },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' },
  splitImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 },
  h2: { fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', marginBottom: 16, textTransform: 'uppercase' },
  h3: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', textTransform: 'uppercase', margin: '0 0 10px' },
  conceptCaption: { marginTop: 8, fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)' },
  landBlock: { display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 60, borderRadius: 6, overflow: 'hidden' },
  landMedia: { position: 'relative', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%' },
  landMediaImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  landScrim: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(29,27,22,0.35), rgba(29,27,22,0.6))' },
  landSide: { display: 'flex', flexDirection: 'column' },
  landCard: { margin: 0, position: 'relative', flex: 1, minHeight: 210, overflow: 'hidden' },
  landCardSolid: { position: 'absolute', inset: 0, background: 'var(--ink)' },
  landCaption: { position: 'relative', zIndex: 2, padding: '20px 22px', color: 'var(--white)', fontSize: 13, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  pillarGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: 'var(--line)' },
  pillarLight: { background: 'var(--white)', padding: '30px 22px' },
  pillarDark: { background: 'var(--ink)', padding: '30px 22px' },
  pillarImg: { position: 'relative', overflow: 'hidden', padding: '20px 22px 18px', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  pillarImgBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  pillarImgScrim: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(29,27,22,0) 0%, rgba(29,27,22,0) 45%, rgba(29,27,22,0.85) 100%)' },
  conceptGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 30, marginBottom: 40 },
  conceptImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4 },
  stackRow: { display: 'flex', flexDirection: 'column', gap: 6, padding: '13px 0', borderTop: '1px dotted var(--line)' },
  stackBody: { fontSize: 13.5, color: 'var(--ink-soft)' },
  proofTable: { width: '100%', borderCollapse: 'collapse' },
  proofTh: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--white)', background: 'var(--dusk)', padding: '10px 14px', textAlign: 'left' },
  proofTd: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, padding: '11px 14px', borderTop: '1px dotted var(--line)' },
  videoFrame: { position: 'relative', aspectRatio: '16/9', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 4 },
  videoThumbImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 },
  playBtn: { position: 'relative', zIndex: 2, width: 60, height: 60, borderRadius: '50%', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  gallery: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 },
  galleryImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 },
  galleryImg2col: { width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 4, display: 'block' },
  lightboxOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  lightboxImg: { maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 4 },
  lightboxNav: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--white)', fontSize: 28, width: 50, height: 50, borderRadius: '50%', cursor: 'pointer' },
  lightboxClose: { position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--white)', fontSize: 34, cursor: 'pointer', lineHeight: 1 },
  lightboxCounter: { position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 },
  twoCol: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start' },
  contactCard: { background: 'var(--dusk)', color: 'var(--white)', padding: 26, textAlign: 'left', borderRadius: 6 },
  contactHeaderRow: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  contactPhoto: { width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(251,249,243,0.3)', flexShrink: 0 },
  contactLogo: { width: 100, background: 'var(--white)', borderRadius: 4, padding: 6, flexShrink: 0 },
  contactButtonRow: { display: 'flex', gap: 10, marginLeft: 'auto', flexWrap: 'wrap' },
  modalClose: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 30, cursor: 'pointer', lineHeight: 1 },
  dataRoomModal: { position: 'relative', maxWidth: 560, width: '90vw', maxHeight: '85vh', overflowY: 'auto' },
  dataRoomItem: { borderBottom: '1px dotted var(--line)', marginBottom: 20, paddingBottom: 20 },
  btnOutline: { display: 'block', width: '100%', background: 'transparent', color: 'var(--white)', border: '1px solid rgba(251,249,243,0.4)', padding: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', textDecoration: 'none', borderRadius: 2 },
  photoPending: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', border: '1px dashed var(--ink-soft)', color: 'var(--ink-soft)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, textAlign: 'center', padding: 20 },
};
