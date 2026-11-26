import { Link, useSearchParams } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import { EmptyState } from '../../../components/ui/States'
import MeasurementResults from '../components/MeasurementResults'
import { useFit } from '../../../app/providers/AppProviders'
import { ROUTES } from '../../../constants/routes'

export default function Results() {
  const [params, setParams] = useSearchParams()
  const { results, setResults } = useFit()
  const type = params.get('mode') === 'garment' ? 'garment' : 'body'
  const result = results[type]

  const correct = (key, correction) => setResults((all) => ({
    ...all,
    [type]: { ...all[type], items: all[type].items.map((i) => (i.key === key ? { ...i, correction } : i)) },
  }))

  return (
    <>
      <PageIntro title="Measurement results" description="Check each value and correct anything that is wrong. Results are cleared when you reload the page." />
      <ul className="nav nav-tabs mb-3">
        {[['body', 'Body'], ['garment', 'Garment']].map(([key, text]) => (
          <li className="nav-item" key={key}>
            <button type="button" className={`nav-link ${type === key ? 'active' : ''}`} aria-current={type === key ? 'page' : undefined}
              onClick={() => setParams({ mode: key }, { replace: true })}>{text}</button>
          </li>
        ))}
      </ul>
      {result ? (
        <>
          <MeasurementResults key={type} result={result} onCorrect={correct} />
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-outline-secondary" to={type === 'body' ? ROUTES.BODY_MEASUREMENT : ROUTES.GARMENT_MEASUREMENT}>Measure again</Link>
            <Link className="btn btn-primary" to={ROUTES.SHOPPING}>Set shopping preferences</Link>
          </div>
        </>
      ) : (
        <EmptyState title={`No ${type} results yet`}>
          <p>Complete the {type} measurement form to see values here.</p>
          <Link className="btn btn-primary" to={type === 'body' ? ROUTES.BODY_MEASUREMENT : ROUTES.GARMENT_MEASUREMENT}>Start measuring</Link>
        </EmptyState>
      )}
    </>
  )
}
