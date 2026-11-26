import { supabase } from './supabaseClient'
import { money } from '../admin/invoiceMath'

/*
  The public menu: one list of products shared by both brands.

  Love in My Tummy shows categories in their set order, and Filipino items
  sit in their normal places. Tsismis flips it: the Filipino Favourites
  section comes first, and inside every other section the Filipino items
  come first. Nothing is hidden in either brand.
*/

// Only the columns the public site needs. Internal notes live in a separate
// staff-only table and are never requested here.
const PUBLIC_COLUMNS = [
  'id', 'name', 'category', 'description', 'base_price', 'price_type', 'sizes',
  'image_url', 'allergens', 'dietary_tags', 'seasonal', 'is_filipino',
  'featured_limt', 'featured_tsismis', 'featured_category', 'sort_order', 'lead_time',
].join(', ')

export const FILIPINO_CATEGORY = 'Filipino Favourites'

export async function fetchMenu() {
  const [products, categories] = await Promise.all([
    supabase.from('products').select(PUBLIC_COLUMNS).eq('is_visible', true).is('archived_at', null).order('sort_order'),
    supabase.from('categories').select('name, subtitle, subtitle_tsismis, sort_order').order('sort_order'),
  ])
  if (products.error) throw products.error
  return { products: products.data ?? [], categories: categories.data ?? [] }
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Group into sections and order them for the given brand. */
export function menuSections(products, categories, brandKey) {
  const isTsismis = brandKey === 'tsismis'
  const meta = new Map(categories.map((c) => [c.name, c]))
  const groups = new Map()
  for (const p of products) {
    const name = p.category?.trim() || 'More'
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name).push(p)
  }

  const sectionRank = (name) => {
    if (isTsismis && name === FILIPINO_CATEGORY) return -1
    return meta.get(name)?.sort_order ?? 999
  }
  const itemOrder = (a, b) =>
    (isTsismis ? Number(b.is_filipino) - Number(a.is_filipino) : 0) || (a.sort_order ?? 0) - (b.sort_order ?? 0)

  return [...groups.entries()]
    .sort(([a], [b]) => sectionRank(a) - sectionRank(b) || a.localeCompare(b))
    .map(([name, items]) => {
      const m = meta.get(name)
      return {
        id: slugify(name),
        heading: name,
        subtitle: (isTsismis ? m?.subtitle_tsismis : null) || m?.subtitle || null,
        items: [...items].sort(itemOrder),
      }
    })
}

/**
 * The home page's featured row: items starred for this brand (or in a
 * category set to "Feature on Homepage"). If fewer than `min` are starred,
 * top up with Filipino items first for Tsismis, then the rest of the menu.
 */
export function featuredItems(products, brandKey, { min = 4, max = 8 } = {}) {
  const flag = brandKey === 'tsismis' ? 'featured_tsismis' : 'featured_limt'
  const starred = products.filter((p) => p[flag] || p.featured_category)
  if (starred.length >= min) return starred.slice(0, max)
  const rest = products
    .filter((p) => !starred.includes(p))
    .sort((a, b) => (brandKey === 'tsismis' ? Number(b.is_filipino) - Number(a.is_filipino) : 0))
  return [...starred, ...rest].slice(0, min)
}

/** "$24.00 · Box of 6", or "Price on request". */
export function priceLabel(item) {
  const hasPrice = item.base_price !== null && item.base_price !== undefined
  const price = hasPrice ? `${item.price_type ? `${item.price_type} ` : ''}${money(item.base_price)}` : 'Price on request'
  return item.sizes && hasPrice ? `${price} · ${item.sizes}` : price
}
