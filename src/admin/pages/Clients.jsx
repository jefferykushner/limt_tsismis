import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { initialsOf } from '../../lib/nameUtils'

export default function Clients() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const loadClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, phone, email, billing_city, user_id, client_type, contact_person')
      .is('deleted_at', null)
      .order('name', { ascending: true })
    if (!error) setClients(data)
    setLoading(false)
  }

  useEffect(() => { loadClients() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('clients').insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
    })
    setSaving(false)
    if (!error) {
      setForm({ name: '', phone: '', email: '' })
      setShowForm(false)
      loadClients()
    }
  }

  return (
    <div>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Client Directory</span>
          <h1 className="dash-title">Clients</h1>
        </div>
        <button className="dash-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Client'}
        </button>
      </div>

      {showForm && (
        <form className="dash-card dash-inline-form" onSubmit={handleAdd}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button className="dash-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Client'}</button>
        </form>
      )}

      {loading ? (
        <div className="dash-empty">Loading clients…</div>
      ) : clients.length === 0 ? (
        <div className="dash-empty">No clients yet. Add your first one above.</div>
      ) : (
        <div className="dash-card-grid">
          {clients.map((c) => (
            <div key={c.id} className="profile-card" onClick={() => navigate(`/admin/clients/${c.id}`)}>
              <div className="profile-card-head">
                <div className="dash-avatar dash-avatar--neutral">{initialsOf(c.name)}</div>
                <div>
                  <div className="profile-card-name">{c.name}</div>
                  <div className="profile-card-sub">
                    {c.contact_person ? `Attn: ${c.contact_person}` : (c.billing_city || 'No city on file')}
                  </div>
                </div>
              </div>
              <div className="profile-card-meta">
                <span>{c.phone || '—'}</span>
                <span>{c.email || '—'}</span>
              </div>
              <div className="chip-row">
                {c.client_type === 'business' && (
                  <span className="chip">
                    <span className="chip-icon chip-icon--ube">B</span>
                    Business
                  </span>
                )}
                <span className="chip">
                  <span className={`chip-icon ${c.user_id ? 'chip-icon--blush' : 'chip-icon--graphite'}`}>
                    {c.user_id ? '✓' : '–'}
                  </span>
                  {c.user_id ? 'Portal Access' : 'No Portal'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
