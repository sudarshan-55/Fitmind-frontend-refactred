import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './AppLayout'
import Home from '../features/dashboard/pages/Dashboard'
import MeasureHome from '../features/measurement/pages/MeasureHome'
import BodyMeasure from '../features/body-measurement/pages/BodyMeasure'
import GarmentMeasure from '../features/garment-measurement/pages/GarmentMeasure'
import Results from '../features/measurement-results/pages/Results'
import Shopping from '../features/shopping/pages/Shopping'
import Recommendations from '../features/recommendations/pages/RecommendationsPage'
import Profile from '../features/profile/pages/Profile'
import NotFound from '../features/system/pages/NotFound'
import { ROUTES } from '../constants/routes'

// Paths from the earlier unused router, redirected so old links keep working.
const REDIRECTS = {
  '/dashboard': ROUTES.HOME,
  '/measurement': ROUTES.MEASUREMENT,
  '/measurement/body': ROUTES.BODY_MEASUREMENT,
  '/measurement/garment': ROUTES.GARMENT_MEASUREMENT,
  '/measurement/results': ROUTES.MEASUREMENT_RESULTS,
  '/shopping': ROUTES.SHOPPING,
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MEASUREMENT} element={<MeasureHome />} />
        <Route path={ROUTES.BODY_MEASUREMENT} element={<BodyMeasure />} />
        <Route path={ROUTES.GARMENT_MEASUREMENT} element={<GarmentMeasure />} />
        <Route path={ROUTES.MEASUREMENT_RESULTS} element={<Results />} />
        <Route path={ROUTES.SHOPPING} element={<Shopping />} />
        <Route path={ROUTES.RECOMMENDATIONS} element={<Recommendations />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        {Object.entries(REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
