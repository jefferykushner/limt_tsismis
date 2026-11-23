import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { money } from '../admin/invoiceMath'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import Watercolour from './art/Watercolour'
import { Cookie, WarmBrownie, Heart, Sun } from './art/LineArt'
import './FeaturedProducts.css'

const MIN_ITEMS = 4
const MAX_ITEMS = 8

/*
  The home page's featured menu. Shows items Carolyn has starred (the
  "Featured" box on an item, or "Feature on Homepage" on a category) for
  the active brand; if fewer than four are starred, tops up with the next
  items on the menu so the row never looks empty.
*/
export default function FeaturedProducts() {
  const brand = useBrand()
  const content = brandContent(brand.key)
  const paths = brandPaths(brand.key)
  const [items, setItems] = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('products')
      .select('id, name, description, base_price, price_type, image_url, category, featured, featured_category, brand_id, shown_both_brands, sort_order')
      .eq('is_visible', true)
      .or(`brand_id.eq.${brand.key},shown_both_brands.eq.true`)
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) return setItems([])
        const starred = data.filter((p) => p.featured || p.featured_category)
        const rest = data.filter((p) => !p.featured && !p.featured_category)
        const picked = starred.slice(0, MAX_ITEMS)
        if (picked.length < MIN_ITEMS) picked.push(...rest.slice(0, MIN_ITEMS - picked.length))
        setItems(picked)
      })
    return () => { cancelled = true }
  }, [brand.key])

  return (
    <section className="band featured" aria-labelledby="featured-title">
      <div className="wrap">
        <div className="featured__head">
          <h2 id="featured-title" className="heading">{content.featured.title}</h2>
          <Link to={paths.menu} className="text-link">{content.featured.link}</Link>
        </div>

        {items === null ? (
          <div className="featured__grid" aria-busy="true">
            {Array.from({ length: MIN_ITEMS }, (_, i) => <div key={i} className="product-card product-card--loading" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="featured__empty">{content.featured.empty}</p>
        ) : (
          <ul className="featured__grid">
            {items.map((item) => <ProductCard key={item.id} item={item} brandKey={brand.key} />)}
          </ul>
        )}
      </div>
    </section>
  )
}

function placeholderIcon(item, brandKey) {
  const text = `${item.category || ''} ${item.name}`.toLowerCase()
  if (text.includes('cookie') || text.includes('crinkle') || text.includes('shortbread')) return Cookie
  if (text.includes('brownie') || text.includes('bar') || text.includes('blondie')) return WarmBrownie
  return brandKey === 'tsismis' ? Sun : Heart
}

function ProductCard({ item, brandKey }) {
  const Icon = placeholderIcon(item, brandKey)
  const hasPrice = item.base_price !== null && item.base_price !== undefined

  return (
    <li className="product-card">
      <div className="product-card__media">
        {item.image_url ? (
          <img src={item.image_url} alt="" loading="lazy" />
        ) : (
          <div className="product-card__placeholder">
            <Watercolour layout="card" seed={item.name.length} />
            <Icon size={64} className="product-card__icon" />
          </div>
        )}
      </div>
      <h3 className="product-card__name">{item.name}</h3>
      {item.description && <p className="product-card__desc">{item.description}</p>}
      <p className="product-card__price">
        {hasPrice ? `${item.price_type ? `${item.price_type} ` : ''}${money(item.base_price)}` : 'Price on request'}
      </p>
    </li>
  )
}
