import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('orders')
        .select('id, invoice_number, brand_id, event_date, amount_due, status, clients(name)')
        .is('deleted_at', null)
        .order('event_date', { ascending: false })
      if (data) setOrders(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Billing</span>
          <h1 className="dash-title">Orders &amp; Invoices</h1>
        </div>
        <button className="dash-btn" onClick={() => navigate('/admin/orders/new')}>+ New Invoice</button>
      </div>

      {loading ? (
        <div className="dash-empty">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="dash-empty">No orders yet. Create your first invoice above.</div>
      ) : (
        <div className="dash-card" style={{ padding: 0 }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
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
                  <td>{o.clients?.name}</td>
                  <td>{o.brand_id === 'limt' ? 'LIMT' : 'Tsismis'}</td>
                  <td>{o.event_date || '—'}</td>
                  <td>${Number(o.amount_due).toFixed(2)}</td>
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
