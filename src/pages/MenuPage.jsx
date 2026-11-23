import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { supabase } from '../lib/supabaseClient'
import { money } from '../admin/invoiceMath'
import './MenuPage.css'

/* One-line subtitles per category. A category not listed here simply has none. */
const CATEGORY_SUBTITLE = {
  'Celebration Cakes': 'Made to order for the moments worth celebrating.',
  'Cupcakes & Mini Cakes': 'Individual-sized versions of your favourite flavours.',
  'Cookies & Bars': 'Baked in small batches, always.',
  'Filipino-Inspired Sweets': 'The flavours Carolyn grew up on, made with care.',
  'Pastries & Breakfast Bakes': 'For slow mornings and quick ones alike.',
  'Savoury Breads & Bakes': 'For when you want something other than sweet.',
  'Cheesecakes, Tarts & Pies': 'Rich, creamy, and worth the fork fight.',
  'Treat Boxes & Party Platters': 'Assorted favourites, ready to share.',
}

const INTRO = {
  limt: {
    title: 'The menu',
    body: 'Everything is made to order in small batches. Prices are a starting point; custom sizes and flavours are always welcome.',
  },
  tsismis: {
    title: 'The goods',
    body: "Filipino favourites first, everything else right behind. Made to order, so tell us what you're craving.",
  },
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function buildSections(products, brandKey) {
  const byCategory = new Map()
  for (const item of products) {
    if (item.brand_id !== brandKey && !item.shown_both_brands) continue
    const cat = item.category || 'More'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat).push(item)
  }
  return [...byCategory.entries()].map(([category, items]) => ({
    id: slugify(category),
    heading: category,
    subtitle: CATEGORY_SUBTITLE[category] || null,
    items,
  }))
}

function tagsFor(item) {
  const tags = []
  if (item.featured) tags.push({ label: 'Favourite', kind: 'accent' })
  if (item.seasonal) tags.push({ label: 'Seasonal', kind: 'accent' })
  for (const t of item.dietary_tags || []) tags.push({ label: t, kind: 'plain' })
  return tags
}

function MenuItem({ item }) {
  const tags = tagsFor(item)
  const hasPrice = item.base_price !== null && item.base_price !== undefined
  return (
    <li className="menu-item">
      <div className="menu-item__head">
        <h3 className="menu-item__name">{item.name}</h3>
        <span className="menu-item__leader" aria-hidden="true" />
        <span className={`menu-item__price ${hasPrice ? '' : 'is-muted'}`}>
          {hasPrice ? `${item.price_type ? `${item.price_type} ` : ''}${money(item.base_price)}` : 'Price on request'}
        </span>
      </div>
      {item.description && <p className="menu-item__desc">{item.description}</p>}
      {(tags.length > 0 || (item.allergens || []).length > 0) && (
        <p className="menu-item__tags">
          {tags.map((t) => (
            <span key={t.label} className={`menu-tag menu-tag--${t.kind}`}>{t.label}</span>
          ))}
          {(item.allergens || []).length > 0 && (
            <span className="menu-item__allergens">Contains: {item.allergens.join(', ')}</span>
          )}
        </p>
      )}
    </li>
  )
}

export default function MenuPage() {
  const brand = useBrand()
  const paths = brandPaths(brand.key)
  const intro = INTRO[brand.key] ?? INTRO.limt
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('products')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) setProducts(data)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const sections = useMemo(() => buildSections(products, brand.key), [products, brand.key])

  // Highlight the section in view in the jump bar.
  useEffect(() => {
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="menu-page">
      <header className="wrap menu-intro">
        <h1 className="display menu-intro__title">{intro.title}</h1>
        <p className="lede">{intro.body}</p>
      </header>

      {!loading && sections.length > 0 && (
        <nav className="menu-jump" aria-label="Menu sections">
          <ul className="menu-jump__list">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={activeId === s.id ? 'is-active' : ''} aria-current={activeId === s.id ? 'true' : undefined}>
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="wrap menu-body">
        {loading ? (
          <p className="menu-status">Loading the menu…</p>
        ) : sections.length === 0 ? (
          <p className="menu-status">Nothing is on the menu yet. Check back soon.</p>
        ) : (
          sections.map((section) => (
            <section key={section.id} id={section.id} className="menu-section" aria-labelledby={`${section.id}-title`}>
              <div className="menu-section__head">
                <h2 id={`${section.id}-title`} className="heading menu-section__title">{section.heading}</h2>
                {section.subtitle && <p className="menu-section__subtitle">{section.subtitle}</p>}
              </div>
              <ul className="menu-section__items">
                {section.items.map((item) => <MenuItem key={item.id} item={item} />)}
              </ul>
            </section>
          ))
        )}

        <aside className="menu-cta">
          <h2 className="subheading">Something special in mind?</h2>
          <p>Custom flavours, event platters and gift boxes are always welcome. Tell us what you’re planning.</p>
          <Link to={paths.order} className="button">Place an order</Link>
        </aside>

        <p className="menu-allergen">
          <strong>About allergens.</strong> Tags on each item list the allergens in that recipe. Everything is made in one
          kitchen that handles wheat, dairy, eggs and tree nuts, so traces are possible even when they aren’t listed.
          If you have a severe allergy, please get in touch before ordering.
        </p>
      </div>
    </div>
  )
}
