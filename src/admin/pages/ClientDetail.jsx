import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../invoiceMath'
import { initialsOf } from '../../lib/nameUtils'

const emptyClient = {
  name: '', phone: '', email: '',
  client_type: 'person', company_name: '', contact_person: '',
  secondary_contact_name: '', secondary_contact_phone: '', secondary_contact_email: '',
  billing_address_line1: '', billing_city: '', billing_province: '', billing_postal_code: '',
  notes: '', user_id: null,
}

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(emptyClient)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [portalUuid, setPortalUuid] = useState('')
  const [portalMsg, setPortalMsg] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data: clientData } = await supabase.from('clients').select('*').eq('id', id).single()
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, invoice_number, brand_id, event_date, amount_due, status')
      .eq('client_id', id)
      .is('deleted_at', null)
      .order('event_date', { ascending: false })
    if (clientData) setClient(clientData)
    if (orderData) setOrders(orderData)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const { id: _id, created_at, updated_at, deleted_at, user_id, ...updates } = client
    const { error } = await supabase.from('clients').update(updates).eq('id', id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleLinkPortal = async () => {
    setPortalMsg(null)
    if (!portalUuid.trim()) return
    const { error } = await supabase.from('clients').update({ user_id: portalUuid.trim() }).eq('id', id)
    if (error) {
      setPortalMsg('Could not link — check the UUID is correct and not already in use.')
    } else {
      setPortalMsg('Portal account linked.')
      setPortalUuid('')
      load()
    }
  }

  const handleUnlinkPortal = async () => {
    if (!confirm('Remove portal access for this client? They will no longer be able to log in.')) return
    await supabase.from('clients').update({ user_id: null }).eq('id', id)
    load()
  }

  const handleArchive = async () => {
    if (!confirm(`Archive ${client.name}? Records are kept for 30 days before permanent deletion.`)) return
    await supabase.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    navigate('/admin/clients')
  }

  if (loading) return <div className="dash-empty">Loading…</div>

  return (
    <div>
      <Link to="/admin/clients" className="dash-link-back">← All clients</Link>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Client Profile</span>
          <h1 className="dash-title">{client.name}</h1>
        </div>
        <button className="dash-btn dash-btn--danger" onClick={handleArchive}>Archive Client</button>
      </div>

      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="profile-card-head" style={{ marginBottom: 20 }}>
          <div className="dash-avatar dash-avatar--neutral" style={{ width: 48, height: 48, fontSize: '1rem' }}>
            {initialsOf(client.name)}
          </div>
          <div>
            <div className="profile-card-name" style={{ fontSize: '1rem' }}>{client.name}</div>
            <div className="profile-card-sub">{client.email}</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="dash-field" style={{ marginBottom: 18 }}>
            <span>Client Type</span>
            <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', textTransform: 'none', fontWeight: 400, color: 'var(--ink)' }}>
                <input type="radio" name="client_type" checked={client.client_type === 'person'} onChange={() => setClient({ ...client, client_type: 'person' })} />
                Person
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', textTransform: 'none', fontWeight: 400, color: 'var(--ink)' }}>
                <input type="radio" name="client_type" checked={client.client_type === 'business'} onChange={() => setClient({ ...client, client_type: 'business' })} />
                Business
              </label>
            </div>
          </div>

          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Name</span>
              <input value={client.name || ''} onChange={(e) => setClient({ ...client, name: e.target.value })} required />
            </label>
            <label className="dash-field">
              <span>Phone</span>
              <input value={client.phone || ''} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
            </label>
            <label className="dash-field">
              <span>Email</span>
              <input type="email" value={client.email || ''} onChange={(e) => setClient({ ...client, email: e.target.value })} />
            </label>
            <label className="dash-field">
              <span>City</span>
              <input value={client.billing_city || ''} onChange={(e) => setClient({ ...client, billing_city: e.target.value })} />
            </label>
            <label className="dash-field">
              <span>Company Name</span>
              <input value={client.company_name || ''} onChange={(e) => setClient({ ...client, company_name: e.target.value })} placeholder="Optional" />
            </label>
            <label className="dash-field">
              <span>Contact Person</span>
              <input value={client.contact_person || ''} onChange={(e) => setClient({ ...client, contact_person: e.target.value })} placeholder="Optional" />
            </label>
            <label className="dash-field span-2">
              <span>Billing Address</span>
              <input value={client.billing_address_line1 || ''} onChange={(e) => setClient({ ...client, billing_address_line1: e.target.value })} />
            </label>
            <label className="dash-field span-2">
              <span>Notes</span>
              <textarea rows={3} value={client.notes || ''} onChange={(e) => setClient({ ...client, notes: e.target.value })} />
            </label>
          </div>

          {client.client_type === 'business' && (
            <div style={{ marginTop: 18, padding: 16, background: 'var(--cream)', borderRadius: 8 }}>
              <div className="dash-section-label" style={{ marginBottom: 12 }}>Secondary Contact (Optional)</div>
              <div className="dash-form-grid">
                <label className="dash-field">
                  <span>Name</span>
                  <input value={client.secondary_contact_name || ''} onChange={(e) => setClient({ ...client, secondary_contact_name: e.target.value })} />
                </label>
                <label className="dash-field">
                  <span>Phone</span>
                  <input value={client.secondary_contact_phone || ''} onChange={(e) => setClient({ ...client, secondary_contact_phone: e.target.value })} />
                </label>
                <label className="dash-field">
                  <span>Email</span>
                  <input type="email" value={client.secondary_contact_email || ''} onChange={(e) => setClient({ ...client, secondary_contact_email: e.target.value })} />
                </label>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
            <button className="dash-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            {saved && <span className="dash-saved">Saved</span>}
          </div>
        </form>
      </div>

      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Portal Access</div>
        {client.user_id ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="chip">
              <span className="chip-icon chip-icon--blush">✓</span>
              Linked to login
            </span>
            <button className="dash-btn dash-btn--ghost" onClick={handleUnlinkPortal}>Remove access</button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--graphite)', marginBottom: 12 }}>
              Create the login first in Supabase (Authentication → Users → Add user), then paste their user UUID here to link it to this client.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="dash-field-input"
                style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontSize: '0.85rem' }}
                placeholder="Paste Supabase user UUID"
                value={portalUuid}
                onChange={(e) => setPortalUuid(e.target.value)}
              />
              <button className="dash-btn" onClick={handleLinkPortal}>Link Account</button>
            </div>
            {portalMsg && <p style={{ fontSize: '0.8rem', marginTop: 8 }}>{portalMsg}</p>}
          </div>
        )}
      </div>

      <div className="dash-section">
        <span className="dash-section-label">Order History</span>
      </div>

      {orders.length === 0 ? (
        <div className="dash-empty">No orders yet for this client.</div>
      ) : (
        <div className="dash-card" style={{ padding: 0 }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Brand</th>
                <th>Event Date</th>
                <th>Amount Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                  <td>{o.invoice_number}</td>
                  <td>{o.brand_id === 'limt' ? 'LIMT' : 'Tsismis'}</td>
                  <td>{o.event_date || '—'}</td>
                <td>{money(o.amount_due)}</td>
                  <td><span className={`pill pill--${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
