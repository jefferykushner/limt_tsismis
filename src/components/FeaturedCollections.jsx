import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { money } from '../admin/invoiceMath'
import './FeaturedCollections.css'

/*
  Pulls any category currently flagged `featured_category = true` (set from
  the admin Products page — see the "Feature on Homepage" button next to a
  category name) and renders each as its own section, in whatever order the
  items' sort_order puts the categories in.

  Renders nothing at all — not even an empty wrapper — when no category is
  currently featured, per the design call to have this section disappear
  entirely rather than show a placeholder.
*/
export default function FeaturedCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('featured_category', true)
        .order('sort_order')

      if (!error && data) {
        const byCategory = new Map()
        for (const item of data) {
          const cat = item.category || 'Featured'
          if (!byCategory.has(cat)) byCategory.set(cat, { blurb: item.collection_blurb, items: [] })
          byCategory.get(cat).items.push(item)
        }
        setCollections([...byCategory.entries()].map(([category, v]) => ({ category, ...v })))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading || collections.length === 0) return null

  return (
    <>
      {collections.map((collection) => (
        <section className="hp-featured section" aria-label={collection.category} key={collection.category}>
          <div className="container">
            <div className="hp-featured__header reveal">
              <p className="hp-featured__eyebrow">New &amp; Noteworthy</p>
              <h2 className="hp-featured__heading">{collection.category}</h2>
              {collection.blurb && <p className="hp-featured__blurb">{collection.blurb}</p>}
            </div>
          </div>

          <div className="hp-featured__grid">
            {collection.items.map((item, i) => (
              <div
                key={item.id}
                className="hp-featured-card reveal"
                style={{ '--card-index': i }}
              >
                <div
                  className="hp-featured-card__img"
                  style={item.image_url ? { backgroundImage: `url(${item.image_url})` } : undefined}
                  aria-hidden="true"
                />
                <div className="hp-featured-card__overlay" aria-hidden="true" />
                <div className="hp-featured-card__content">
                  <h3 className="hp-featured-card__name">{item.name}</h3>
                  <p className="hp-featured-card__price">
                    {item.base_price ? money(item.base_price) : 'Ask for pricing'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
            <Link to="/menu" className="btn btn--filled">View Full Menu</Link>
          </div>
        </section>
      ))}
    </>
  )
}
