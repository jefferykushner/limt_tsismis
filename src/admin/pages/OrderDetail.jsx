import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { calcTotals, money } from '../invoiceMath'
import PrintableInvoice from '../PrintableInvoice'

const FEE_PRESETS = ['Setup Fee', 'Delivery Fee', 'Service Fee', 'Rush Fee']

export default function OrderDetail() {
  const { id } = useParams()

  if (id === 'new') return <NewOrderSetup />
  return <OrderEditor orderId={id} />
}

/* ── Step 1: minimal setup to create the order row, then hand off to the editor ── */
function NewOrderSetup() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [brandId, setBrandId] = useState('limt')
  const [eventDate, setEventDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('clients').select('id, name').is('deleted_at', null).order('name')
      .then(({ data }) => data && setClients(data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!clientId) return
    setCreating(true)
    setError(null)
    const { data, error } = await supabase
      .from('orders')
      .insert({ client_id: clientId, brand_id: brandId, event_date: eventDate || null })
      .select()
      .single()
    setCreating(false)
    if (error) {
      setError('Could not create the invoice. Please try again.')
      return
    }
    navigate(`/admin/orders/${data.id}`, { replace: true })
  }

  return (
    <div>
      <Link to="/admin/orders" className="dash-link-back">← All orders</Link>
      <div className="dash-topbar">
        <div>
          <span className="dash-kicker">New Invoice</span>
          <h1 className="dash-title">Start an Invoice</h1>
        </div>
      </div>

      <form className="dash-card" onSubmit={handleCreate} style={{ maxWidth: 460 }}>
        <div className="dash-form-grid">
          <label className="dash-field span-2">
            <span>Client</span>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              style={{ padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'none' }}
            >
              <option value="">Select a client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="dash-field">
            <span>Brand</span>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              style={{ padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'none' }}
            >
              <option value="limt">LIMT</option>
              <option value="tsismis">Tsismis</option>
            </select>
          </label>
          <label className="dash-field">
            <span>Event Date</span>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </label>
        </div>
        {error && <p className="dash-error" style={{ marginTop: 10 }}>{error}</p>}
        <button className="dash-btn" type="submit" disabled={creating || !clientId} style={{ marginTop: 18 }}>
          {creating ? 'Creating…' : 'Create Invoice'}
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--graphite)', marginTop: 10 }}>
          The invoice number is assigned automatically once created. You'll add line items on the next screen.
        </p>
      </form>
    </div>
  )
}

/* ── Step 2: the real editor, once an order row exists ── */
function OrderEditor({ orderId }) {
  const [order, setOrder] = useState(null)
  const [client, setClient] = useState(null)
  const [lineItems, setLineItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [catalogPick, setCatalogPick] = useState('')
  const [manualItem, setManualItem] = useState({ category: '', product_type: '', details: '', quantity: 1, bill_price: '' })

  const load = async () => {
    setLoading(true)
    const { data: orderData } = await supabase.from('orders').select('*').eq('id', orderId).single()
    if (orderData) {
      setOrder(orderData)
      const [{ data: clientData }, { data: itemsData }, { data: productsData }] = await Promise.all([
        supabase.from('clients').select('*').eq('id', orderData.client_id).single(),
        supabase.from('line_items').select('*').eq('order_id', orderId).order('sort_order'),
        supabase.from('products').select('*').eq('brand_id', orderData.brand_id).eq('is_active', true).order('category'),
      ])
      setClient(clientData || null)
      setLineItems(itemsData || [])
      setProducts(productsData || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [orderId])

  const totals = order
    ? calcTotals({
        lineItems,
        taxRate: order.tax_rate,
        discountAmount: order.discount_amount,
        depositAmount: order.deposit_amount,
      })
    : { subtotal: 0, taxAmount: 0, amountDue: 0 }

  const persistTotals = async (items = lineItems, orderState = order) => {
    const t = calcTotals({
      lineItems: items,
      taxRate: orderState.tax_rate,
      discountAmount: orderState.discount_amount,
      depositAmount: orderState.deposit_amount,
    })
    await supabase.from('orders').update({
      subtotal: t.subtotal,
      tax_amount: t.taxAmount,
      amount_due: t.amountDue,
    }).eq('id', orderId)
    setOrder((o) => ({ ...o, subtotal: t.subtotal, tax_amount: t.taxAmount, amount_due: t.amountDue }))
  }

  const addFromCatalog = async () => {
    const product = products.find((p) => p.id === catalogPick)
    if (!product) return
    const qty = 1
    const price = Number(product.base_price || 0)
    const { data, error } = await supabase.from('line_items').insert({
      order_id: orderId,
      item_type: 'product',
      category: product.category,
      product_type: product.name,
      quantity: qty,
      bill_price: price,
      total_price: qty * price,
    }).select().single()
    if (!error) {
      const updated = [...lineItems, data]
      setLineItems(updated)
      setCatalogPick('')
      persistTotals(updated)
    }
  }

  const addManualItem = async (e) => {
    e.preventDefault()
    if (!manualItem.product_type.trim()) return
    const qty = Number(manualItem.quantity || 1)
    const price = Number(manualItem.bill_price || 0)
    const { data, error } = await supabase.from('line_items').insert({
      order_id: orderId,
      item_type: 'product',
      category: manualItem.category.trim() || null,
      product_type: manualItem.product_type.trim(),
      details: manualItem.details.trim() || null,
      quantity: qty,
      bill_price: price,
      total_price: qty * price,
    }).select().single()
    if (!error) {
      const updated = [...lineItems, data]
      setLineItems(updated)
      setManualItem({ category: '', product_type: '', details: '', quantity: 1, bill_price: '' })
      persistTotals(updated)
    }
  }

  const addFee = async (label) => {
    const { data, error } = await supabase.from('line_items').insert({
      order_id: orderId,
      item_type: 'fee',
      product_type: label,
      quantity: 1,
      bill_price: 0,
      total_price: 0,
    }).select().single()
    if (!error) {
      const updated = [...lineItems, data]
      setLineItems(updated)
      persistTotals(updated)
    }
  }

  const updateLineItem = async (itemId, changes) => {
    const updated = lineItems.map((li) => {
      if (li.id !== itemId) return li
      const merged = { ...li, ...changes }
      merged.total_price = Number(merged.quantity || 0) * Number(merged.bill_price || 0)
      return merged
    })
    setLineItems(updated)
    const item = updated.find((li) => li.id === itemId)
    await supabase.from('line_items').update({
      quantity: item.quantity,
      bill_price: item.bill_price,
      total_price: item.total_price,
    }).eq('id', itemId)
    persistTotals(updated)
  }

  const deleteLineItem = async (itemId) => {
    await supabase.from('line_items').delete().eq('id', itemId)
    const updated = lineItems.filter((li) => li.id !== itemId)
    setLineItems(updated)
    persistTotals(updated)
  }

  const handleSaveOrder = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const { id: _id, created_at, updated_at, deleted_at, invoice_number, client_id, brand_id, subtotal, tax_amount, amount_due, ...updates } = order
    await supabase.from('orders').update(updates).eq('id', orderId)
    await persistTotals(lineItems, order)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleFlag = (field) => setOrder((o) => ({ ...o, [field]: !o[field] }))

  if (loading || !order) return <div className="dash-empty">Loading invoice…</div>

  return (
    <div>
      <Link to="/admin/orders" className="dash-link-back no-print">← All orders</Link>

      <div className="dash-topbar no-print">
        <div>
          <span className="dash-kicker">{order.brand_id === 'limt' ? 'LIMT' : 'Tsismis'} Invoice</span>
          <h1 className="dash-title">{order.invoice_number}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={order.status}
            onChange={async (e) => {
              const status = e.target.value
              setOrder((o) => ({ ...o, status }))
              await supabase.from('orders').update({ status }).eq('id', orderId)
            }}
            style={{ padding: '9px 14px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="dash-btn dash-btn--ghost" onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      </div>

      <div className="dash-card no-print" style={{ marginBottom: 20 }}>
        <div className="dash-section-label" style={{ marginBottom: 10 }}>Client</div>
        <p style={{ fontSize: '0.9rem' }}>
          <Link to={`/admin/clients/${client?.id}`}>{client?.name}</Link> · {client?.phone} · {client?.email}
        </p>
      </div>

      <form className="dash-card no-print" onSubmit={handleSaveOrder} style={{ marginBottom: 20 }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Event &amp; Delivery Details</div>
        <div className="dash-form-grid">
          <label className="dash-field">
            <span>Event Date</span>
            <input type="date" value={order.event_date || ''} onChange={(e) => setOrder({ ...order, event_date: e.target.value })} />
          </label>
          <label className="dash-field">
            <span>Fulfillment</span>
            <select
              value={order.fulfillment || ''}
              onChange={(e) => setOrder({ ...order, fulfillment: e.target.value })}
              style={{ padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'none' }}
            >
              <option value="">—</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </label>
          <label className="dash-field">
            <span>Delivery Time</span>
            <input value={order.delivery_time || ''} onChange={(e) => setOrder({ ...order, delivery_time: e.target.value })} placeholder="e.g. 3PM" />
          </label>
          <label className="dash-field span-2">
            <span>Delivery Address</span>
            <input value={order.delivery_address_line1 || ''} onChange={(e) => setOrder({ ...order, delivery_address_line1: e.target.value })} />
          </label>
          <label className="dash-field">
            <span>City</span>
            <input value={order.delivery_city || ''} onChange={(e) => setOrder({ ...order, delivery_city: e.target.value })} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
          {[
            ['is_sweet', 'Sweet'], ['is_savoury', 'Savoury'], ['is_mixed', 'Mixed'], ['is_other', 'Other'],
            ['needs_setup', 'Setup Needed'], ['is_rush', 'Rush Order'],
          ].map(([field, label]) => (
            <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
              <input type="checkbox" checked={!!order[field]} onChange={() => toggleFlag(field)} />
              {label}
            </label>
          ))}
        </div>

        <label className="dash-field" style={{ marginTop: 18 }}>
          <span>Special Instructions</span>
          <textarea rows={3} value={order.special_instructions || ''} onChange={(e) => setOrder({ ...order, special_instructions: e.target.value })} />
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <button className="dash-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Details'}</button>
          {saved && <span className="dash-saved">Saved</span>}
        </div>
      </form>

      <div className="dash-card no-print" style={{ marginBottom: 20 }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Line Items</div>

        {lineItems.length > 0 && (
          <table className="dash-table" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>Type</th><th>Item</th><th>Details</th><th>Qty</th><th>Price</th><th>Total</th><th></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li) => (
                <tr key={li.id} style={{ cursor: 'default' }}>
                  <td>{li.item_type === 'fee' ? 'Fee' : (li.category || '—')}</td>
                  <td>{li.product_type}</td>
                  <td>{li.details || '—'}</td>
                  <td style={{ width: 70 }}>
                    <input
                      type="number" min="0" step="1" value={li.quantity ?? 1}
                      onChange={(e) => updateLineItem(li.id, { quantity: e.target.value })}
                      style={{ width: 60, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6 }}
                    />
                  </td>
                  <td style={{ width: 100 }}>
                    <input
                      type="number" min="0" step="0.01" value={li.bill_price ?? 0}
                      onChange={(e) => updateLineItem(li.id, { bill_price: e.target.value })}
                      style={{ width: 90, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6 }}
                    />
                  </td>
                  <td>{money(li.total_price)}</td>
                  <td>
                    <button className="dash-btn--ghost dash-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => deleteLineItem(li.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <select
            value={catalogPick}
            onChange={(e) => setCatalogPick(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
          >
            <option value="">Add from catalog…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} {p.base_price ? `— $${Number(p.base_price).toFixed(2)}` : ''}</option>
            ))}
          </select>
          <button className="dash-btn dash-btn--ghost" onClick={addFromCatalog} disabled={!catalogPick} type="button">Add</button>
        </div>

        <form className="dash-inline-form" onSubmit={addManualItem} style={{ marginBottom: 14 }}>
          <input placeholder="Category" value={manualItem.category} onChange={(e) => setManualItem({ ...manualItem, category: e.target.value })} style={{ maxWidth: 120 }} />
          <input placeholder="Item name" value={manualItem.product_type} onChange={(e) => setManualItem({ ...manualItem, product_type: e.target.value })} required />
          <input placeholder="Details" value={manualItem.details} onChange={(e) => setManualItem({ ...manualItem, details: e.target.value })} />
          <input type="number" min="0" placeholder="Qty" value={manualItem.quantity} onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })} style={{ maxWidth: 70 }} />
          <input type="number" min="0" step="0.01" placeholder="Price" value={manualItem.bill_price} onChange={(e) => setManualItem({ ...manualItem, bill_price: e.target.value })} style={{ maxWidth: 100 }} />
          <button className="dash-btn" type="submit">Add Custom Item</button>
        </form>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FEE_PRESETS.map((label) => (
            <button key={label} className="dash-btn dash-btn--ghost" style={{ fontSize: '0.78rem' }} onClick={() => addFee(label)} type="button">
              + {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-card no-print" style={{ maxWidth: 420, marginLeft: 'auto' }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Totals</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Subtotal</span><span>{money(totals.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Tax Rate</span>
          <input
            type="number" step="0.01" min="0" max="1" value={order.tax_rate}
            onChange={(e) => setOrder({ ...order, tax_rate: e.target.value })}
            onBlur={() => persistTotals(lineItems, order)}
            style={{ width: 70, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6, textAlign: 'right' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Tax Amount</span><span>{money(totals.taxAmount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: 8 }}>
          <span>Discount</span>
          <input
            type="number" step="0.01" min="0" value={order.discount_amount}
            onChange={(e) => setOrder({ ...order, discount_amount: e.target.value })}
            onBlur={() => persistTotals(lineItems, order)}
            style={{ width: 90, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6, textAlign: 'right' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: 14 }}>
          <span>Deposit Paid</span>
          <input
            type="number" step="0.01" min="0" value={order.deposit_amount}
            onChange={(e) => setOrder({ ...order, deposit_amount: e.target.value })}
            onBlur={() => persistTotals(lineItems, order)}
            style={{ width: 90, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6, textAlign: 'right' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, borderTop: '1px solid var(--fog)', paddingTop: 12 }}>
          <span>Amount Due</span><span>{money(totals.amountDue)}</span>
        </div>
      </div>

      <PrintableInvoice order={order} client={client} lineItems={lineItems} totals={totals} />
    </div>
  )
}
