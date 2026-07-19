import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * useMenu(brandId) — the single source of truth for what a brand's public
 * menu shows. Reads straight from the same `products` table the admin
 * Products page writes to, filtered to that brand and to active items only,
 * and merges in per-category subtitle/ordering from `categories`.
 *
 * Anything Carolyn adds, edits, or hides in /admin/products (or the
 * category subtitles/order, once that admin UI exists) shows up here
 * automatically — no code change, no redeploy.
 *
 * Usage:
 *   const { sections, loading } = useMenu('tsismis')
 */
export function useMenu(brandId) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!brandId) return
    setLoading(true)
    setError(null)

    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('category')
        .order('sort_order'),
      supabase
        .from('categories')
        .select('*')
        .eq('brand_id', brandId)
        .order('sort_order'),
    ])

    if (productsRes.error) {
      setError(productsRes.error)
      setProducts([])
    } else {
      setProducts(productsRes.data || [])
    }

    // Category metadata is optional enrichment — if it fails to load for any
    // reason, the menu still renders fine with plain category-name headings.
    setCategories(categoriesRes.data || [])

    setLoading(false)
  }, [brandId])

  useEffect(() => {
    load()
  }, [load])

  return {
    products,
    sections: groupByCategory(products, categories),
    loading,
    error,
    reload: load,
  }
}

// Groups the flat product list into the shape menu pages render section by
// section: [{ id, heading, subtitle, items }], sorted by the category's
// sort_order when known, then alphabetically for anything not yet in the
// categories table.
function groupByCategory(products, categories) {
  const metaByName = new Map(categories.map((c) => [c.name, c]))

  const map = new Map()
  for (const product of products) {
    const key = product.category?.trim() || 'Other'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(product)
  }

  return Array.from(map.entries())
    .map(([category, items]) => {
      const meta = metaByName.get(category)
      return {
        id: slugify(category),
        heading: category,
        subtitle: meta?.subtitle || null,
        sortOrder: meta?.sort_order ?? Number.MAX_SAFE_INTEGER,
        items,
      }
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.heading.localeCompare(b.heading))
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
