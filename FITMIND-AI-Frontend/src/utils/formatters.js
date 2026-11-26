export function formatCurrency(value, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

export function humanize(key) {
  const text = String(key).replaceAll('_', ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
