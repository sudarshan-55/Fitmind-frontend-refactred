export default function Footer() {
  return (
    <footer className="border-top bg-white py-4">
      <div className="container small text-secondary d-flex flex-wrap justify-content-between gap-2">
        <span>© {new Date().getFullYear()} FITMANTRA</span>
        <span>Prototype. Check measurements before you buy.</span>
      </div>
    </footer>
  )
}
