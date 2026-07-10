import { useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { calcTotals, calcWaivedBreakdown, feesOnly, groupLineItems, lineItemListTotal, lineItemWaivedAmount, money } from '../invoiceMath'
import { usePrintPreview } from '../usePrintPreview'
import PrintableInvoice from '../PrintableInvoice'

const FEE_PRESETS = ['Setup Fee', 'Delivery Fee', 'Service Fee', 'Rush Fee']
const NOTE_PRESETS = ['Special Instructions', 'Delivery Details', 'Disclaimer']

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

const inputStyle = { padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'none' }

/* ── Step 2: the real editor, once an order row exists ── */
function OrderEditor({ orderId }) {
  const navigate = useNavigate()
  const { isPreviewOpen, openPreview, closePreview } = usePrintPreview()
  const [order, setOrder] = useState(null)
  const [client, setClient] = useState(null)
  const [lineItems, setLineItems] = useState([])
  const [products, setProducts] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [catalogPick, setCatalogPick] = useState('')
  const [manualItem, setManualItem] = useState({ group_name: '', category: '', product_type: '', details: '', quantity: 1, item_price: '', addl_cost: '', bill_price: '' })
  const [newNote, setNewNote] = useState({ label: NOTE_PRESETS[0], customLabel: '', content: '' })

  const load = async () => {
    setLoading(true)
    const { data: orderData } = await supabase.from('orders').select('*').eq('id', orderId).single()
    if (orderData) {
      setOrder(orderData)
      const [{ data: clientData }, { data: itemsData }, { data: productsData }, { data: notesData }] = await Promise.all([
        supabase.from('clients').select('*').eq('id', orderData.client_id).single(),
        supabase.from('line_items').select('*').eq('order_id', orderId).order('sort_order'),
        supabase.from('products').select('*').eq('brand_id', orderData.brand_id).eq('is_active', true).order('category'),
        supabase.from('order_notes').select('*').eq('order_id', orderId).order('sort_order'),
      ])
      setClient(clientData || null)
      setLineItems(itemsData || [])
      setProducts(productsData || [])
      setNotes(notesData || [])
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

  const waivedBreakdown = calcWaivedBreakdown(lineItems)
  const totalWaived = waivedBreakdown.reduce((sum, row) => sum + row.amount, 0)

  const existingGroupNames = [...new Set(lineItems.map((li) => li.group_name).filter(Boolean))]

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
      item_price: price,
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
    const billPrice = Number(manualItem.bill_price || 0)
    const { data, error } = await supabase.from('line_items').insert({
      order_id: orderId,
      item_type: 'product',
      group_name: manualItem.group_name.trim() || null,
      category: manualItem.category.trim() || null,
      product_type: manualItem.product_type.trim(),
      details: manualItem.details.trim() || null,
      quantity: qty,
      item_price: manualItem.item_price === '' ? null : Number(manualItem.item_price),
      addl_cost: manualItem.addl_cost === '' ? null : Number(manualItem.addl_cost),
      bill_price: billPrice,
      total_price: qty * billPrice,
    }).select().single()
    if (!error) {
      const updated = [...lineItems, data]
      setLineItems(updated)
      setManualItem({ group_name: '', category: manualItem.category, product_type: '', details: '', quantity: 1, item_price: '', addl_cost: '', bill_price: '' })
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

  const handleLineItemChange = (itemId, field, value) => {
    setLineItems((items) => items.map((li) => {
      if (li.id !== itemId) return li
      const merged = { ...li, [field]: value }
      if (field === 'quantity' || field === 'bill_price') {
        merged.total_price = Number(merged.quantity || 0) * Number(merged.bill_price || 0)
      }
      return merged
    }))
  }

  const commitLineItem = async (itemId) => {
    const item = lineItems.find((li) => li.id === itemId)
    if (!item) return
    await supabase.from('line_items').update({
      group_name: item.group_name,
      category: item.category,
      product_type: item.product_type,
      details: item.details,
      quantity: item.quantity,
      item_price: item.item_price === '' ? null : item.item_price,
      addl_cost: item.addl_cost === '' ? null : item.addl_cost,
      bill_price: item.bill_price,
      total_price: item.total_price,
    }).eq('id', itemId)
    persistTotals(lineItems, order)
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

  const handleDeleteOrder = async () => {
    if (!confirm(`Delete invoice ${order.invoice_number}? It will be kept for 30 days before permanent deletion, in case this was a mistake.`)) return
    await supabase.from('orders').update({ deleted_at: new Date().toISOString() }).eq('id', orderId)
    navigate('/admin/orders')
  }

  const addNote = async () => {
    const label = newNote.label === 'Custom…' ? newNote.customLabel.trim() : newNote.label
    if (!label || !newNote.content.trim()) return
    const { data, error } = await supabase.from('order_notes').insert({
      order_id: orderId,
      label,
      content: newNote.content.trim(),
      sort_order: notes.length,
    }).select().single()
    if (!error) {
      setNotes([...notes, data])
      setNewNote({ label: NOTE_PRESETS[0], customLabel: '', content: '' })
    }
  }

  const deleteNote = async (noteId) => {
    await supabase.from('order_notes').delete().eq('id', noteId)
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  if (loading || !order) return <div className="dash-empty">Loading invoice…</div>

  const groupedOrder = groupLineItems(lineItems)

  const renderEditableRow = (li) => (
    <div className="li-row" key={li.id}>
      <div className="li-grid">
        <div>
          {li.item_type === 'fee' ? (
            <div className="li-static">Fee</div>
          ) : (
            <input
              value={li.category || ''}
              onChange={(e) => handleLineItemChange(li.id, 'category', e.target.value)}
              onBlur={() => commitLineItem(li.id)}
              placeholder="Category"
            />
          )}
        </div>
        <input
          value={li.product_type || ''}
          onChange={(e) => handleLineItemChange(li.id, 'product_type', e.target.value)}
          onBlur={() => commitLineItem(li.id)}
          placeholder="Item name"
        />
        <input
          type="number" min="0" step="1" value={li.quantity ?? 1}
          onChange={(e) => handleLineItemChange(li.id, 'quantity', e.target.value)}
          onBlur={() => commitLineItem(li.id)}
        />
        <input
          type="number" min="0" step="0.01" value={li.item_price ?? ''}
          onChange={(e) => handleLineItemChange(li.id, 'item_price', e.target.value)}
          onBlur={() => commitLineItem(li.id)}
          placeholder="—"
          title={li.item_type === 'fee' ? "Regular fee amount, before any waiver" : "Regular price per unit, before any waiver"}
        />
        <div>
          {li.item_type === 'fee' ? (
            <div className="li-static">—</div>
          ) : (
            <input
              type="number" min="0" step="0.01" value={li.addl_cost ?? ''}
              onChange={(e) => handleLineItemChange(li.id, 'addl_cost', e.target.value)}
              onBlur={() => commitLineItem(li.id)}
              placeholder="—"
              title="Additional per-unit cost, e.g. a customization surcharge (products only)"
            />
          )}
        </div>
        <input
          type="number" min="0" step="0.01" value={li.bill_price ?? 0}
          onChange={(e) => handleLineItemChange(li.id, 'bill_price', e.target.value)}
          onBlur={() => commitLineItem(li.id)}
          title="What's actually billed per unit"
        />
        <div className="li-total" title="Total">
          {lineItemWaivedAmount(li) > 0 && (
            <span style={{ textDecoration: 'line-through', color: 'var(--graphite)', marginRight: 6, fontSize: '0.8rem' }}>
              {money(lineItemListTotal(li))}
            </span>
          )}
          {money(li.total_price)}
        </div>
        <button className="dash-btn--ghost dash-btn li-remove" onClick={() => deleteLineItem(li.id)}>
          Remove
        </button>
      </div>
      <input
        className="li-details"
        value={li.details || ''}
        onChange={(e) => handleLineItemChange(li.id, 'details', e.target.value)}
        onBlur={() => commitLineItem(li.id)}
        placeholder="Details / notes for this item"
      />
    </div>
  )

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
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--graphite)' }}>
            <input
              type="checkbox"
              checked={!!order.totals_only}
              onChange={async (e) => {
                const totals_only = e.target.checked
                setOrder((o) => ({ ...o, totals_only }))
                await supabase.from('orders').update({ totals_only }).eq('id', orderId)
              }}
            />
            Totals only
          </label>
          <button className="dash-btn dash-btn--ghost" onClick={openPreview}>Preview</button>
          <button className="dash-btn dash-btn--ghost" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="dash-btn dash-btn--danger" onClick={handleDeleteOrder}>Delete Invoice</button>
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
              style={inputStyle}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <button className="dash-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Details'}</button>
          {saved && <span className="dash-saved">Saved</span>}
        </div>
      </form>

      <div className="dash-card no-print" style={{ marginBottom: 20 }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Line Items</div>

        {lineItems.length > 0 && (
          <div className="li-list">
            <div className="li-grid li-grid-header">
              <div>Type</div>
              <div>Item</div>
              <div>Qty</div>
              <div title="Regular price per unit">Reg. Price</div>
              <div title="Additional per-unit cost">Add'l</div>
              <div title="What's actually billed per unit">Bill Price</div>
              <div>Total</div>
              <div></div>
            </div>

            {groupedOrder.map((entry, idx) => {
              if (entry.type === 'single') return renderEditableRow(entry.item)
              const groupTotal = entry.items.reduce((s, i) => s + Number(i.total_price || 0), 0)
              const groupQty = entry.items.reduce((s, i) => s + Number(i.quantity || 0), 0)
              return (
                <Fragment key={`group-${entry.name}-${idx}`}>
                  <div className="li-group-header">{entry.name}</div>
                  {entry.items.map(renderEditableRow)}
                  <div className="li-group-total">
                    <span>TOTAL {entry.name.toUpperCase()}</span>
                    <span>{groupQty} items</span>
                    <span>{money(groupTotal)}</span>
                  </div>
                </Fragment>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <select
            value={catalogPick}
            onChange={(e) => setCatalogPick(e.target.value)}
            style={{ flex: 1, minWidth: 200, ...inputStyle }}
          >
            <option value="">Add from catalog…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} {p.base_price ? `— ${money(p.base_price)}` : ''}</option>
            ))}
          </select>
          <button className="dash-btn dash-btn--ghost" onClick={addFromCatalog} disabled={!catalogPick} type="button">Add</button>
        </div>

        <form onSubmit={addManualItem} style={{ marginBottom: 14, padding: 14, background: 'var(--cream)', borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <input
              list="group-name-options"
              placeholder="Group (optional, e.g. Charcuterie Boxes)"
              value={manualItem.group_name}
              onChange={(e) => setManualItem({ ...manualItem, group_name: e.target.value })}
              style={{ minWidth: 220 }}
            />
            <datalist id="group-name-options">
              {existingGroupNames.map((g) => <option key={g} value={g} />)}
            </datalist>
            <input placeholder="Category" value={manualItem.category} onChange={(e) => setManualItem({ ...manualItem, category: e.target.value })} style={{ maxWidth: 120 }} />
          </div>
          <div className="dash-inline-form" style={{ marginBottom: 0 }}>
            <input placeholder="Item / variation name" value={manualItem.product_type} onChange={(e) => setManualItem({ ...manualItem, product_type: e.target.value })} required style={{ flex: 2, minWidth: 220 }} />
            <input placeholder="Details" value={manualItem.details} onChange={(e) => setManualItem({ ...manualItem, details: e.target.value })} style={{ flex: 3, minWidth: 260 }} />
            <input type="number" min="0" placeholder="Qty" value={manualItem.quantity} onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })} style={{ maxWidth: 65 }} />
            <input type="number" min="0" step="0.01" placeholder="Reg. price" value={manualItem.item_price} onChange={(e) => setManualItem({ ...manualItem, item_price: e.target.value })} style={{ maxWidth: 95 }} title="Optional: the regular price, if different from what's billed" />
            <input type="number" min="0" step="0.01" placeholder="Add'l" value={manualItem.addl_cost} onChange={(e) => setManualItem({ ...manualItem, addl_cost: e.target.value })} style={{ maxWidth: 80 }} title="Optional: additional per-unit cost" />
            <input type="number" min="0" step="0.01" placeholder="Bill price" value={manualItem.bill_price} onChange={(e) => setManualItem({ ...manualItem, bill_price: e.target.value })} style={{ maxWidth: 95 }} required />
            <button className="dash-btn" type="submit">Add Item</button>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--graphite)', marginTop: 8 }}>
            Leave "Reg. price" and "Add'l" blank for a normal item. Fill them in only when the regular price is higher than what you're billing — the difference shows as a waived amount on the invoice.
          </p>
        </form>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FEE_PRESETS.map((label) => (
            <button key={label} className="dash-btn dash-btn--ghost" style={{ fontSize: '0.78rem' }} onClick={() => addFee(label)} type="button">
              + {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-card no-print" style={{ marginBottom: 20 }}>
        <div className="dash-section-label" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <NoteIcon /> Special Instructions &amp; Notes
        </div>

        {notes.length > 0 && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notes.map((n) => (
              <div key={n.id} style={{ padding: 12, background: 'var(--cream)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--graphite)' }}>{n.label}</div>
                  <div style={{ fontSize: '0.88rem', marginTop: 4 }}>{n.content}</div>
                </div>
                <button className="dash-btn dash-btn--ghost" style={{ fontSize: '0.72rem', padding: '4px 10px', height: 'fit-content' }} onClick={() => deleteNote(n.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={newNote.label}
            onChange={(e) => setNewNote({ ...newNote, label: e.target.value })}
            style={{ ...inputStyle, width: 180 }}
          >
            {NOTE_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
            <option value="Custom…">Custom…</option>
          </select>
          {newNote.label === 'Custom…' && (
            <input
              placeholder="Custom label"
              value={newNote.customLabel}
              onChange={(e) => setNewNote({ ...newNote, customLabel: e.target.value })}
              style={{ width: 160 }}
            />
          )}
          <textarea
            placeholder="Note content…"
            rows={2}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            style={{ flex: 1, minWidth: 220, padding: '9px 12px', border: '1px solid var(--fog)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
          />
          <button className="dash-btn" type="button" onClick={addNote}>Add Note</button>
        </div>
      </div>

      <div className="dash-card no-print" style={{ maxWidth: 440, marginLeft: 'auto' }}>
        <div className="dash-section-label" style={{ marginBottom: 14 }}>Totals</div>

        {waivedBreakdown.length > 0 && (
          <div style={{ marginBottom: 14, padding: 10, background: 'var(--cream)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--graphite)', marginBottom: 6 }}>Savings Applied</div>
            {waivedBreakdown.map((row) => (
              <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 3 }}>
                <span>{row.label}</span><span>-{money(row.amount)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginTop: 4, borderTop: '1px solid var(--fog)', paddingTop: 4 }}>
              <span>Total Savings</span><span>-{money(totalWaived)}</span>
            </div>
          </div>
        )}

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

        {feesOnly(lineItems).length > 0 && (
          <div style={{ marginBottom: 8, paddingTop: 4, borderTop: '1px dashed var(--fog)' }}>
            {feesOnly(lineItems).map((fee) => {
              const waived = lineItemWaivedAmount(fee)
              return (
                <div key={fee.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: 6 }}>
                  <span>{fee.product_type}</span>
                  <span>
                    {waived > 0 && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--graphite)', marginRight: 6 }}>
                        {money(lineItemListTotal(fee))}
                      </span>
                    )}
                    {money(fee.total_price)}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', marginBottom: 8 }}>
          <input
            placeholder="Discount label (e.g. Courtesy discount)"
            value={order.discount_label || ''}
            onChange={(e) => setOrder({ ...order, discount_label: e.target.value })}
            onBlur={handleSaveOrder}
            style={{ flex: 1, padding: '4px 6px', border: '1px solid var(--fog)', borderRadius: 6, fontSize: '0.82rem' }}
          />
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

      {isPreviewOpen && (
        <>
          <div className="invoice-preview-hint">Invoice Preview</div>
          <button className="invoice-preview-close" onClick={closePreview} aria-label="Close preview">✕</button>
        </>
      )}
      <PrintableInvoice order={order} client={client} lineItems={lineItems} totals={totals} notes={notes} waivedBreakdown={waivedBreakdown} totalWaived={totalWaived} groupedOrder={groupedOrder} />
    </div>
  )
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--blush)', flexShrink: 0 }}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3h6v3H9z" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}
