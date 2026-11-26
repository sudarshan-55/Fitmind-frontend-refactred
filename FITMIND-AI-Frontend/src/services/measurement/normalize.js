const CORE_BODY_KEYS = ['shoulder_width', 'chest_circumference', 'waist_circumference', 'hip_circumference']

// Converts an API response into the shape the results component renders.
// Anything missing stays missing: no value or confidence is ever filled in.
export function normalizeMeasurements(data, type) {
  const source = data?.measurements
  if (data?.success === false || !source || typeof source !== 'object' || Array.isArray(source)) {
    throw new Error(data?.error?.message || 'The server response did not contain measurements.')
  }
  const keys = Object.keys(source)
  const ordered = type === 'body' ? [...new Set([...CORE_BODY_KEYS, ...keys])] : keys
  const items = ordered.map((key) => {
    const entry = source[key] || {}
    const value = typeof entry.value === 'number' && Number.isFinite(entry.value) && entry.value > 0 ? entry.value : null
    let status = entry.status || (value === null ? 'unavailable' : 'estimated')
    if (value === null && status !== 'unsupported') status = 'unavailable'
    return {
      key,
      value,
      unit: data.unit || 'cm',
      status,
      confidence: typeof entry.confidence === 'number' && entry.confidence >= 0 && entry.confidence <= 1 ? entry.confidence : null,
      note: entry.note || '',
      correction: null,
    }
  })
  return { type, source: 'api', items, warnings: Array.isArray(data.warnings) ? data.warnings : [] }
}

export function manualMeasurements(manual) {
  const items = Object.entries(manual)
    .filter(([, raw]) => String(raw).trim())
    .map(([key, raw]) => ({ key, value: Number(raw), unit: 'cm', status: 'manual', confidence: null, note: '', correction: null }))
  return { type: 'body', source: 'manual', items, warnings: [] }
}

export const effectiveValue = (item) => item.correction ?? item.value
