import axios from 'axios'

// No default Content-Type: axios sets JSON or multipart (with boundary) from the payload.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
})

// Attach auth headers here when authentication is implemented.

export function getErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
  const response = error?.response
  if (response) {
    const message = response.data?.error?.message || response.data?.message
    if (message) return message
    if (response.status === 404) return 'This service is not available on the server yet (404).'
    return `The server returned an error (${response.status}). Check that the backend is running.`
  }
  if (error?.request) return 'Could not reach the server. Check your connection and that the backend is running.'
  return error?.message || 'Something went wrong.'
}

export default apiClient
