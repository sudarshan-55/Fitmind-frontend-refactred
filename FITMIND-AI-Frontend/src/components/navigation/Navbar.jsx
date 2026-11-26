import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

const links = [
  { to: ROUTES.HOME, label: 'Home', end: true },
  { to: ROUTES.MEASUREMENT, label: 'Measurements' },
  { to: ROUTES.MEASUREMENT_RESULTS, label: 'Results' },
  { to: ROUTES.SHOPPING, label: 'Shop' },
  { to: ROUTES.RECOMMENDATIONS, label: 'Recommendations' },
  { to: ROUTES.PROFILE, label: 'Profile' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to={ROUTES.HOME}>FitMind</Link>
        <button type="button" className="navbar-toggler" onClick={() => setOpen(!open)}
          aria-expanded={open} aria-controls="main-nav" aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="main-nav" className={`collapse navbar-collapse ${open ? 'show' : ''}`} aria-label="Main">
          <ul className="navbar-nav ms-auto gap-lg-2">
            {links.map(({ to, label, end }) => (
              <li className="nav-item" key={to}>
                <NavLink className="nav-link" to={to} end={end}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
