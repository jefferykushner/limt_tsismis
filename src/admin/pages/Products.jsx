import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../invoiceMath'

const emptyForm = {
  brand_id: 'limt',
  category: '',
  name: '',
  description: '',
  base_price: '',
  image_url: '',
  tags: '',
}

const fieldStyle = {
  padding: '9px 12px',
  border: '1px solid var(--fog)',
  borderRadius: 8,
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  textTransform: 'none',
}

// products.tags is a text[] in the database. The form works with it as a
// plain comma-separated string, converting at the edges — same pattern as
// every other field, no extra UI complexity for a simple list of words.
const tagsToInput = (tags) => (Array.isArray(tags) ? tags.join(', ') : '')
const inputToTags = (str) =>
  str.split(',').map((t) => t.trim()).filter(Boolean)

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('brand_id')
      .order('sort_order')
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const startAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      brand_id: product.brand_id,
      category: product.category || '',
      name: product.name || '',
      description: product.description || '',
      base_price: product.base_price ?? '',
      image_url: product.image_url || '',
      tags: tagsToInput(product.tags),
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)

    const payload = {
      brand_id: form.brand_id,
      category: form.category.trim() || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      base_price: form.base_price ? Number(form.base_price) : null,
      image_url: form.image_url.trim() || null,
      tags: inputToTags(form.tags),
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert(payload)
    }

    setSaving(false)
    cancelForm()
    load()
  }

  const toggleActive = async (e, product) => {
    e.stopPropagation() // don't also trigger startEdit on the row
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    load()
  }

  return (
    <div>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Catalog</span>
          <h1 className="dash-title">Products</h1>
        </div>
        <button className="dash-btn" onClick={() => (showForm ? cancelForm() : startAdd())}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="dash-card" onSubmit={handleSave} style={{ marginBottom: 24 }}>
          <div className="dash-section-label" style={{ marginBottom: 14 }}>
            {editingId ? 'Edit Product' : 'New Product'}
          </div>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Brand</span>
              <select
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                style={fieldStyle}
              >
                <option value="limt">LIMT</option>
                <option value="tsismis">Tsismis</option>
              </select>
            </label>
            <label className="dash-field">
              <span>Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Cakes"
              />
            </label>
            <label className="dash-field">
              <span>Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="dash-field">
              <span>Base Price</span>
              <input
                type="number" step="0.01"
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                placeholder="0.00"
              />
            </label>
            <label className="dash-field span-2">
              <span>Description</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="dash-field span-2">
              <span>Image URL</span>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://…"
              />
            </label>
            <label className="dash-field span-2">
              <span>Tags</span>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="seasonal, gluten-free, best seller"
              />
            </label>
          </div>

          {form.image_url && (
            <img
              src={form.image_url}
              alt=""
              style={{ marginTop: 14, maxWidth: 160, maxHeight: 160, borderRadius: 8, objectFit: 'cover' }}
            />
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="dash-btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Save Product'}
            </button>
            <button className="dash-btn dash-btn--ghost" type="button" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="dash-empty">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="dash-empty">No products yet — this catalog will also feed the public menu pages.</div>
      ) : (
        <div className="dash-card" style={{ padding: 0 }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} onClick={() => startEdit(p)}>
                  <td>{p.name}</td>
                  <td>{p.brand_id === 'limt' ? 'LIMT' : 'Tsismis'}</td>
                  <td>{p.category || '—'}</td>
                  <td>{Array.isArray(p.tags) && p.tags.length > 0 ? p.tags.join(', ') : '—'}</td>
                  <td>{p.base_price ? money(p.base_price) : '—'}</td>
                  <td>
                    <span
                      className={`pill ${p.is_active ? 'pill--paid' : 'pill--draft'}`}
                      onClick={(e) => toggleActive(e, p)}
                      title="Click to toggle active/hidden"
                    >
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
