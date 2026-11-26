import apiClient from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import { MOCK_PRODUCTS } from '../../mocks/products'

export const USE_MOCK_CATALOGUE = import.meta.env.VITE_USE_MOCK_CATALOGUE !== 'false'

const SEARCH_URLS = {
  myntra: (q) => `https://www.myntra.com/${encodeURIComponent(q)}`,
  amazon: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  flipkart: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  ajio: (q) => `https://www.ajio.com/search/?text=${encodeURIComponent(q)}`,
}

export function filterMockProducts(preferences) {
  const { occasion, category, minBudget, maxBudget, fit, marketplace } = preferences
  return MOCK_PRODUCTS.filter((p) =>
    (!occasion || p.occasions.includes(occasion)) &&
    (!category || p.category === category) &&
    (minBudget === '' || p.price >= Number(minBudget)) &&
    (maxBudget === '' || p.price <= Number(maxBudget)) &&
    (!fit || p.fit === fit) &&
    (!marketplace || p.marketplace === marketplace)
  ).map((p) => ({ ...p, url: SEARCH_URLS[p.marketplace](p.title), linkType: 'search', recommendedSize: null }))
}

const safeUrl = (url) => (/^https?:\/\//i.test(url || '') ? url : null)

export function normalizeProducts(data) {
  if (!Array.isArray(data?.products)) throw new Error('The server response did not contain a product list.')
  return data.products.map((p) => ({
    id: String(p.id),
    title: p.title,
    marketplace: p.marketplace,
    price: Number.isFinite(p.price) ? p.price : null,
    imageUrl: safeUrl(p.imageUrl),
    url: safeUrl(p.url),
    linkType: 'product',
    // A size is shown only when the backend says it came from a verified size chart.
    recommendedSize: p.sizeChartVerified === true ? p.recommendedSize || null : null,
  }))
}

// Mock and API results are never mixed, and an API failure does not fall back to mock data.
export const productService = {
  getProducts: (params) => apiClient.get(API_ENDPOINTS.products.list, { params }),
  async getRecommendations(preferences, measurements, signal) {
    if (USE_MOCK_CATALOGUE) return { source: 'mock', products: filterMockProducts(preferences) }
    const { data } = await apiClient.post(API_ENDPOINTS.products.recommendations, { preferences, measurements }, { signal })
    return { source: 'api', products: normalizeProducts(data) }
  },
}
