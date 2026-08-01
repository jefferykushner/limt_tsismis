import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../invoiceMath'
import './products.css'

const emptyForm = {
  brand_id: 'limt',
  shown_both_brands: false,
  category: '',
  name: '',
  description: '',
  base_price: '',
  ingredients: '',
  allergen_notes: '',
}

const BRAND_LABEL = { limt: 'LIMT', tsismis: 'Tsismis' }

// Standard allergen vocabulary used across the menu. Kept as a fixed list so
// tags stay consistent everywhere they're displayed (admin, invoices, and
// eventually the public menu).
const ALLERGEN_OPTIONS = ['Wheat/Gluten', 'Milk/Dairy', 'Eggs', 'Tree Nuts', 'Peanuts', 'Soy', 'Sesame', 'Fish', 'Shellfish', 'Mustard', 'Sulphites']

const emptyEdit = {
  description: '', base_price: '', launch_status: 'core', price_type: '', minimum_order: '',
  sizes: '', flavours: '', ingredients: '', allergens: [], allergen_notes: '', dietary_tags: '',
  lead_time: '', pickup_available: true, delivery_available: false, featured: false, seasonal: false,
  shown_both_brands: false, image_url: '', internal_notes: '',
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

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('sort_order')
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const p of products) {
      const key = p.category || 'Uncategorized'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    }
    return [...map.entries()]
  }, [products])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('products').insert({
      brand_id: form.brand_id,
      shown_both_brands: form.shown_both_brands,
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
      featured: product.featured ?? false,
      seasonal: product.seasonal ?? false,
      shown_both_brands: product.shown_both_brands ?? false,
      image_url: product.image_url || '',
      internal_notes: product.internal_notes || '',
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
      featured: editForm.featured,
      seasonal: editForm.seasonal,
      shown_both_brands: editForm.shown_both_brands,
      image_url: editForm.image_url.trim() || null,
      internal_notes: editForm.internal_notes.trim() || null,
    }).eq('id', productId)
    setEditSaving(false)
    setExpandedId(null)
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
        <span className="pill pill--paid">Orderable</span> controls whether it can be added to an invoice. Click either pill to toggle it. Click a row to edit ingredients, allergens, and other details.
      </p>

      {showForm && (
        <form className="dash-card" onSubmit={handleAdd} style={{ marginBottom: 24 }}>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Brand</span>
              <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="prod-select">
                <option value="limt">LIMT</option>
                <option value="tsismis">Tsismis</option>
              </select>
            </label>
            <label className="dash-field prod-checkbox-field" style={{ justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontWeight: 400, fontSize: '0.85rem' }}>
                <input type="checkbox" checked={form.shown_both_brands} onChange={(e) => setForm({ ...form, shown_both_brands: e.target.checked })} />
                Also sold under the other brand
              </label>
            </label>
            <label className="dash-field">
              <span>Category</span>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Celebration Cakes" />
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
            <div className="prod-category-header">{category}</div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
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
                        {p.featured && <span className="prod-flag" title="Featured">★</span>}
                        {p.seasonal && <span className="prod-flag" title="Seasonal">❄</span>}
                      </td>
                      <td>{BRAND_LABEL[p.brand_id] || p.brand_id}{p.shown_both_brands && <span className="prod-both-badge"> +Both</span>}</td>
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
                              <label><input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} /> Featured</label>
                              <label><input type="checkbox" checked={editForm.seasonal} onChange={(e) => setEditForm({ ...editForm, seasonal: e.target.checked })} /> Seasonal</label>
                              <label><input type="checkbox" checked={editForm.shown_both_brands} onChange={(e) => setEditForm({ ...editForm, shown_both_brands: e.target.checked })} /> Also sold under the other brand</label>
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
