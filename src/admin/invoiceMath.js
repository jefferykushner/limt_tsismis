// Pure calculation helpers shared by the invoice builder and the printable view.

export function calcSubtotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + Number(item.total_price || 0), 0)
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
