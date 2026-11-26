import { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services/api/client'

// Runs one request at a time and cancels it if the user leaves the page.
export function useSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const controller = useRef(null)
  useEffect(() => () => controller.current?.abort(), [])

  const run = async (task, onSuccess) => {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setLoading(true)
    setError('')
    try {
      const result = await task(current.signal)
      if (!current.signal.aborted) onSuccess(result)
    } catch (err) {
      if (!current.signal.aborted) setError(getErrorMessage(err))
    } finally {
      if (!current.signal.aborted) setLoading(false)
    }
  }

  return { loading, error, run, clearError: () => setError('') }
}
