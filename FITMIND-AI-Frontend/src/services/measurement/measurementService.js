import apiClient from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import { GARMENT_CATEGORIES } from '../../constants/measurement'
import { isCompleteLine } from '../../utils/validation'
import { normalizeMeasurements } from './normalize'

export function buildBodyFormData(values, photos) {
  const form = new FormData()
  form.append('image', photos.front)
  if (photos.side) form.append('side_image', photos.side)
  form.append('height_cm', values.height)
  form.append('weight_kg', values.weight)
  if (values.age) form.append('age', values.age)
  if (values.sizingProfile) form.append('sizing_profile', values.sizingProfile)
  if (values.fit) form.append('fit_preference', values.fit)
  return form
}

export function buildGarmentFormData({ category, referenceLength, points }, photo) {
  const config = GARMENT_CATEGORIES[category]
  const [start, end] = points.reference
  const form = new FormData()
  form.append('image', photo)
  form.append('garment_category', config.apiCategory)
  form.append('garment_type', category)
  form.append('calibration_length_cm', referenceLength)
  form.append('calibration_start_x', start.x)
  form.append('calibration_start_y', start.y)
  form.append('calibration_end_x', end.x)
  form.append('calibration_end_y', end.y)
  const guided = Object.fromEntries(
    config.dimensions
      .filter((name) => isCompleteLine(points[name]))
      .map((name) => [name, { start: points[name][0], end: points[name][1] }])
  )
  if (Object.keys(guided).length) form.append('guided_measurement_lines_json', JSON.stringify(guided))
  return form
}

export const measurementService = {
  async createBodyMeasurement(values, photos, signal) {
    const { data } = await apiClient.post(API_ENDPOINTS.bodyMeasurements.create, buildBodyFormData(values, photos), { signal })
    return normalizeMeasurements(data, 'body')
  },
  async createGarmentMeasurement(values, photo, signal) {
    const { data } = await apiClient.post(API_ENDPOINTS.garmentMeasurements.create, buildGarmentFormData(values, photo), { signal })
    return { ...normalizeMeasurements(data, 'garment'), category: values.category }
  },
}
