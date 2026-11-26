import { Link } from 'react-router-dom'
import { WorkflowCards } from '../../measurement/pages/MeasureHome'
import { ROUTES } from '../../../constants/routes'

export default function Home() {
  return (
    <>
      <section className="hero rounded p-4 p-md-5 mb-4">
        <h1 className="display-6 mb-3">Clothes that fit, chosen with your measurements.</h1>
        <p className="mb-4 intro-text">Record your measurements, check a garment’s dimensions and browse by occasion and budget.</p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-primary" to={ROUTES.MEASUREMENT}>Get measured</Link>
          <Link className="btn btn-outline-primary" to={ROUTES.SHOPPING}>Shop by preference</Link>
        </div>
      </section>
      <WorkflowCards />
    </>
  )
}
