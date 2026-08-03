import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRevealAll } from '../hooks/useReveal'
import { LG } from '../components/LG'
import { supabase } from '../lib/supabaseClient'
import { money } from '../admin/invoiceMath'
import './TsismisHomePage.css'

/* ══════════════════════════════════════════════════════════
   TsismisHomePage
   ══════════════════════════════════════════════════════════ */
export default function TsismisHomePage() {
  const pageRef = useRevealAll()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .or('brand_id.eq.tsismis,shown_both_brands.eq.true')
        .order('sort_order')
        .limit(6)
      if (!error && data) setItems(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div ref={pageRef} className="ts-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="ts-hero" aria-label="Welcome to Tsismis">
        <div className="ts-hero__text">
          <p className="ts-hero__eyebrow">You Didn't Hear This From Me</p>
          <h1 className="ts-hero__headline">
            The bakery<br />everyone's<br /><em>talking about.</em>
          </h1>
          <p className="ts-hero__sub">
            Filipino-inspired treats with a personality problem. Ube everything,
            pasalubong boxes, and the kind of sweets that start conversations.
            We won't say who told us to make these. (It was Carolyn.)
          </p>
          <div className="ts-hero__actions">
            <Link to="/menu" className="btn btn--ube">See the Goods</Link>
            <a href="#story" className="btn btn--outline-ube">Spill the Tea</a>
          </div>
        </div>

        <div className="ts-hero__visual" aria-hidden="true">
          <div className="ts-hero__lg-wrap">
            <LG pose="hero" breakout className="ts-hero__lg-img" />
            <p className="ts-hero__lg-caption">
              LG — same mascot, messier mouth.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO STRIP ──────────────────────────────────── */}
      <div className="ts-strip">
        {[
          'Filipino-Inspired',
          'Made to Order',
          'Toronto Pickup & Delivery',
          "Ask Us Anything (We'll Probably Tell You)",
        ].map((text) => (
          <div key={text} className="ts-strip__item">
            <span className="ts-strip__dot" aria-hidden="true" />
            <span className="ts-strip__text">{text}</span>
          </div>
        ))}
      </div>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="ts-story section" id="story" aria-label="About Tsismis">
        <div className="container">
          <div className="ts-story__inner">

            <div className="ts-story__visual reveal" aria-hidden="true">
              <LG pose="aboutIntro" className="ts-story__lg-img" />
              <p className="ts-story__lg-label">LG, mid-secret.</p>
            </div>

            <div className="reveal">
              <p className="ts-story__eyebrow">The Whole Story (Allegedly)</p>
              <h2 className="ts-story__heading">
                Tsismis means<br /><em>gossip.</em>
              </h2>
              <p className="ts-story__body">
                Tsismis is the breakout child of Love in My Tummy — same kitchen,
                same LG, a lot more attitude. This is where Carolyn's love for
                Filipino flavours gets to be as loud, cheeky, and unapologetic as
                it wants to be.
              </p>
              <p className="ts-story__body">
                Ube, pandan, calamansi, macapuno — the flavours she grew up on,
                made the way she actually wants to make them. If LIMT is the
                warm hug, Tsismis is the friend who tells you the good stuff
                first and asks questions later.
              </p>
              <p className="ts-story__body">
                Everything's still made to order, still made by hand. We just
                talk about it differently.
              </p>
              <p className="ts-story__sig">— LG, allegedly</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURED ITEMS ───────────────────────────────── */}
      <section className="ts-menu section" aria-label="What's baking at Tsismis">
        <div className="container">
          <div className="ts-menu__header reveal">
            <p className="ts-menu__eyebrow">Currently Being Discussed</p>
            <h2 className="ts-menu__heading">What's <em>brewing.</em></h2>
          </div>
        </div>

        {loading ? (
          <p className="ts-menu__loading">Loading the goods…</p>
        ) : items.length === 0 ? (
          <p className="ts-menu__loading">New things are coming — check back soon.</p>
        ) : (
          <div className="ts-menu__grid">
            {items.map((item, i) => (
              <div key={item.id} className="ts-item-card reveal" style={{ '--card-index': i }}>
                <div
                  className="ts-item-card__img"
                  style={item.image_url ? { backgroundImage: `url(${item.image_url})` } : undefined}
                  aria-hidden="true"
                />
                <div className="ts-item-card__overlay" aria-hidden="true" />
                <div className="ts-item-card__content">
                  <h3 className="ts-item-card__name">{item.name}</h3>
                  <p className="ts-item-card__price">
                    {item.base_price ? money(item.base_price) : 'Ask for pricing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
          <Link to="/menu" className="btn btn--ube">View Full Menu</Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="ts-cta" aria-label="Order from Tsismis">
        <div className="container ts-cta__inner reveal">
          <p className="ts-cta__eyebrow">Catering &amp; Custom Orders</p>
          <h2 className="ts-cta__heading">Ready to <em>spill</em> your order?</h2>
          <p className="ts-cta__body">
            Meryenda spreads, pasalubong stations, event catering, or just a box
            of turon for yourself — no judgment. Tell us what you're planning.
          </p>
          <Link to="/order" className="btn btn--ube">Get in Touch</Link>
        </div>
      </section>

    </div>
  )
}
