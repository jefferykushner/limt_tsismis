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

export function titleCase(s) {
  if (!s) return s
  return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
}

// Groups line items for display: items sharing a group_name are clustered
// together (used for things like "Personal Charcuterie Boxes" with several
// dietary variations), everything else renders as an individual row.
export function groupLineItems(lineItems) {
  const groupedOrder = []
  const seenGroups = new Set()
  lineItems.forEach((li) => {
    if (li.group_name) {
      if (!seenGroups.has(li.group_name)) {
        seenGroups.add(li.group_name)
        groupedOrder.push({ type: 'group', name: li.group_name, items: lineItems.filter((x) => x.group_name === li.group_name) })
      }
    } else {
      groupedOrder.push({ type: 'single', item: li })
    }
  })
  return groupedOrder
}
