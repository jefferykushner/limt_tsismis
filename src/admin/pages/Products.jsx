import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../invoiceMath'

const emptyForm = { brand_id: 'limt', category: '', name: '', description: '', base_price: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

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

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('products').insert({
      brand_id: form.brand_id,
      category: form.category.trim() || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      base_price: form.base_price ? Number(form.base_price) : null,
    })
    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  const toggleActive = async (product) => {
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
        <button className="dash-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="dash-card" onSubmit={handleAdd} style={{ marginBottom: 24 }}>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Brand</span>
              <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} style={{ padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'none' }}>
                <option value="limt">LIMT</option>
                <option value="tsismis">Tsismis</option>
              </select>
            </label>
            <label className="dash-field">
              <span>Category</span>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Cakes" />
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
          </div>
          <button className="dash-btn" type="submit" disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Saving…' : 'Save Product'}
          </button>
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
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} onClick={() => toggleActive(p)}>
                  <td>{p.name}</td>
                  <td>{p.brand_id === 'limt' ? 'LIMT' : 'Tsismis'}</td>
                  <td>{p.category || '—'}</td>
                  <td>{p.base_price ? money(p.base_price) : '—'}</td>
                  <td><span className={`pill ${p.is_active ? 'pill--paid' : 'pill--draft'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
