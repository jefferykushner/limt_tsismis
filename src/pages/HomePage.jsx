import { Link } from 'react-router-dom'
import { useRevealAll } from '../hooks/useReveal'
import './HomePage.css'
import lgLimt from '../assets/lg-limt.png'
import lgTsismis from '../assets/lg-tsismis.png'

/* ── Bake card data ───────────────────────────────────────── */
const BAKES = [
  { brand: 'limt',    name: 'Ube Swirl Milk Bread',    price: 'From $14' },
  { brand: 'tsismis', name: 'Ube Halaya Tart',          price: 'From $16' },
  { brand: 'limt',    name: 'Basque Cheesecake',        price: 'From $28' },
  { brand: 'tsismis', name: 'Polvoron (6)',              price: 'From $10' },
  { brand: 'limt',    name: 'Chicken Empanadas',        price: 'From $13' },
  { brand: 'tsismis', name: 'Pasalubong Classic Box',   price: 'From $38' },
]

const BRAND_LABEL = {
  limt:    'Love in My Tummy',
  tsismis: 'Tsismis',
}

/* ══════════════════════════════════════════════════════════
   HomePage
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
            Artisan bakes made with care, culture, and a little something extra.
            Sweet, savoury, and Filipino-inspired.
          </p>
          <div className="hp-hero__actions">
            <Link to="/menu" className="btn btn--filled">See What's Baking</Link>
            <Link to="/story" className="btn btn--outline">Meet LG</Link>
          </div>
        </div>

        <div className="hp-hero__visual" aria-hidden="true">
          <div className="hp-hero__lg-wrap">
            <div className="lg-photo"><img src={lgLimt} alt="" className="lg-photo__img" /></div>
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
          'Filipino-Inspired Flavours',
        ].map((text) => (
          <div key={text} className="hp-strip__item">
            <span className="hp-strip__dot" aria-hidden="true" />
            <span className="hp-strip__text">{text}</span>
          </div>
        ))}
      </div>

      {/* ── TWO BRANDS ───────────────────────────────────── */}
      <section className="hp-brands" aria-label="Our brands">
        <div className="hp-brands__panel hp-brands__panel--limt reveal">
          <span className="hp-brands__label">The Parent Brand</span>
          <h2 className="hp-brands__name">
            Love in<br />My <em>Tummy</em>
          </h2>
          <p className="hp-brands__desc">
            Artisan breads, cakes, and pastries made in small batches — the kind
            of baking that turns an ordinary Tuesday into something worth remembering.
          </p>
          <span className="hp-brands__tagline">Handcrafted Treats · Sweet &amp; Savoury</span>
          <Link to="/menu" className="btn btn--blush">Explore the Menu</Link>
        </div>

        <div className="hp-brands__panel hp-brands__panel--tsismis reveal">
          <img src={lgTsismis} alt="" className="hp-brands__lg" />
          <span className="hp-brands__label">The Breakout Child</span>
          <h2 className="hp-brands__name">
            Tsismis<em>.</em>
          </h2>
          <p className="hp-brands__desc">
            Filipino-inspired treats with a personality. Polvoron, ube everything,
            lambing sweets, and pasalubong boxes made for gifting. You didn't hear
            this from us.
          </p>
          <span className="hp-brands__tagline">You Didn't Hear This From Me</span>
          <Link to="/tsismis" className="btn btn--ube">Discover Tsismis</Link>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="hp-story section" id="story" aria-label="Our story">
        <div className="container">
          <div className="hp-story__inner">

            <div className="hp-story__visual reveal" aria-hidden="true">
              <img src={lgLimt} alt="LG, the Love in My Tummy mascot" className="lg-story-photo" />
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
                Carolyn bakes from a place of love and cultural pride. Half the menu
                is comfort — the kind of thing you want when the weather turns. The
                other half is Filipino-inspired, a celebration of the flavours that
                shaped her.
              </p>
              <p className="hp-story__body">
                Everything is made to order. Nothing sits on a shelf. That's the deal.
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
              className={`hp-bake-card hp-bake-card--${item.brand} reveal`}
              style={{ '--card-index': i }}
            >
              {/* Swap div below for <img> when product photos are ready */}
              <div className="hp-bake-card__img" aria-hidden="true" />
              <div className="hp-bake-card__overlay" aria-hidden="true" />
              <div className="hp-bake-card__content">
                <p className="hp-bake-card__brand">{BRAND_LABEL[item.brand]}</p>
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
                desc: 'Explore LIMT and Tsismis offerings. Have something custom in mind? We love those conversations too.',
              },
              {
                n: '2',
                title: 'Send a Quote Request',
                desc: 'Fill out a short form with what you would like, your preferred pickup date, and any customizations. We confirm within 24 hours.',
              },
              {
                n: '3',
                title: 'Pickup or Delivery',
                desc: 'Collect from our Toronto location or arrange local delivery. Payment at confirmation. Everything is freshly baked for you.',
              },
            ].map((step) => (
              <div key={step.n} className="hp-how__step reveal">
                <div className="hp-how__step-num">{step.n}</div>
                <h3 className="hp-how__step-title">{step.title}</h3>
                <p className="hp-how__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ─────────────────────────────────── */}
      <section className="hp-signup" aria-label="Stay in the loop">
        <div className="hp-signup__inner reveal">
          <p className="hp-signup__eyebrow">Join the Secret</p>
          <h2 className="hp-signup__heading">
            Be the first<br />to <em>hear.</em>
          </h2>
          <p className="hp-signup__sub">
            New drops, seasonal specials, and the occasional piece of tsismis —
            straight to your inbox.
          </p>
          {/* Netlify Forms wiring — name attr is required for Netlify to detect */}
          <form
            className="hp-signup__form"
            name="newsletter"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <input type="hidden" name="bot-field" />
            <input
              className="hp-signup__input"
              type="email"
              name="email"
              placeholder="your@email.com"
              aria-label="Email address"
              required
            />
            <button type="submit" className="hp-signup__btn">Subscribe</button>
          </form>
          <p className="hp-signup__note">No spam. Just the good stuff. Unsubscribe any time.</p>
        </div>
      </section>

    </div>
  )
}
