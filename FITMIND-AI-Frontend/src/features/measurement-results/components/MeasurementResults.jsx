import { useState } from 'react'
import { MEASUREMENT_LABELS, STATUS_LABELS } from '../../../constants/measurement'
import { effectiveValue } from '../../../services/measurement/normalize'
import { validateNumber } from '../../../utils/validation'
import { humanize } from '../../../utils/formatters'

function Row({ item, onCorrect }) {
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState('')
  const label = MEASUREMENT_LABELS[item.key] || humanize(item.key)
  const value = effectiveValue(item)
  const corrected = item.correction !== null
  const status = STATUS_LABELS[corrected ? 'manually_edited' : item.status] || { label: humanize(item.status), badge: 'text-bg-secondary' }
  const confidence = corrected || item.status === 'manual'
    ? 'Not applicable'
    : item.confidence === null ? 'Not provided' : `${Math.round(item.confidence * 100)}%`

  const close = () => { setDraft(null); setError('') }
  const save = (event) => {
    event.preventDefault()
    const problem = validateNumber(draft, { label, required: true, min: 1, max: 300 })
    if (problem) return setError(problem)
    onCorrect(item.key, Number(draft))
    close()
  }

  return (
    <li className="list-group-item py-3">
      <div className="row g-2 align-items-center">
        <div className="col-sm-4">
          <div className="fw-semibold">{label}</div>
          {item.note && !corrected && <div className="small text-secondary">{item.note}</div>}
        </div>
        <div className="col-sm-2 fs-5">{value === null ? '—' : `${value} ${item.unit}`}</div>
        <div className="col-sm-4">
          <span className={`badge ${status.badge}`}>{status.label}</span>
          <div className="small text-secondary">Confidence: {confidence}</div>
          {corrected && <div className="small text-secondary">Original: {item.value === null ? 'none' : `${item.value} ${item.unit}`}</div>}
        </div>
        <div className="col-sm-2 text-sm-end">
          <button type="button" className="btn btn-sm btn-outline-primary" aria-label={`Correct ${label}`}
            onClick={() => setDraft(value === null ? '' : String(value))}>{value === null ? 'Add' : 'Correct'}</button>
          {corrected && <button type="button" className="btn btn-sm btn-link" onClick={() => { onCorrect(item.key, null); close() }}>Undo</button>}
        </div>
      </div>
      {draft !== null && (
        <form className="d-flex flex-wrap gap-2 mt-2" onSubmit={save} noValidate>
          <input type="number" step="any" autoFocus className={`form-control form-control-sm w-auto ${error ? 'is-invalid' : ''}`}
            aria-label={`${label} in ${item.unit}`} value={draft} onChange={(e) => { setDraft(e.target.value); setError('') }} />
          <button type="submit" className="btn btn-sm btn-primary">Save</button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={close}>Cancel</button>
          {error && <div className="invalid-feedback d-block">{error}</div>}
        </form>
      )}
    </li>
  )
}

// Reusable for body and garment results. onCorrect(key, number | null).
export default function MeasurementResults({ result, onCorrect }) {
  return (
    <>
      <p className="text-secondary">
        Source: {result.source === 'manual' ? 'entered by you' : 'measurement service'}.
      </p>
      <ul className="list-group mb-3">
        {result.items.map((item) => <Row key={item.key} item={item} onCorrect={onCorrect} />)}
      </ul>
      {result.warnings.length > 0 && (
        <div className="alert alert-warning">
          <strong>Notes from the measurement service</strong>
          <ul className="mb-0">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
    </>
  )
}
