import { Link } from 'react-router-dom'
import { useRevealAll } from '../hooks/useReveal'
import { LG } from '../components/LG'
import './TsismisHomePage.css'

const BAKES = [
  { name: 'Ube Halaya Tart',        price: 'From $16' },
  { name: 'Polvoron (6)',           price: 'From $10' },
  { name: 'Pasalubong Classic Box', price: 'From $38' },
  { name: 'Turon (3)',              price: 'From $9' },
  { name: 'Kutsinta (4)',           price: 'From $9' },
  { name: 'Leche Flan',             price: 'From $18' },
]

/* ══════════════════════════════════════════════════════════
   TsismisHomePage — Filipino-forward, cheeky, in on the secret
   ══════════════════════════════════════════════════════════ */
export default function TsismisHomePage() {
  const pageRef = useRevealAll()

  return (
    <div ref={pageRef}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="tp-hero" aria-label="Welcome to Tsismis">
        <div className="tp-hero__text">
          <p className="tp-hero__eyebrow">Handcrafted in Toronto · You Didn't Hear This From Me</p>
          <h1 className="tp-hero__headline">
            Every bite<br />comes with<br /><em>a secret.</em>
          </h1>
          <p className="tp-hero__sub">
            Filipino-inspired treats with a personality. Polvoron, ube everything,
            and pasalubong boxes made for gifting — and gossiping over.
          </p>
          <div className="tp-hero__actions">
            <Link to="/tsismis/menu" className="btn btn--ube">See the Menu</Link>
            <Link to="/story" className="btn btn--outline">Meet LG</Link>
          </div>
        </div>

        <div className="tp-hero__visual" aria-hidden="true">
          <div className="lg-photo">
            <LG pose="hero" className="lg-photo__img" />
          </div>
          <p className="tp-hero__lg-caption">
            LG has something to tell you. It's probably about dessert.
          </p>
        </div>
      </section>

      {/* ── INTRO STRIP ──────────────────────────────────── */}
      <div className="tp-strip">
        {[
          'Made to Order',
          'Toronto Pickup & Delivery',
          'Filipino-Inspired Flavours',
          'Custom Pasalubong Boxes',
        ].map((text) => (
          <div key={text} className="tp-strip__item">
            <span className="tp-strip__dot" aria-hidden="true" />
            <span className="tp-strip__text">{text}</span>
          </div>
        ))}
      </div>

      {/* ── BACK TO LIMT TEASER ──────────────────────────── */}
      <section className="tp-teaser reveal" aria-label="Also from Love in My Tummy">
        <div className="container tp-teaser__inner">
          <div>
            <span className="tp-teaser__label">Keeping It Between Us</span>
            <p className="tp-teaser__body">
              Tsismis comes from the same kitchen as Love in My Tummy — artisan
              breads, cakes, and everyday bakes, if that's more your (quieter) speed.
            </p>
          </div>
          <Link to="/" className="btn btn--blush">Visit Love in My Tummy</Link>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="tp-story section" id="story" aria-label="Our story">
        <div className="container">
          <div className="tp-story__inner">

            <div className="tp-story__visual reveal" aria-hidden="true">
              <LG pose="aboutIntro" className="lg-story-photo" />
              <p className="tp-story__lg-label">LG — Little Girl, Little Gossip.</p>
            </div>

            <div className="reveal">
              <p className="tp-story__eyebrow">Meet LG</p>
              <h2 className="tp-story__heading">
                She knows<br />the <em>tea.</em>
              </h2>
              <p className="tp-story__body">
                LG is our mascot — short for Little Girl, which is what Carolyn's
                dad called her growing up. Over here, she's the one whispering
                which tray just came out of the oven.
              </p>
              <p className="tp-story__body">
                Tsismis is Carolyn's love letter to the flavours she grew up
                with — ube, kalamay, polvoron, all the things worth telling
                someone about. Made fresh, made to order, made with pride.
              </p>
              <p className="tp-story__sig">— Carolyn</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURED BAKES ───────────────────────────────── */}
      <section className="tp-bakes section" id="bakes" aria-label="Featured bakes">
        <div className="container">
          <div className="tp-bakes__header reveal">
            <p className="tp-bakes__eyebrow">Word on the Street</p>
            <h2 className="tp-bakes__heading">What everyone's <em>talking about.</em></h2>
          </div>
        </div>

        <div className="tp-bakes__grid">
          {BAKES.map((item, i) => (
            <div
              key={item.name}
              className="tp-bake-card reveal"
              style={{ '--card-index': i }}
            >
              <div className="tp-bake-card__img" aria-hidden="true" />
              <div className="tp-bake-card__overlay" aria-hidden="true" />
              <div className="tp-bake-card__content">
                <p className="tp-bake-card__brand">Tsismis</p>
                <h3 className="tp-bake-card__name">{item.name}</h3>
                <p className="tp-bake-card__price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="container" style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/tsismis/menu" className="btn btn--ube">View Full Menu</Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="tp-how section" aria-label="How to order">
        <div className="container">
          <div className="tp-how__header reveal">
            <p className="tp-how__eyebrow">The Process</p>
            <h2 className="tp-how__heading">How to get <em>in on it.</em></h2>
          </div>
          <div className="tp-how__steps">
            {[
              {
                n: '1',
                title: 'Browse the Menu',
                desc: 'Have a look at what\'s baking. Custom pasalubong box in mind? We\'re listening.',
              },
              {
                n: '2',
                title: 'Send a Quote Request',
                desc: 'Tell us what you want, your pickup date, and any customizations. We confirm within 24 hours.',
              },
              {
                n: '3',
                title: 'Pickup or Delivery',
                desc: 'Fresh, made-to-order, ready exactly when you need it — for yourself, or to spill to a whole crowd.',
              },
            ].map((step) => (
              <div key={step.n} className="tp-how__step reveal">
                <span className="tp-how__num">{step.n}</span>
                <h3 className="tp-how__step-title">{step.title}</h3>
                <p className="tp-how__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
