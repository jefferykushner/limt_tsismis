import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { brandPaths } from '../brand/brandPaths'
import { useRevealAll } from '../hooks/useReveal'
import { useBrand } from '../brand/BrandContext'
import { supabase } from '../lib/supabaseClient'
import { money } from '../admin/invoiceMath'
import './MenuPage.css'

/* Light, brand-neutral one-liners per category. Categories not listed here
   simply render without a subtitle — nothing breaks if Carolyn adds a new
   category from the admin that isn't in this map yet. */
const CATEGORY_SUBTITLE = {
  'Celebration Cakes': 'Made to order for the moments worth celebrating.',
  'Cupcakes & Mini Cakes': 'Individual-sized versions of your favourite flavours.',
  'Cookies & Bars': 'Baked in small batches, always.',
  'Filipino-Inspired Sweets': 'Classic flavours from home, made with care.',
  'Pastries & Breakfast Bakes': 'For slow mornings and quick ones alike.',
  'Savoury Breads & Bakes': 'When you want something other than sweet.',
  'Cheesecakes, Tarts & Pies': 'Rich, creamy, and worth the fork fight.',
  'Treat Boxes & Party Platters': 'Assorted favourites, ready to share.',
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function buildTags(item) {
  const tags = []
  if (item.featured) tags.push({ label: 'Featured', type: 'brand' })
  if (item.seasonal) tags.push({ label: 'Seasonal', type: 'seasonal' })
  for (const tag of item.dietary_tags || []) tags.push({ label: tag, type: 'note' })
  for (const tag of item.allergens || []) tags.push({ label: tag, type: 'note' })
  return tags
}

function buildMenuForBrand(products, brand) {
  const items = products.filter((p) => p.brand_id === brand || p.shown_both_brands)
  const byCategory = new Map()
  for (const item of items) {
    const cat = item.category || 'More'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat).push(item)
  }
  return [...byCategory.entries()].map(([category, catItems]) => ({
    id: `${brand}-${slugify(category)}`,
    label: category,
    heading: category,
    subtitle: CATEGORY_SUBTITLE[category] || null,
    items: catItems,
  }))
}

/* ── Sub-components ──────────────────────────────────────── */
function Tag({ label, type, brand }) {
  return <span className={`menu-tag menu-tag--${type} menu-tag--${brand}`}>{label}</span>
}

function MenuItem({ item, brand }) {
  const tags = buildTags(item)
  const hasPrice = item.base_price !== null && item.base_price !== undefined
  return (
    <div className={`menu-item menu-item--${brand}`}>
      <span className="menu-item__name">{item.name}</span>
      <span className={`menu-item__price ${hasPrice ? '' : 'menu-item__price--muted'}`}>
        {hasPrice ? `${item.price_type ? item.price_type + ' ' : ''}${money(item.base_price)}` : 'Ask for pricing'}
      </span>
      {item.description && <p className="menu-item__desc">{item.description}</p>}
      {tags.length > 0 && (
        <div className="menu-item__tags">
          {tags.map((t, i) => <Tag key={`${item.id}-${t.label}-${i}`} {...t} brand={brand} />)}
        </div>
      )}
    </div>
  )
}

function OrderCTA({ brand }) {
  const isLimt = brand === 'limt'
  return (
    <div className="menu-cta">
      <p className="menu-cta__eyebrow">{isLimt ? 'Place a Custom Order' : 'Catering & Events'}</p>
      <h3 className="menu-cta__heading">{isLimt ? 'Something special in mind?' : 'Feeding a crowd?'}</h3>
      <p className="menu-cta__body">
        {isLimt
          ? 'Celebrate with a custom cake, gift box, or event order. We would love to make something just for you.'
          : "Custom meryenda spreads, pasalubong stations, and event catering. Tell us what you're planning and we'll make it happen."}
      </p>
      <Link to={brandPaths(brand).order} className={`btn ${isLimt ? 'btn--blush' : 'btn--ube'}`}>
        {isLimt ? 'Request a Quote' : 'Get in Touch'}
      </Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MenuPage — reads live from Supabase `products`
   ══════════════════════════════════════════════════════════ */
export default function MenuPage() {
  const brandFromUrl = useBrand()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  // Starts on whichever brand the URL implies (BrandContext reads the path —
  // "/menu" resolves to limt, "/tsismis/menu" resolves to tsismis). Purely an
  // initial value: once loaded, the brand-pill toggle still works exactly as
  // before and doesn't get overridden if the URL itself doesn't change.
  const [activeBrand, setActiveBrand] = useState(brandFromUrl.key)
  const [activeTab, setActiveTab] = useState(null)
  const pageRef = useRevealAll()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order')
      if (!error && data) setProducts(data)
      setLoading(false)
    }
    load()
  }, [])

  const menu = useMemo(() => ({
    limt: buildMenuForBrand(products, 'limt'),
    tsismis: buildMenuForBrand(products, 'tsismis'),
  }), [products])

  // Once data loads, default the active tab to the first section of the active brand.
  useEffect(() => {
    if (!activeTab && menu[activeBrand]?.length > 0) {
      setActiveTab(menu[activeBrand][0].id)
    }
  }, [menu, activeBrand, activeTab])

  const switchBrand = (brand) => {
    setActiveBrand(brand)
    const firstSection = menu[brand][0]?.id
    if (firstSection) {
      setActiveTab(firstSection)
      document.getElementById(firstSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToSection = (id, brand) => {
    if (brand !== activeBrand) setActiveBrand(brand)
    setActiveTab(id)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const currentSections = menu[activeBrand]

  return (
    <div ref={pageRef}>

      {/* ── Brand header ──────────────────────────────────── */}
      <header className="menu-header">
        <p className="menu-header__eyebrow">Handcrafted in Toronto · Order for pickup or delivery</p>
        <div className="menu-header__lockup">
          <button
            className={`brand-pill brand-pill--limt ${activeBrand === 'limt' ? 'active' : ''}`}
            onClick={() => switchBrand('limt')}
          >
            <span className="brand-pill__name">Love in My Tummy</span>
          </button>
          <div className="brand-divider" aria-hidden="true" />
          <button
            className={`brand-pill brand-pill--tsismis ${activeBrand === 'tsismis' ? 'active' : ''}`}
            onClick={() => switchBrand('tsismis')}
          >
            <span className="brand-pill__name">Tsismis</span>
          </button>
        </div>
      </header>

      {/* ── Sticky section nav ────────────────────────────── */}
      {!loading && (
        <nav className="menu-nav" aria-label="Menu sections">
          <div className="menu-nav__inner">
            {Object.entries(menu).flatMap(([brand, sections]) =>
              sections.map((s) => (
                <button
                  key={s.id}
                  className={`menu-nav__tab ${activeTab === s.id ? 'active' : ''} menu-nav__tab--${brand} ${activeBrand !== brand ? 'dimmed' : ''}`}
                  onClick={() => scrollToSection(s.id, brand)}
                  data-brand={brand}
                >
                  {s.label}
                </button>
              ))
            )}
          </div>
        </nav>
      )}

      {/* ── Menu content ──────────────────────────────────── */}
      <main className="menu-main">
        {loading ? (
          <p className="menu-loading">Loading the menu…</p>
        ) : currentSections.length === 0 ? (
          <p className="menu-loading">Nothing published here yet — check back soon.</p>
        ) : (
          currentSections.map((section, idx) => (
            <section key={section.id} id={section.id} className="menu-section">

              <div className={`whisper whisper--${activeBrand}`}>
                <div className="whisper__line" />
                <span className="whisper__label">
                  {activeBrand === 'limt' ? 'Love in My Tummy' : 'Tsismis'}
                </span>
                <div className="whisper__line" />
              </div>

              <h2 className="menu-section__heading">{section.heading}</h2>
              {section.subtitle && <p className="menu-section__subtitle">{section.subtitle}</p>}

              {section.items.map((item) => (
                <MenuItem key={item.id} item={item} brand={activeBrand} />
              ))}

              {idx === currentSections.length - 1 && <OrderCTA brand={activeBrand} />}
            </section>
          ))
        )}

        <div className="menu-allergen">
          <strong>Allergen Information</strong>
          Tags shown on each item reflect the ingredients on file for that recipe. All items are prepared in one
          kitchen that regularly handles wheat, dairy, eggs, and tree nuts, so trace cross-contact is possible even
          where it isn't listed on a specific item. Please reach out before ordering if you have a severe allergy.
        </div>
      </main>

    </div>
  )
}
