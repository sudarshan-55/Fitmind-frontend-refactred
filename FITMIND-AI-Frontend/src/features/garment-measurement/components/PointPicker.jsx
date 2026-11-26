import { useState } from 'react'
import { useObjectUrl } from '../../shared/components/UploadPanel'

// Lets the user mark the two ends of a line. Points are stored in original image pixels.
export default function PointPicker({ file, lines, points, onChange, error }) {
  const url = useObjectUrl(file)
  const [active, setActive] = useState('reference')
  const [size, setSize] = useState(null)
  const current = lines[active] ? active : 'reference'

  const addPoint = (event) => {
    if (!size) return
    const box = event.currentTarget.getBoundingClientRect()
    const clamp = (v, max) => Math.min(Math.max(Math.round(v), 0), max)
    const point = {
      x: clamp(((event.clientX - box.left) / box.width) * size.width, size.width),
      y: clamp(((event.clientY - box.top) / box.height) * size.height, size.height),
    }
    const line = points[current] || []
    onChange({ ...points, [current]: line.length === 1 ? [line[0], point] : [point] })
  }

  // Keyboard alternative to clicking: type pixel coordinates.
  const typePoint = (index, axis, raw) => {
    const line = [...(points[current] || [])]
    while (line.length <= index) line.push({ x: 0, y: 0 })
    const max = axis === 'x' ? size.width : size.height
    line[index] = { ...line[index], [axis]: Math.min(Math.max(Number(raw) || 0, 0), max) }
    onChange({ ...points, [current]: line })
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-2" role="group" aria-label="Line to mark">
        {Object.entries(lines).map(([key, text]) => (
          <button key={key} type="button" aria-pressed={current === key} onClick={() => setActive(key)}
            className={`btn btn-sm ${current === key ? 'btn-primary' : 'btn-outline-secondary'}`}>
            {text}{points[key]?.length === 2 ? ' ✓' : ''}
          </button>
        ))}
      </div>
      <p className="small text-secondary">Tap one end of the {lines[current].toLowerCase()} line, then the other. A third tap starts again.</p>
      {url && (
        <div className="point-stage border" onClick={addPoint}>
          <img src={url} alt="Garment, for marking measurement points"
            onLoad={(e) => setSize({ width: e.target.naturalWidth, height: e.target.naturalHeight })} />
          {size && (
            <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
              {Object.entries(points).filter(([key]) => lines[key]).map(([key, line]) => {
                const colour = key === 'reference' ? '#c0392b' : '#1d5fa7'
                const radius = Math.max(size.width, size.height) / 120
                return (
                  <g key={key} stroke={colour} strokeWidth={radius / 2} fill={colour}>
                    {line.length === 2 && <line x1={line[0].x} y1={line[0].y} x2={line[1].x} y2={line[1].y} />}
                    {line.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={radius} />)}
                  </g>
                )
              })}
            </svg>
          )}
        </div>
      )}
      <div className="mt-2">
        <button type="button" className="btn btn-sm btn-link px-0" disabled={!points[current]}
          onClick={() => { const next = { ...points }; delete next[current]; onChange(next) }}>
          Clear this line
        </button>
      </div>
      {size && (
        <details className="small">
          <summary>Enter coordinates instead (image is {size.width} × {size.height} px)</summary>
          <div className="row g-2 mt-1">
            {[0, 1].flatMap((index) => ['x', 'y'].map((axis) => (
              <label className="col-6 col-md-3" key={`${index}${axis}`}>
                Point {index + 1} {axis.toUpperCase()}
                <input type="number" className="form-control form-control-sm" value={points[current]?.[index]?.[axis] ?? ''}
                  onChange={(e) => typePoint(index, axis, e.target.value)} />
              </label>
            )))}
          </div>
        </details>
      )}
      {error && <div className="invalid-feedback d-block" role="alert">{error}</div>}
    </div>
  )
}
