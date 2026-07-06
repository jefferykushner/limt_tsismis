// Returns the first letter of the first word plus the first letter of the
// last word — e.g. "Helen Voizhicki" -> "HV", "Mary Jane Watson" -> "MW"
// (middle names are skipped, not included). Falls back to the first two
// characters for a single-word name (e.g. a one-word business name).
export function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
