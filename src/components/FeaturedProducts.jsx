import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMenu, featuredItems, priceLabel } from '../lib/menu'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import Watercolour from './art/Watercolour'
import { LG } from './LG'
import { Cookie, WarmBrownie, Heart, Sun } from './art/LineArt'
import './FeaturedProducts.css'

const MIN_ITEMS = 4
const MAX_ITEMS = 8

/*
  The home page's featured menu. Shows the items Carolyn has starred for
  the active brand (or a category set to "Feature on Homepage"); if fewer
  than four are starred, tops up from the menu so the row never looks empty.
*/
export default function FeaturedProducts() {
  const brand = useBrand()
  const content = brandContent(brand.key)
  const paths = brandPaths(brand.key)
  const [items, setItems] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchMenu()
      .then(({ products }) => !cancelled && setItems(featuredItems(products, brand.key, { min: MIN_ITEMS, max: MAX_ITEMS })))
      .catch(() => !cancelled && setItems([]))
    return () => { cancelled = true }
  }, [brand.key])

  return (
    <section className="band featured" aria-labelledby="featured-title">
      <div className="wrap">
        <div className="featured__head">
          <div className="featured__title">
            <LG pose="featured" fallback={false} decorative className="featured__lg" />
            <h2 id="featured-title" className="heading">{content.featured.title}</h2>
          </div>
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
      <p className="product-card__price">{priceLabel(item)}</p>
    </li>
  )
}
