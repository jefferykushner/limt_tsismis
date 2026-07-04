import { useEffect, useState, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { calcTotals, calcWaivedBreakdown, groupLineItems, lineItemListTotal, lineItemWaivedAmount, money } from '../../admin/invoiceMath'
import PrintableInvoice from '../../admin/PrintableInvoice'

export default function OrderView() {
  const { id } = useParams()
  const { clientRecord } = useAuth()
  const [order, setOrder] = useState(null)
  const [lineItems, setLineItems] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // RLS already restricts this to the signed-in customer's own orders —
      // if it doesn't belong to them, this simply returns nothing.
      const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()
      if (!orderData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const [{ data: itemsData }, { data: notesData }] = await Promise.all([
        supabase.from('line_items').select('*').eq('order_id', id).order('sort_order'),
        supabase.from('order_notes').select('*').eq('order_id', id).order('sort_order'),
      ])
      setOrder(orderData)
      setLineItems(itemsData || [])
      setNotes(notesData || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="dash-empty">Loading invoice…</div>
  if (notFound) {
    return (
      <div>
        <Link to="/account/orders" className="dash-link-back">← My Orders</Link>
        <div className="dash-empty">We couldn't find that invoice.</div>
      </div>
    )
  }

  const totals = calcTotals({
    lineItems,
    taxRate: order.tax_rate,
    discountAmount: order.discount_amount,
    depositAmount: order.deposit_amount,
  })
  const waivedBreakdown = calcWaivedBreakdown(lineItems)
  const groupedOrder = groupLineItems(lineItems)

  return (
    <div>
      <Link to="/account/orders" className="dash-link-back no-print">← My Orders</Link>

      <div className="dash-topbar no-print">
        <div>
          <span className="dash-kicker">{order.brand_id === 'limt' ? 'LIMT' : 'Tsismis'} Invoice</span>
          <h1 className="dash-title">{order.invoice_number}</h1>
        </div>
        <button className="dash-btn" onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <div className="dash-card no-print" style={{ marginBottom: 20 }}>
        <div className="dash-form-grid">
          <div>
            <div className="dash-section-label" style={{ marginBottom: 8 }}>Event Date</div>
            <div>{order.event_date || '—'}</div>
          </div>
          <div>
            <div className="dash-section-label" style={{ marginBottom: 8 }}>Status</div>
            <span className={`pill pill--${order.status}`}>{order.status}</span>
          </div>
        </div>
      </div>

      {groupedOrder.length > 0 && (
        <div className="dash-card no-print" style={{ marginBottom: 20, padding: 0 }}>
          <table className="dash-table">
            <thead>
              <tr><th>Item</th><th>Details</th><th>Qty</th><th>Total</th></tr>
            </thead>
            <tbody>
              {groupedOrder.map((entry, idx) => {
                if (entry.type === 'single') {
                  const li = entry.item
                  const waived = lineItemWaivedAmount(li)
                  return (
                    <tr key={li.id} style={{ cursor: 'default' }}>
                      <td>{li.product_type}</td>
                      <td>{li.details || '—'}</td>
                      <td>{li.quantity}</td>
                      <td>
                        {waived > 0 && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--graphite)', marginRight: 6 }}>
                            {money(lineItemListTotal(li))}
                          </span>
                        )}
                        {money(li.total_price)}
                      </td>
                    </tr>
                  )
                }
                const groupTotal = entry.items.reduce((s, i) => s + Number(i.total_price || 0), 0)
                return (
                  <Fragment key={`g-${idx}`}>
                    <tr style={{ cursor: 'default' }}>
                      <td colSpan={4} style={{ fontWeight: 600, background: 'var(--cream)' }}>{entry.name}</td>
                    </tr>
                    {entry.items.map((li) => (
                      <tr key={li.id} style={{ cursor: 'default' }}>
                        <td style={{ paddingLeft: 24 }}>{li.product_type}</td>
                        <td>{li.details || '—'}</td>
                        <td>{li.quantity}</td>
                        <td>{money(li.total_price)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 600, cursor: 'default' }}>
                      <td colSpan={3}>Total {entry.name}</td>
                      <td>{money(groupTotal)}</td>
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="dash-card no-print" style={{ maxWidth: 420, marginLeft: 'auto' }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Totals</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Subtotal</span><span>{money(totals.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Tax</span><span>{money(totals.taxAmount)}</span>
        </div>
        {order.discount_amount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
            <span>{order.discount_label || 'Discount'}</span><span>-{money(order.discount_amount)}</span>
          </div>
        )}
        {order.deposit_amount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
            <span>Deposit Paid</span><span>-{money(order.deposit_amount)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, borderTop: '1px solid var(--fog)', paddingTop: 12 }}>
          <span>Amount Due</span><span>{money(totals.amountDue)}</span>
        </div>
      </div>

      <PrintableInvoice
        order={order}
        client={clientRecord}
        lineItems={lineItems}
        totals={totals}
        notes={notes}
        waivedBreakdown={waivedBreakdown}
        groupedOrder={groupedOrder}
      />
    </div>
  )
}
