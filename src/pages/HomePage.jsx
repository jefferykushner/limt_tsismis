import { Link } from 'react-router-dom'
import { useRevealAll } from '../hooks/useReveal'
import { LG } from '../components/LG'
import './HomePage.css'

/* ── Bake card data ───────────────────────────────────────── */
/* LIMT only now — Tsismis has its own featured bakes on TsismisHomePage. */
const BAKES = [
  { name: 'Ube Swirl Milk Bread', price: 'From $14' },
  { name: 'Basque Cheesecake',    price: 'From $28' },
  { name: 'Chicken Empanadas',    price: 'From $13' },
  { name: 'Sourdough Loaf',       price: 'From $12' },
  { name: 'Crinkle Cookies (6)',  price: 'From $11' },
  { name: 'Custom Celebration Cake', price: 'From $65' },
]

/* ══════════════════════════════════════════════════════════
   HomePage — Love in My Tummy
   ══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const pageRef = useRevealAll()

  return (
    <div ref={pageRef}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hp-hero" aria-label="Welcome">
        <div className="hp-hero__text">
          <p className="hp-hero__eyebrow">Handcrafted in Toronto</p>
          <h1 className="hp-hero__headline">
            Every recipe<br />has a<br /><em>story.</em>
          </h1>
          <p className="hp-hero__sub">
            Artisan bakes made with care, small batches, and real ingredients.
            Sweet, savoury, and made to order.
          </p>
          <div className="hp-hero__actions">
            <Link to="/menu" className="btn btn--filled">See What's Baking</Link>
            <Link to="/story" className="btn btn--outline">Meet LG</Link>
          </div>
        </div>

        <div className="hp-hero__visual" aria-hidden="true">
          <div className="hp-hero__lg-wrap">
            <div className="lg-photo">
              <LG pose="hero" className="lg-photo__img" />
            </div>
            <p className="hp-hero__lg-caption">
              LG — she's the heart of everything we make.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO STRIP ──────────────────────────────────── */}
      <div className="hp-strip">
        {[
          'Made to Order',
          'Toronto Pickup & Delivery',
          'Custom Orders Welcome',
          'Small Batch, Real Ingredients',
        ].map((text) => (
          <div key={text} className="hp-strip__item">
            <span className="hp-strip__dot" aria-hidden="true" />
            <span className="hp-strip__text">{text}</span>
          </div>
        ))}
      </div>

      {/* ── DISCOVER TSISMIS TEASER ──────────────────────── */}
      <section className="hp-teaser reveal" aria-label="Discover Tsismis">
        <div className="container hp-teaser__inner">
          <div>
            <span className="hp-teaser__label">Psst — Have You Heard?</span>
            <p className="hp-teaser__body">
              We also bake Tsismis — Filipino-inspired treats with a whole
              other personality. Same kitchen, same LG, different vibe entirely.
            </p>
          </div>
          <Link to="/tsismis" className="btn btn--ube">Discover Tsismis</Link>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="hp-story section" id="story" aria-label="Our story">
        <div className="container">
          <div className="hp-story__inner">

            <div className="hp-story__visual reveal" aria-hidden="true">
              <LG pose="aboutIntro" className="lg-story-photo" />
              <p className="hp-story__lg-label">LG — Little Girl, Little Gossip.</p>
            </div>

            <div className="reveal">
              <p className="hp-story__eyebrow">Meet LG</p>
              <h2 className="hp-story__heading">
                The heart<br />behind the <em>bakes.</em>
              </h2>
              <p className="hp-story__body">
                LG is our mascot — short for Little Girl, which is what Carolyn's
                dad called her growing up. She's the warmth in every loaf, the detail
                in every crinkle cookie, the reason we care so much about getting
                each thing right.
              </p>
              <p className="hp-story__body">
                Carolyn bakes from a place of love — handmade, small batch, and
                made with real ingredients. Nothing sits on a shelf. Everything
                is made to order, exactly the way it should be.
              </p>
              <p className="hp-story__sig">— Carolyn</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURED BAKES ───────────────────────────────── */}
      <section className="hp-bakes section" id="bakes" aria-label="Featured bakes">
        <div className="container">
          <div className="hp-bakes__header reveal">
            <p className="hp-bakes__eyebrow">From the Kitchen</p>
            <h2 className="hp-bakes__heading">What we're <em>baking.</em></h2>
          </div>
        </div>

        <div className="hp-bakes__grid">
          {BAKES.map((item, i) => (
            <div
              key={item.name}
              className="hp-bake-card reveal"
              style={{ '--card-index': i }}
            >
              {/* Swap div below for <img> when product photos are ready */}
              <div className="hp-bake-card__img" aria-hidden="true" />
              <div className="hp-bake-card__overlay" aria-hidden="true" />
              <div className="hp-bake-card__content">
                <p className="hp-bake-card__brand">Love in My Tummy</p>
                <h3 className="hp-bake-card__name">{item.name}</h3>
                <p className="hp-bake-card__price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="container" style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/menu" className="btn btn--filled">View Full Menu</Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="hp-how section" aria-label="How to order">
        <div className="container">
          <div className="hp-how__header reveal">
            <p className="hp-how__eyebrow">The Process</p>
            <h2 className="hp-how__heading">How <em>ordering</em> works.</h2>
          </div>
          <div className="hp-how__steps">
            {[
              {
                n: '1',
                title: 'Browse the Menu',
                desc: 'Explore what\'s baking. Have something custom in mind? We love those conversations too.',
              },
              {
                n: '2',
                title: 'Send a Quote Request',
                desc: 'Fill out a short form with what you would like, your preferred pickup date, and any customizations. We confirm within 24 hours.',
              },
              {
                n: '3',
                title: 'Pickup or Delivery',
                desc: 'Fresh, made-to-order, ready exactly when you need it — for yourself or a whole event.',
              },
            ].map((step) => (
              <div key={step.n} className="hp-how__step reveal">
                <span className="hp-how__num">{step.n}</span>
                <h3 className="hp-how__step-title">{step.title}</h3>
                <p className="hp-how__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
