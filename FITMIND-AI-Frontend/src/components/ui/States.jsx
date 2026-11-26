export function Loading({ text }) {
  return (
    <div className="d-flex align-items-center gap-2 my-3" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="text-center border rounded bg-white p-5">
      <h2 className="h5">{title}</h2>
      <div className="text-secondary">{children}</div>
    </div>
  )
}
