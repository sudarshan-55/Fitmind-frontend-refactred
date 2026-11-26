import { useEffect, useId, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { IMAGE_LIMITS } from '../../../constants/measurement'

function checkImage(file) {
  if (!IMAGE_LIMITS.acceptedTypes.includes(file.type)) return Promise.resolve('Please choose a JPG or PNG image.')
  if (file.size > IMAGE_LIMITS.maxBytes) return Promise.resolve('Image is larger than 10 MB. Choose a smaller file.')
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    const done = (message) => { URL.revokeObjectURL(url); resolve(message) }
    image.onload = () => done('')
    image.onerror = () => done('This image could not be opened. Try another file.')
    image.src = url
  })
}

export function useObjectUrl(file) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!file) { setUrl(''); return undefined }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

// Controlled image picker: click, drag and drop, preview, replace and remove.
export default function UploadPanel({ label, required, hint, file, onChange, error, disabled }) {
  const inputRef = useRef(null)
  const latest = useRef(0)
  const id = useId()
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const preview = useObjectUrl(file)
  const message = fileError || error

  const choose = async (next) => {
    if (!next || disabled) return
    const ticket = ++latest.current
    const problem = await checkImage(next)
    if (ticket !== latest.current) return
    setFileError(problem)
    if (!problem) onChange(next)
  }

  const remove = () => {
    latest.current += 1
    setFileError('')
    onChange(null)
  }

  return (
    <div>
      <p className="form-label mb-2" id={`${id}-label`}>
        {label} {required ? <span className="text-danger" aria-hidden="true">*</span> : <span className="text-secondary small">(optional)</span>}
      </p>
      <div
        className={`dropzone d-flex flex-column align-items-center justify-content-center text-center p-3 ${dragging ? 'dragging' : ''} ${message ? 'is-invalid' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]) }}
      >
        {file ? (
          <>
            {preview && <img className="upload-preview mb-2" src={preview} alt={`Preview: ${label}`} />}
            <p className="small text-break mb-2">{file.name}</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-sm btn-outline-secondary" disabled={disabled} onClick={() => inputRef.current.click()}>Replace</button>
              <button type="button" className="btn btn-sm btn-outline-danger" disabled={disabled} onClick={remove}>Remove</button>
            </div>
          </>
        ) : (
          <>
            <UploadCloud size={28} className="mb-2 text-secondary" aria-hidden="true" />
            <p className="mb-2">Drag an image here, or</p>
            <button type="button" className="btn btn-sm btn-outline-primary mb-2" disabled={disabled}
              aria-describedby={`${id}-label`} onClick={() => inputRef.current.click()}>Browse files</button>
            <small className="text-secondary">JPG or PNG, up to 10 MB</small>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" className="d-none" accept={IMAGE_LIMITS.acceptedTypes.join(',')}
        aria-labelledby={`${id}-label`}
        onChange={(e) => { choose(e.target.files?.[0]); e.target.value = '' }} />
      {message && <div className="invalid-feedback d-block" role="alert">{message}</div>}
      {!message && hint && <div className="form-text">{hint}</div>}
    </div>
  )
}
