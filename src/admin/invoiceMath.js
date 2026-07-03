// Pure calculation helpers shared by the invoice builder and the printable view.
//
// Products are subtotaled and taxed. Fees sit outside that (matching the
// original paper invoice this is modeled on) and are listed individually
// in the totals block rather than folded invisibly into one number.

export function calcProductSubtotal(lineItems) {
  return lineItems
    .filter((item) => item.item_type === 'product')
    .reduce((sum, item) => sum + Number(item.total_price || 0), 0)
}

export function feesOnly(lineItems) {
  return lineItems.filter((item) => item.item_type === 'fee')
}

// The "list" price is what an item or fee would normally cost (item_price,
// plus any per-unit add'l cost for products) before any courtesy waiver.
// When it's higher than what's actually billed, the difference is a waived
// amount, shown struck through on the invoice.
export function lineItemListTotal(item) {
  const listUnit = Number(item.item_price || 0) + Number(item.addl_cost || 0)
  return listUnit * Number(item.quantity || 1)
}

export function lineItemWaivedAmount(item) {
  if (!item.item_price) return 0
  const waived = lineItemListTotal(item) - Number(item.total_price || 0)
  return waived > 0.004 ? round2(waived) : 0
}

export function calcWaivedBreakdown(lineItems) {
  return lineItems
    .filter((item) => item.item_type === 'product')
    .map((item) => ({ id: item.id, label: item.product_type, amount: lineItemWaivedAmount(item) }))
    .filter((row) => row.amount > 0)
}

export function calcTotals({ lineItems, taxRate, discountAmount, depositAmount }) {
  const subtotal = calcProductSubtotal(lineItems)
  const taxAmount = subtotal * Number(taxRate || 0)
  const feesTotal = feesOnly(lineItems).reduce((sum, item) => sum + Number(item.total_price || 0), 0)
  const amountDue = subtotal + taxAmount + feesTotal - Number(discountAmount || 0) - Number(depositAmount || 0)
  return {
    subtotal: round2(subtotal),
    taxAmount: round2(taxAmount),
    feesTotal: round2(feesTotal),
    amountDue: round2(amountDue),
  }
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

const CAD_FORMATTER = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function money(n) {
  return CAD_FORMATTER.format(Number(n || 0))
}
