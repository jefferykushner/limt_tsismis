import { Fragment } from 'react'
import { createPortal } from 'react-dom'
import { money, lineItemListTotal, lineItemWaivedAmount, feesOnly, titleCase } from './invoiceMath'
import limtLogoFull from '../assets/limt-logo-full.png'
import tsismisLogoFull from '../assets/tsismis-logo-full.png'
import './invoice-print.css'

const BRAND_INFO = {
  limt: { name: 'Love in My Tummy', tagline: 'Made with care. Delivered with love.', logo: limtLogoFull },
  tsismis: { name: 'Tsismis', tagline: "You didn't hear this from me.", logo: tsismisLogoFull },
}

export default function PrintableInvoice({ order, client, lineItems, totals, notes, waivedBreakdown, groupedOrder }) {
  const brand = BRAND_INFO[order.brand_id] || BRAND_INFO.limt
  const productGroups = (groupedOrder || []).filter((e) => e.type === 'group' || e.item?.item_type === 'product')
  const fees = feesOnly(lineItems)
  const totalsOnly = !!order.totals_only

  const printRoot = document.getElementById('print-root')
  if (!printRoot) return null

  return createPortal(
    <div className="invoice-print">
      <div className="invoice-print__header">
        <div>
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} className="invoice-print__logo" />
          ) : (
            <>
              <div className="invoice-print__brand">{brand.name}</div>
              <div className="invoice-print__tagline">{brand.tagline}</div>
            </>
          )}
        </div>
        <div className="invoice-print__meta">
          <div><b>Invoice #</b>{order.invoice_number}</div>
          <div><b>Order Date</b>{order.order_date}</div>
          <div><b>Status</b>{titleCase(order.status)}</div>
        </div>
      </div>

      <div className="invoice-print__cols">
        <div>
          <div className="invoice-print__col-title">Client</div>
          <p><strong>{client?.name}</strong></p>
          <p>{client?.phone}</p>
          <p>{client?.email}</p>
          <p>{client?.billing_address_line1}</p>
          <p>{client?.billing_city} {client?.billing_province} {client?.billing_postal_code}</p>
        </div>
        <div>
          <div className="invoice-print__col-title">Event Details</div>
          <p><strong>Event Date:</strong> {order.event_date || '—'}</p>
          <p><strong>Fulfillment:</strong> {titleCase(order.fulfillment) || '—'}</p>
          {order.fulfillment === 'delivery' && (
            <>
              <p><strong>Delivery Time:</strong> {order.delivery_time || '—'}</p>
              <p>{order.delivery_address_line1}</p>
              <p>{order.delivery_city} {order.delivery_province} {order.delivery_postal_code}</p>
            </>
          )}
        </div>
      </div>

      {!totalsOnly && productGroups.length > 0 && (
        <table>
          <colgroup>
            <col className="col-category" />
            <col className="col-item" />
            <col className="col-details" />
            <col className="col-qty" />
            <col className="col-price" />
            <col className="col-total" />
          </colgroup>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th>Details</th>
              <th className="num">Qty</th>
              <th className="num">Price</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {productGroups.map((entry, idx) => {
              if (entry.type === 'single') {
                const li = entry.item
                const waived = lineItemWaivedAmount(li)
                return (
                  <tr key={li.id}>
                    <td>{li.category || '—'}</td>
                    <td>{li.product_type}</td>
                    <td>{li.details || '—'}</td>
                    <td className="num">{li.quantity}</td>
                    <td className="num">{money(li.bill_price)}</td>
                    <td className="num">
                      {waived > 0 && (
                        <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 6 }}>
                          {money(lineItemListTotal(li))}
                        </span>
                      )}
                      {money(li.total_price)}
                    </td>
                  </tr>
                )
              }
              const groupTotal = entry.items.reduce((s, i) => s + Number(i.total_price || 0), 0)
              const groupQty = entry.items.reduce((s, i) => s + Number(i.quantity || 0), 0)
              return (
                <Fragment key={`g-${idx}`}>
                  <tr><td colSpan={6} style={{ fontWeight: 700, paddingTop: 10 }}>{entry.name}</td></tr>
                  {entry.items.map((li) => {
                    const waived = lineItemWaivedAmount(li)
                    return (
                      <tr key={li.id}>
                        <td></td>
                        <td style={{ paddingLeft: 14 }}>{li.product_type}</td>
                        <td>{li.details || '—'}</td>
                        <td className="num">{li.quantity}</td>
                        <td className="num">{money(li.bill_price)}</td>
                        <td className="num">
                          {waived > 0 && (
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 6 }}>
                              {money(lineItemListTotal(li))}
                            </span>
                          )}
                          {money(li.total_price)}
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ fontWeight: 700 }}>
                    <td colSpan={3}>TOTAL {entry.name.toUpperCase()}</td>
                    <td className="num">{groupQty}</td>
                    <td></td>
                    <td className="num">{money(groupTotal)}</td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      )}

      <div className="invoice-print__bottom-row">
        <div className="invoice-print__notes-box">
          {notes && notes.length > 0 && notes.map((n) => (
            <div key={n.id} className="invoice-print__note">
              <strong>{n.label}:</strong> {n.content}
            </div>
          ))}
        </div>

        <div className="invoice-print__totals">
          {!totalsOnly && waivedBreakdown && waivedBreakdown.length > 0 && (
            <div className="invoice-print__savings">
              <div className="invoice-print__savings-title">Savings Applied</div>
              {waivedBreakdown.map((row) => (
                <div className="invoice-print__savings-row" key={row.id}>
                  <span>{row.label}</span><span>-{money(row.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="invoice-print__totals-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
          <div className="invoice-print__totals-row"><span>Tax ({(order.tax_rate * 100).toFixed(0)}%)</span><span>{money(totals.taxAmount)}</span></div>

          {fees.map((fee) => {
            const waived = lineItemWaivedAmount(fee)
            return (
              <div className="invoice-print__totals-row" key={fee.id}>
                <span>{fee.product_type}</span>
                <span>
                  {waived > 0 && (
                    <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 6 }}>
                      {money(lineItemListTotal(fee))}
                    </span>
                  )}
                  {money(fee.total_price)}
                </span>
              </div>
            )
          })}

          {order.discount_amount > 0 && (
            <div className="invoice-print__totals-row"><span>{order.discount_label || 'Discount'}</span><span>-{money(order.discount_amount)}</span></div>
          )}
          {order.deposit_amount > 0 && (
            <div className="invoice-print__totals-row"><span>Deposit Paid</span><span>-{money(order.deposit_amount)}</span></div>
          )}
          <div className="invoice-print__totals-row grand"><span>Amount Due</span><span>{money(totals.amountDue)}</span></div>
        </div>
      </div>

      <div className="invoice-print__footer">Thank you for supporting our small business!</div>
    </div>,
    printRoot
  )
}
