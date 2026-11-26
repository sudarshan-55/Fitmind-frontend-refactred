// The measurement service decodes JPG and PNG only.
export const IMAGE_LIMITS = {
  maxBytes: 10 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png'],
}

export const STATUS_LABELS = {
  estimated: { label: 'Estimated', badge: 'text-bg-warning' },
  guided_estimate: { label: 'Estimated from your points', badge: 'text-bg-warning' },
  low_confidence: { label: 'Low confidence', badge: 'text-bg-warning' },
  unsupported: { label: 'Not available from a photo', badge: 'text-bg-secondary' },
  unavailable: { label: 'Unavailable', badge: 'text-bg-secondary' },
  manual: { label: 'Entered by you', badge: 'text-bg-info' },
  manually_edited: { label: 'Corrected by you', badge: 'text-bg-info' },
}

export const MEASUREMENT_LABELS = {
  shoulder_width: 'Shoulder width',
  chest_circumference: 'Chest circumference',
  waist_circumference: 'Waist circumference',
  hip_circumference: 'Hip circumference',
  hip_width: 'Hip width (straight line)',
  inseam: 'Inseam',
  length: 'Garment length',
  width: 'Garment width',
  sleeve_length: 'Sleeve length',
  waist_width: 'Waist width (flat)',
}

export const MANUAL_BODY_FIELDS = {
  shoulder_width: { min: 20, max: 80 },
  chest_circumference: { min: 40, max: 200 },
  waist_circumference: { min: 40, max: 200 },
  hip_circumference: { min: 40, max: 220 },
  inseam: { min: 30, max: 120 },
}

// Dimension names accepted by the measurement service. T-shirts are measured as shirts.
export const GARMENT_CATEGORIES = {
  shirt: { label: 'Shirt', apiCategory: 'shirt', dimensions: ['length', 'width', 'shoulder_width', 'sleeve_length'] },
  tshirt: { label: 'T-shirt', apiCategory: 'shirt', dimensions: ['length', 'width', 'shoulder_width', 'sleeve_length'] },
  trousers: { label: 'Trousers', apiCategory: 'trousers', dimensions: ['length', 'waist_width'] },
}
