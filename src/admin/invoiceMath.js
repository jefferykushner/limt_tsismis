// Pure calculation helpers shared by the invoice builder and the printable view.

export function calcSubtotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + Number(item.total_price || 0), 0)
}

// The "list" price is what an item would normally cost (item_price + any
// add'l cost per unit) before any courtesy waiver. When it's higher than
// what's actually billed, the difference is a per-line waived amount.
export function lineItemListTotal(item) {
  const listUnit = Number(item.item_price || 0) + Number(item.addl_cost || 0)
  return listUnit * Number(item.quantity || 0)
}

export function lineItemWaivedAmount(item) {
  const waived = lineItemListTotal(item) - Number(item.total_price || 0)
  return waived > 0.004 ? round2(waived) : 0
}

export function calcWaivedBreakdown(lineItems) {
  return lineItems
    .map((item) => ({ id: item.id, label: item.product_type, amount: lineItemWaivedAmount(item) }))
    .filter((row) => row.amount > 0)
}

export function calcTotals({ lineItems, taxRate, discountAmount, depositAmount }) {
  const subtotal = calcSubtotal(lineItems)
  const taxAmount = subtotal * Number(taxRate || 0)
  const amountDue = subtotal + taxAmount - Number(discountAmount || 0) - Number(depositAmount || 0)
  return {
    subtotal: round2(subtotal),
    taxAmount: round2(taxAmount),
    amountDue: round2(amountDue),
  }
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function money(n) {
  return `$${Number(n || 0).toFixed(2)}`
}
