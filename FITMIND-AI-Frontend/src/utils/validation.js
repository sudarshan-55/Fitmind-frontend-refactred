export function validateNumber(raw, { label, required = false, min, max, integer = false }) {
  const text = String(raw ?? '').trim()
  if (!text) return required ? `${label} is required.` : ''
  const value = Number(text)
  if (!Number.isFinite(value)) return `${label} must be a number.`
  if (integer && !Number.isInteger(value)) return `${label} must be a whole number.`
  if (value < min || value > max) return `${label} must be between ${min} and ${max}.`
  return ''
}

const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message))

export function validateBasics(values) {
  return compact({
    height: validateNumber(values.height, { label: 'Height', required: true, min: 51, max: 250 }),
    weight: validateNumber(values.weight, { label: 'Weight', required: true, min: 20, max: 300 }),
    age: validateNumber(values.age, { label: 'Age', min: 13, max: 100, integer: true }),
  })
}

export function validateManual(manual, fields, labels) {
  const errors = compact(Object.fromEntries(
    Object.entries(fields).map(([key, range]) => [key, validateNumber(manual[key], { label: labels[key], ...range })])
  ))
  if (!Object.keys(fields).some((key) => String(manual[key] ?? '').trim())) {
    errors.manual = 'Enter at least one measurement.'
  }
  return errors
}

export function isCompleteLine(line) {
  return line?.length === 2 && Math.hypot(line[1].x - line[0].x, line[1].y - line[0].y) >= 2
}

export function validateGarment({ category, referenceLength, points }, photo) {
  return compact({
    category: category ? '' : 'Choose a garment category.',
    photo: photo ? '' : 'Upload a photo of the garment.',
    referenceLength: validateNumber(referenceLength, { label: 'Reference length', required: true, min: 1, max: 500 }),
    reference: isCompleteLine(points.reference) ? '' : 'Mark both ends of the ruler or reference object on the photo.',
  })
}

export function validatePreferences({ occasion, category, minBudget, maxBudget }) {
  const range = { min: 0, max: 1000000 }
  const errors = compact({
    occasion: occasion ? '' : 'Choose an occasion.',
    category: category ? '' : 'Choose a clothing category.',
    minBudget: validateNumber(minBudget, { label: 'Minimum budget', ...range }),
    maxBudget: validateNumber(maxBudget, { label: 'Maximum budget', ...range }),
  })
  if (!errors.minBudget && !errors.maxBudget && minBudget !== '' && maxBudget !== '' && Number(maxBudget) < Number(minBudget)) {
    errors.maxBudget = 'Maximum budget must not be less than the minimum.'
  }
  return errors
}
