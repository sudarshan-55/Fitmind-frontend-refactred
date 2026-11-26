import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'

export default function AppLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 py-md-5 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
