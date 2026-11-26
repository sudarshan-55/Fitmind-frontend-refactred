import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import { EmptyState, Loading } from '../../../components/ui/States'
import ProductCard from '../components/ProductCard'
import { useFit } from '../../../app/providers/AppProviders'
import { productService } from '../../../services/products/productService'
import { getErrorMessage } from '../../../services/api/client'
import { effectiveValue } from '../../../services/measurement/normalize'
import { CATEGORIES, OCCASIONS } from '../../../constants/options'
import { ROUTES } from '../../../constants/routes'

export default function RecommendationsPage() {
  const { preferences, results, savedIds, setSavedIds } = useFit()
  const [state, setState] = useState({ loading: true, error: '', source: '', products: [] })
  const [query, setQuery] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [attempt, setAttempt] = useState(0)

  // Only body measurements are sent; garment dimensions are never mixed in.
  const getMeasurements = useCallback(() => Object.fromEntries(
    (results.body?.items || []).filter((i) => effectiveValue(i) !== null).map((i) => [i.key, effectiveValue(i)])
  ), [results.body])

  useEffect(() => {
    if (!preferences) return undefined
    const controller = new AbortController()
    setState({ loading: true, error: '', source: '', products: [] })
    productService.getRecommendations(preferences, getMeasurements(), controller.signal)
      .then((data) => { if (!controller.signal.aborted) setState({ loading: false, error: '', ...data }) })
      .catch((err) => { if (!controller.signal.aborted) setState({ loading: false, error: getErrorMessage(err), source: '', products: [] }) })
    return () => controller.abort()
  }, [preferences, getMeasurements, attempt])

  if (!preferences) {
    return (
      <>
        <PageIntro title="Recommendations" />
        <EmptyState title="No preferences yet">
          <p>Choose an occasion, category and budget to see products.</p>
          <Link className="btn btn-primary" to={ROUTES.SHOPPING}>Set preferences</Link>
        </EmptyState>
      </>
    )
  }

  const visible = state.products.filter((p) =>
    p.title.toLowerCase().includes(query.trim().toLowerCase()) && (!savedOnly || savedIds.includes(p.id)))
  const toggle = (id) => setSavedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  return (
    <>
      <PageIntro title="Recommendations" description={`${OCCASIONS[preferences.occasion]} · ${CATEGORIES[preferences.category]}`} />
      <Link to={ROUTES.SHOPPING} className="d-inline-block mb-3">Change preferences</Link>
      {state.source === 'mock' && (
        <div className="alert alert-info">Sample catalogue: these are not real listings or live prices. The links open a marketplace search.</div>
      )}
      {state.loading && <Loading text="Loading products…" />}
      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error} <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
        </div>
      )}
      {!state.loading && !state.error && (
        <>
          <div className="row g-2 align-items-center mb-3">
            <div className="col-sm-6 col-md-4">
              <input type="search" className="form-control" aria-label="Search products" placeholder="Search these products"
                value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="col-auto form-check ms-2">
              <input id="saved-only" type="checkbox" className="form-check-input" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
              <label className="form-check-label" htmlFor="saved-only">Saved only</label>
            </div>
          </div>
          {visible.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
              {visible.map((p) => (
                <div className="col" key={p.id}>
                  <ProductCard product={p} sample={state.source === 'mock'} saved={savedIds.includes(p.id)} onToggleSave={() => toggle(p.id)} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No matching products">
              <p className="mb-0">Try a wider budget, another fit or any marketplace.</p>
            </EmptyState>
          )}
        </>
      )}
    </>
  )
}
