import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../invoiceMath'
import './products.css'

const emptyForm = {
  is_filipino: false,
  category: '',
  name: '',
  description: '',
  base_price: '',
  ingredients: '',
  allergen_notes: '',
}

// Standard allergen vocabulary used across the menu. Kept as a fixed list so
// tags stay consistent everywhere they're displayed (admin, invoices, and
// eventually the public menu).
const ALLERGEN_OPTIONS = ['Wheat/Gluten', 'Milk/Dairy', 'Eggs', 'Tree Nuts', 'Peanuts', 'Soy', 'Sesame', 'Fish', 'Shellfish', 'Mustard', 'Sulphites']

const emptyEdit = {
  name: '', category: '', is_filipino: false,
  description: '', base_price: '', launch_status: 'core', price_type: '', minimum_order: '',
  sizes: '', flavours: '', ingredients: '', allergens: [], allergen_notes: '', dietary_tags: '',
  lead_time: '', pickup_available: true, delivery_available: false, featured_limt: false, featured_tsismis: false,
  seasonal: false, image_url: '', internal_notes: '',
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [expandedId, setExpandedId] = useState(null)
  const [editForm, setEditForm] = useState(emptyEdit)
  const [editSaving, setEditSaving] = useState(false)
  const [renamingCategory, setRenamingCategory] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [featuringCategory, setFeaturingCategory] = useState(null)
  const [featureBlurb, setFeatureBlurb] = useState('')
  const [notes, setNotes] = useState({})
  const [showArchived, setShowArchived] = useState(false)

  const load = async () => {
    setLoading(true)
    const [{ data }, { data: noteRows }] = await Promise.all([
      supabase.from('products').select('*').order('category').order('sort_order'),
      supabase.from('product_notes').select('product_id, internal_notes'),
    ])
    if (data) setProducts(data)
    setNotes(Object.fromEntries((noteRows || []).map((n) => [n.product_id, n.internal_notes])))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const archivedCount = products.filter((p) => p.archived_at).length
  const listed = useMemo(
    () => products.filter((p) => (showArchived ? p.archived_at : !p.archived_at)),
    [products, showArchived]
  )

  const grouped = useMemo(() => {
    const map = new Map()
    for (const p of listed) {
      const key = p.category || 'Uncategorized'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    }
    return [...map.entries()]
  }, [listed])

  const categoryOptions = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  )

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('products').insert({
      // brand_id only sets which brand an item was first made for; both brands show every item.
      brand_id: form.is_filipino ? 'tsismis' : 'limt',
      is_filipino: form.is_filipino,
      category: form.category.trim() || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      base_price: form.base_price ? Number(form.base_price) : null,
      ingredients: form.ingredients.trim() || null,
      allergen_notes: form.allergen_notes.trim() || null,
      is_visible: true,
      is_active: true,
    })
    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  const toggleField = async (product, field) => {
    await supabase.from('products').update({ [field]: !product[field] }).eq('id', product.id)
    load()
  }

  const openEditor = (product) => {
    if (expandedId === product.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(product.id)
    setEditForm({
      name: product.name || '',
      category: product.category || '',
      is_filipino: product.is_filipino ?? false,
      description: product.description || '',
      base_price: product.base_price ?? '',
      launch_status: product.launch_status || 'core',
      price_type: product.price_type || '',
      minimum_order: product.minimum_order || '',
      sizes: product.sizes || '',
      flavours: product.flavours || '',
      ingredients: product.ingredients || '',
      allergens: product.allergens || [],
      allergen_notes: product.allergen_notes || '',
      dietary_tags: (product.dietary_tags || []).join(', '),
      lead_time: product.lead_time || '',
      pickup_available: product.pickup_available ?? true,
      delivery_available: product.delivery_available ?? false,
      featured_limt: product.featured_limt ?? false,
      featured_tsismis: product.featured_tsismis ?? false,
      seasonal: product.seasonal ?? false,
      image_url: product.image_url || '',
      internal_notes: notes[product.id] ?? '',
    })
  }

  const toggleEditAllergen = (tag) => {
    setEditForm((f) => ({
      ...f,
      allergens: f.allergens.includes(tag) ? f.allergens.filter((a) => a !== tag) : [...f.allergens, tag],
    }))
  }

  const saveEdit = async (productId) => {
    setEditSaving(true)
    await supabase.from('products').update({
      name: editForm.name.trim(),
      category: editForm.category.trim() || null,
      is_filipino: editForm.is_filipino,
      description: editForm.description.trim() || null,
      base_price: editForm.base_price === '' ? null : Number(editForm.base_price),
      launch_status: editForm.launch_status,
      price_type: editForm.price_type.trim() || null,
      minimum_order: editForm.minimum_order.trim() || null,
      sizes: editForm.sizes.trim() || null,
      flavours: editForm.flavours.trim() || null,
      ingredients: editForm.ingredients.trim() || null,
      allergens: editForm.allergens,
      allergen_notes: editForm.allergen_notes.trim() || null,
      dietary_tags: editForm.dietary_tags.split(',').map((t) => t.trim()).filter(Boolean),
      lead_time: editForm.lead_time.trim() || null,
      pickup_available: editForm.pickup_available,
      delivery_available: editForm.delivery_available,
      featured_limt: editForm.featured_limt,
      featured_tsismis: editForm.featured_tsismis,
      seasonal: editForm.seasonal,
      image_url: editForm.image_url.trim() || null,
    }).eq('id', productId)
    await supabase.from('product_notes').upsert({
      product_id: productId,
      internal_notes: editForm.internal_notes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    setEditSaving(false)
    setExpandedId(null)
    load()
  }

  const startRenameCategory = (category) => {
    setRenamingCategory(category)
    setRenameValue(category === 'Uncategorized' ? '' : category)
  }

  const saveRenameCategory = async (oldCategory) => {
    const trimmed = renameValue.trim()
    setRenamingCategory(null)
    if (!trimmed || trimmed === oldCategory) return
    if (oldCategory === 'Uncategorized') {
      await supabase.from('products').update({ category: trimmed }).is('category', null)
    } else {
      await supabase.from('products').update({ category: trimmed }).eq('category', oldCategory)
      // keep the category's menu subtitle and position with it
      await supabase.from('categories').update({ name: trimmed }).eq('name', oldCategory)
    }
    load()
  }

  const isCategoryFeatured = (items) => items.some((p) => p.featured_category)

  const startFeatureCategory = (category, items) => {
    const existingBlurb = items.find((p) => p.collection_blurb)?.collection_blurb || ''
    setFeaturingCategory(category)
    setFeatureBlurb(existingBlurb)
  }

  const saveFeatureCategory = async (category) => {
    setFeaturingCategory(null)
    const filter = category === 'Uncategorized' ? { category: null } : { category }
    let query = supabase.from('products').update({
      featured_category: true,
      collection_blurb: featureBlurb.trim() || null,
    })
    query = category === 'Uncategorized' ? query.is('category', null) : query.eq('category', category)
    await query
    load()
  }

  const unfeatureCategory = async (category) => {
    let query = supabase.from('products').update({ featured_category: false, collection_blurb: null })
    query = category === 'Uncategorized' ? query.is('category', null) : query.eq('category', category)
    await query
    load()
  }

  return (
    <div>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Catalog</span>
          <h1 className="dash-title">Menu Items</h1>
        </div>
        <button className="dash-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      <p className="prod-legend">
        <span className="pill pill--paid">Website</span> controls whether an item shows on the public menu.{' '}
        <span className="pill pill--paid">Orderable</span> controls whether it can be added to an invoice. Click either pill to toggle it. Click a row to edit its details.{' '}
        Both brands share one menu. Tick <strong>Filipino item</strong> and Tsismis shows it first; Love in My Tummy keeps it in its normal place.
        Tick <strong>Featured</strong> for each brand to put an item on that brand's home page (4 or more looks best).{' '}
        <strong>Feature on Homepage</strong> next to a category puts every item in it on both home pages.
      </p>

      {archivedCount > 0 && (
        <p className="prod-legend">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={() => setShowArchived((v) => !v)}>
            {showArchived ? 'Back to the current menu' : `Show archived items (${archivedCount})`}
          </button>{' '}
          {showArchived && 'Archived items are kept for reference. They are hidden from the website and from invoices.'}
        </p>
      )}

      <datalist id="prod-category-options">
        {categoryOptions.map((c) => <option key={c} value={c} />)}
      </datalist>

      {showForm && (
        <form className="dash-card" onSubmit={handleAdd} style={{ marginBottom: 24 }}>
          <div className="dash-form-grid">
            <label className="dash-field prod-checkbox-field span-2">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontWeight: 400, fontSize: '0.85rem' }}>
                <input type="checkbox" checked={form.is_filipino} onChange={(e) => setForm({ ...form, is_filipino: e.target.checked })} />
                Filipino item (shown first on Tsismis)
              </label>
            </label>
            <label className="dash-field">
              <span>Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Celebration Cakes"
                list="prod-category-options"
              />
            </label>
            <label className="dash-field">
              <span>Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="dash-field">
              <span>Base Price</span>
              <input type="number" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} placeholder="0.00" />
            </label>
            <label className="dash-field span-2">
              <span>Description</span>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="dash-field span-2">
              <span>Ingredients</span>
              <textarea rows={2} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="Comma-separated, e.g. Wheat flour, butter, eggs…" />
            </label>
            <label className="dash-field span-2">
              <span>Allergen Notes</span>
              <input value={form.allergen_notes} onChange={(e) => setForm({ ...form, allergen_notes: e.target.value })} placeholder="e.g. May contain traces of tree nuts" />
            </label>
          </div>
          <p className="prod-hint">Standard allergen tags (Wheat/Gluten, Milk/Dairy, etc.) can be set precisely after saving, from the item's edit panel.</p>
          <button className="dash-btn" type="submit" disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Saving…' : 'Save Item'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="dash-empty">Loading menu items…</div>
      ) : products.length === 0 ? (
        <div className="dash-empty">No menu items yet — this catalog also feeds the public menu pages.</div>
      ) : (
        grouped.map(([category, items]) => (
          <div className="dash-card prod-category-card" key={category} style={{ padding: 0, marginBottom: 20 }}>
            <div className="prod-category-header">
              {renamingCategory === category ? (
                <span className="prod-rename-row">
                  <input
                    autoFocus
                    className="prod-rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRenameCategory(category)
                      if (e.key === 'Escape') setRenamingCategory(null)
                    }}
                  />
                  <button type="button" className="dash-btn" onClick={() => saveRenameCategory(category)}>Save</button>
                  <button type="button" className="dash-btn dash-btn--ghost" onClick={() => setRenamingCategory(null)}>Cancel</button>
                </span>
              ) : featuringCategory === category ? (
                <span className="prod-rename-row">
                  <input
                    autoFocus
                    className="prod-rename-input"
                    style={{ minWidth: 320 }}
                    placeholder="Short blurb for the homepage (optional)"
                    value={featureBlurb}
                    onChange={(e) => setFeatureBlurb(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveFeatureCategory(category)
                      if (e.key === 'Escape') setFeaturingCategory(null)
                    }}
                  />
                  <button type="button" className="dash-btn" onClick={() => saveFeatureCategory(category)}>Save &amp; Feature</button>
                  <button type="button" className="dash-btn dash-btn--ghost" onClick={() => setFeaturingCategory(null)}>Cancel</button>
                </span>
              ) : (
                <span className="prod-rename-row">
                  {category}
                  <button type="button" className="prod-rename-btn" onClick={() => startRenameCategory(category)} title={`Rename "${category}" everywhere it's used`}>
                    Rename
                  </button>
                  {isCategoryFeatured(items) ? (
                    <button type="button" className="prod-feature-btn prod-feature-btn--on" onClick={() => unfeatureCategory(category)} title="Remove from homepage">
                      ★ Featured on Homepage
                    </button>
                  ) : (
                    <button type="button" className="prod-feature-btn" onClick={() => startFeatureCategory(category, items)} title="Show this category on the homepage">
                      Feature on Homepage
                    </button>
                  )}
                </span>
              )}
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tags</th>
                  <th>Price</th>
                  <th>Allergens</th>
                  <th>Website</th>
                  <th>Orderable</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <Fragment key={p.id}>
                    <tr onClick={() => openEditor(p)}>
                      <td>
                        {p.name}
                        {(p.featured_limt || p.featured_tsismis) && (
                          <span className="prod-flag" title={`Featured on ${[p.featured_limt && 'Love in My Tummy', p.featured_tsismis && 'Tsismis'].filter(Boolean).join(' and ')}`}>★</span>
                        )}
                        {p.seasonal && <span className="prod-flag" title="Seasonal">❄</span>}
                      </td>
                      <td>
                        <div className="prod-chip-row">
                          {p.is_filipino && <span className="prod-chip">Filipino</span>}
                          {p.is_placeholder && <span className="prod-chip" title="Sample item from the starter menu">Sample</span>}
                        </div>
                      </td>
                      <td>{p.base_price ? money(p.base_price) : '—'}</td>
                      <td>
                        {(p.allergens || []).length === 0 ? (
                          <span className="prod-no-allergen">Unconfirmed</span>
                        ) : (
                          <div className="prod-chip-row">
                            {p.allergens.map((a) => <span key={a} className="prod-chip">{a}</span>)}
                          </div>
                        )}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`pill ${p.is_visible ? 'pill--paid' : 'pill--draft'} prod-toggle`}
                          onClick={() => toggleField(p, 'is_visible')}
                        >
                          {p.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`pill ${p.is_active ? 'pill--paid' : 'pill--draft'} prod-toggle`}
                          onClick={() => toggleField(p, 'is_active')}
                        >
                          {p.is_active ? 'Orderable' : 'Off'}
                        </span>
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr key={`${p.id}-edit`} className="prod-edit-row">
                        <td colSpan={6}>
                          <div className="prod-edit-grid">
                            <label className="dash-field span-2">
                              <span>Name</span>
                              <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                            </label>
                            <label className="dash-field">
                              <span>Category</span>
                              <input
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                list="prod-category-options"
                                placeholder="e.g. Celebration Cakes"
                              />
                            </label>
                            <label className="dash-field prod-checkbox-field">
                              <span>Filipino</span>
                              <label><input type="checkbox" checked={editForm.is_filipino} onChange={(e) => setEditForm({ ...editForm, is_filipino: e.target.checked })} /> Filipino item (shown first on Tsismis)</label>
                            </label>
                            <label className="dash-field span-2">
                              <span>Description</span>
                              <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                            </label>
                            <label className="dash-field">
                              <span>Base Price</span>
                              <input type="number" step="0.01" value={editForm.base_price} onChange={(e) => setEditForm({ ...editForm, base_price: e.target.value })} />
                            </label>
                            <label className="dash-field">
                              <span>Price Type</span>
                              <input value={editForm.price_type} onChange={(e) => setEditForm({ ...editForm, price_type: e.target.value })} placeholder="e.g. starting at, per dozen" />
                            </label>
                            <label className="dash-field">
                              <span>Launch Status</span>
                              <select className="prod-select" value={editForm.launch_status} onChange={(e) => setEditForm({ ...editForm, launch_status: e.target.value })}>
                                <option value="core">Core</option>
                                <option value="optional">Optional</option>
                              </select>
                            </label>
                            <label className="dash-field">
                              <span>Minimum Order</span>
                              <input value={editForm.minimum_order} onChange={(e) => setEditForm({ ...editForm, minimum_order: e.target.value })} />
                            </label>
                            <label className="dash-field">
                              <span>Sizes</span>
                              <input value={editForm.sizes} onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })} placeholder="e.g. 6-inch, 8-inch" />
                            </label>
                            <label className="dash-field">
                              <span>Flavours</span>
                              <input value={editForm.flavours} onChange={(e) => setEditForm({ ...editForm, flavours: e.target.value })} />
                            </label>
                            <label className="dash-field span-2">
                              <span>Ingredients</span>
                              <textarea rows={2} value={editForm.ingredients} onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })} />
                            </label>

                            <div className="dash-field span-2">
                              <span>Allergens</span>
                              <div className="prod-chip-picker">
                                {ALLERGEN_OPTIONS.map((tag) => (
                                  <button
                                    type="button"
                                    key={tag}
                                    className={`prod-chip prod-chip--pickable ${editForm.allergens.includes(tag) ? 'prod-chip--on' : ''}`}
                                    onClick={() => toggleEditAllergen(tag)}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <label className="dash-field span-2">
                              <span>Allergen Notes (freeform, e.g. "may contain")</span>
                              <input value={editForm.allergen_notes} onChange={(e) => setEditForm({ ...editForm, allergen_notes: e.target.value })} />
                            </label>
                            <label className="dash-field span-2">
                              <span>Dietary Tags (comma-separated)</span>
                              <input value={editForm.dietary_tags} onChange={(e) => setEditForm({ ...editForm, dietary_tags: e.target.value })} placeholder="e.g. Vegetarian, Nut-Free" />
                            </label>
                            <label className="dash-field">
                              <span>Lead Time</span>
                              <input value={editForm.lead_time} onChange={(e) => setEditForm({ ...editForm, lead_time: e.target.value })} placeholder="e.g. 3 days notice" />
                            </label>
                            <label className="dash-field">
                              <span>Image URL</span>
                              <input value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} />
                            </label>

                            <div className="dash-field prod-checkbox-field">
                              <label><input type="checkbox" checked={editForm.pickup_available} onChange={(e) => setEditForm({ ...editForm, pickup_available: e.target.checked })} /> Pickup available</label>
                              <label><input type="checkbox" checked={editForm.delivery_available} onChange={(e) => setEditForm({ ...editForm, delivery_available: e.target.checked })} /> Delivery available</label>
                              <label><input type="checkbox" checked={editForm.featured_limt} onChange={(e) => setEditForm({ ...editForm, featured_limt: e.target.checked })} /> Featured on Love in My Tummy</label>
                              <label><input type="checkbox" checked={editForm.featured_tsismis} onChange={(e) => setEditForm({ ...editForm, featured_tsismis: e.target.checked })} /> Featured on Tsismis</label>
                              <label><input type="checkbox" checked={editForm.seasonal} onChange={(e) => setEditForm({ ...editForm, seasonal: e.target.checked })} /> Seasonal</label>
                            </div>

                            <label className="dash-field span-2">
                              <span>Internal Notes</span>
                              <textarea rows={2} value={editForm.internal_notes} onChange={(e) => setEditForm({ ...editForm, internal_notes: e.target.value })} />
                            </label>
                          </div>
                          <div className="prod-edit-actions">
                            <button className="dash-btn" type="button" disabled={editSaving} onClick={() => saveEdit(p.id)}>
                              {editSaving ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button className="dash-btn dash-btn--ghost" type="button" onClick={() => setExpandedId(null)}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  )
}
