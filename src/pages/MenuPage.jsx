import { useState } from 'react'
import { useBrand } from '../brand/BrandContext'
import { useMenu } from '../hooks/useMenu'
import { useRevealAll } from '../hooks/useReveal'
import { money } from '../admin/invoiceMath'
import './MenuPage.css'

/* ══════════════════════════════════════════════════════════
   MenuPage — single-brand, driven by whichever brand the route
   resolves to (via BrandContext) and the live products table
   (via useMenu). No more in-page brand switcher: the route is the
   switcher now (/menu vs /tsismis/menu).
   ══════════════════════════════════════════════════════════ */
export default function MenuPage() {
  const brand = useBrand()
  const { sections, loading, error } = useMenu(brand.key)
  const [activeTab, setActiveTab] = useState(null)
  const pageRef = useRevealAll()

  const currentTab = activeTab || sections[0]?.id

  const scrollToSection = (id) => {
    setActiveTab(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={pageRef}>

      {/* ── Brand header ──────────────────────────────────── */}
      <header className="menu-header">
        <p className="menu-header__eyebrow">Handcrafted in Toronto · Order for pickup or delivery</p>
        <h1 className={`menu-header__name menu-header__name--${brand.key}`}>{brand.label}</h1>
      </header>

      {/* ── Sticky section nav ────────────────────────────── */}
      {sections.length > 0 && (
        <nav className="menu-nav" aria-label="Menu sections">
          <div className="menu-nav__inner">
            {sections.map((s) => (
              <button
                key={s.id}
                className={`menu-nav__tab menu-nav__tab--${brand.key} ${currentTab === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                {s.heading}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ── Menu content ──────────────────────────────────── */}
      <main className="menu-main">
        {loading && <div className="dash-empty">Loading menu…</div>}

        {error && (
          <div className="dash-empty">
            Something went wrong loading the menu. Please try refreshing.
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="dash-empty">
            The menu is being updated — check back shortly.
          </div>
        )}

        {sections.map((section) => (
          <section key={section.id} id={section.id} className="menu-section">

            <div className={`whisper whisper--${brand.key}`}>
              <div className="whisper__line" />
              <span className="whisper__label">{brand.label}</span>
              <div className="whisper__line" />
            </div>

            <h2 className="menu-section__heading">{section.heading}</h2>
            {section.subtitle && <p className="menu-section__subtitle">{section.subtitle}</p>}

            {section.items.map((item) => (
              <MenuItem key={item.id} item={item} brand={brand.key} />
            ))}

            <OrderCTA brand={brand.key} />
          </section>
        ))}

        <div className="menu-allergen">
          <strong>Allergen Information</strong>
          All items are prepared in a home kitchen that handles wheat, eggs, dairy, tree nuts, and sesame.
          Please reach out before ordering if you have a severe allergy. Gluten-free and dairy-free options
          are noted but produced in a shared environment.
        </div>
      </main>

    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────── */
function Tag({ label, brand }) {
  return <span className={`menu-tag menu-tag--note menu-tag--${brand}`}>{label}</span>
}

function MenuItem({ item, brand }) {
  return (
    <div className={`menu-item menu-item--${brand}`}>
      {item.image_url && (
        <img src={item.image_url} alt="" className="menu-item__img" />
      )}
      <span className="menu-item__name">{item.name}</span>
      {item.base_price != null && (
        <span className="menu-item__price">{money(item.base_price)}</span>
      )}
      {item.description && <p className="menu-item__desc">{item.description}</p>}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="menu-item__tags">
          {item.tags.map((t) => <Tag key={t} label={t} brand={brand} />)}
        </div>
      )}
    </div>
  )
}

function OrderCTA({ brand }) {
  const isLimt = brand === 'limt'
  return (
    <div className="menu-cta">
      <p className="menu-cta__eyebrow">
        {isLimt ? 'Place a Custom Order' : 'Catering & Events'}
      </p>
      <h3 className="menu-cta__heading">
        {isLimt ? 'Something special in mind?' : 'Feeding a crowd?'}
      </h3>
      <p className="menu-cta__body">
        {isLimt
          ? 'Celebrate with a custom cake, gift box, or event order. We would love to make something just for you.'
          : 'Custom meryenda spreads, pasalubong stations, and event catering. Tell us what you\'re planning and we\'ll make it happen.'}
      </p>
      <a href="/order" className={`btn ${isLimt ? 'btn--blush' : 'btn--ube'}`}>
        {isLimt ? 'Request a Quote' : 'Get in Touch'}
      </a>
    </div>
  )
}
