import { useId } from 'react'

// Controlled input or select with a label, hint and error message.
export default function FormField({ label, value, onChange, error, hint, required, options, placeholder, className = 'col-md-6', ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const shared = {
    id, value, required, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy,
    onChange: (event) => onChange(event.target.value), ...props,
  }
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {label} {required ? <span className="text-danger" aria-hidden="true">*</span> : <span className="text-secondary small">(optional)</span>}
      </label>
      {options ? (
        <select {...shared} className={`form-select ${error ? 'is-invalid' : ''}`}>
          <option value="">{placeholder || 'Select'}</option>
          {Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
        </select>
      ) : (
        <input type="number" inputMode="decimal" step="any" {...shared} placeholder={placeholder}
          className={`form-control ${error ? 'is-invalid' : ''}`} />
      )}
      {error && <div className="invalid-feedback d-block" id={`${id}-error`}>{error}</div>}
      {!error && hint && <div className="form-text" id={`${id}-hint`}>{hint}</div>}
    </div>
  )
}
