import { Link } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import { ROUTES } from '../../../constants/routes'

export const WORKFLOWS = [
  { to: ROUTES.BODY_MEASUREMENT, title: 'Body measurements', text: 'From a full-body photo with your height, or entered by hand.', action: 'Measure my body' },
  { to: ROUTES.GARMENT_MEASUREMENT, title: 'Garment measurements', text: 'Flat dimensions of a shirt, T-shirt or trousers, using a ruler in the photo.', action: 'Measure a garment' },
]

export function WorkflowCards() {
  return (
    <div className="row g-4">
      {WORKFLOWS.map((w) => (
        <div className="col-md-6" key={w.to}>
          <div className="card h-100"><div className="card-body d-flex flex-column align-items-start">
            <h2 className="h5">{w.title}</h2>
            <p className="text-secondary">{w.text}</p>
            <Link className="btn btn-outline-primary mt-auto" to={w.to}>{w.action}</Link>
          </div></div>
        </div>
      ))}
    </div>
  )
}

export default function MeasureHome() {
  return (
    <>
      <PageIntro title="What would you like to measure?" description="Body measurements and garment dimensions are collected and shown separately." />
      <WorkflowCards />
    </>
  )
}
