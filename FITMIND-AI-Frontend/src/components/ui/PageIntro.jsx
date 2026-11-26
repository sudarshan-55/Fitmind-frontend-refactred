export default function PageIntro({ title, description }) {
  return (
    <div className="mb-4">
      <h1 className="h2 mb-2">{title}</h1>
      {description && <p className="text-secondary mb-0 intro-text">{description}</p>}
    </div>
  )
}
