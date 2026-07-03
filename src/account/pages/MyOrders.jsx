import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { money } from '../../admin/invoiceMath'

export default function MyOrders() {
  const { clientRecord } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!clientRecord) { setLoading(false); return }
      setLoading(true)
      const { data } = await supabase
        .from('orders')
        .select('id, invoice_number, brand_id, event_date, amount_due, status')
        .eq('client_id', clientRecord.id)
        .order('event_date', { ascending: false })
      if (data) setOrders(data)
      setLoading(false)
    }
    load()
  }, [clientRecord])

  return (
    <div>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">Your Account</span>
          <h1 className="dash-title">Orders &amp; Invoices</h1>
        </div>
      </div>

      {!clientRecord ? (
        <div className="dash-empty">
          Your account isn't linked to a client record yet — reach out to us and we'll get that connected.
        </div>
      ) : loading ? (
        <div className="dash-empty">Loading your orders…</div>
      ) : orders.length === 0 ? (
        <div className="dash-empty">No orders on file yet.</div>
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
                <tr key={o.id}>
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
