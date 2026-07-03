import { money } from './invoiceMath'
import './invoice-print.css'

const BRAND_INFO = {
  limt: { name: 'Love in My Tummy', tagline: 'Made with care. Delivered with love.' },
  tsismis: { name: 'Tsismis', tagline: 'Filipino-inspired. Made with a little chismis.' },
}

export default function PrintableInvoice({ order, client, lineItems, totals }) {
  const brand = BRAND_INFO[order.brand_id] || BRAND_INFO.limt
  const products = lineItems.filter((i) => i.item_type === 'product')
  const fees = lineItems.filter((i) => i.item_type === 'fee')

  return (
    <div className="invoice-print">
      <div className="invoice-print__header">
        <div>
          <div className="invoice-print__brand">{brand.name}</div>
          <div className="invoice-print__tagline">{brand.tagline}</div>
        </div>
        <div className="invoice-print__meta">
          <div><b>Invoice #</b>{order.invoice_number}</div>
          <div><b>Order Date</b>{order.order_date}</div>
          <div><b>Status</b>{order.status}</div>
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
          <p><strong>Fulfillment:</strong> {order.fulfillment || '—'}</p>
          {order.fulfillment === 'delivery' && (
            <>
              <p><strong>Delivery Time:</strong> {order.delivery_time || '—'}</p>
              <p>{order.delivery_address_line1}</p>
              <p>{order.delivery_city} {order.delivery_province} {order.delivery_postal_code}</p>
            </>
          )}
        </div>
      </div>

      {products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th>Details</th>
              <th className="num">Qty</th>
              <th className="num">Unit Price</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.category || '—'}</td>
                <td>{item.product_type}</td>
                <td>{item.details || '—'}</td>
                <td className="num">{item.quantity}</td>
                <td className="num">{money(item.bill_price)}</td>
                <td className="num">{money(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {fees.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Additional Fees</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((item) => (
              <tr key={item.id}>
                <td>{item.product_type}</td>
                <td className="num">{money(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="invoice-print__totals">
        <div><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
        <div><span>Tax ({(order.tax_rate * 100).toFixed(0)}%)</span><span>{money(totals.taxAmount)}</span></div>
        {order.discount_amount > 0 && (
          <div><span>Discount</span><span>-{money(order.discount_amount)}</span></div>
        )}
        {order.deposit_amount > 0 && (
          <div><span>Deposit Paid</span><span>-{money(order.deposit_amount)}</span></div>
        )}
        <div className="grand"><span>Amount Due</span><span>{money(totals.amountDue)}</span></div>
      </div>

      {order.special_instructions && (
        <div className="invoice-print__notes">
          <strong>Special Instructions:</strong> {order.special_instructions}
        </div>
      )}

      <div className="invoice-print__footer">Thank you for supporting our small business!</div>
    </div>
  )
}
