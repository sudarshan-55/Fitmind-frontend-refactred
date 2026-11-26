import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import FormField from '../../../components/ui/FormField'
import { useFit } from '../../../app/providers/AppProviders'
import { validatePreferences } from '../../../utils/validation'
import { CATEGORIES, FITS, MARKETPLACES, OCCASIONS } from '../../../constants/options'
import { ROUTES } from '../../../constants/routes'

const EMPTY = { occasion: '', category: '', minBudget: '', maxBudget: '', fit: '', marketplace: '' }

export default function Shopping() {
  const { preferences, setPreferences, bodyForm } = useFit()
  const [values, setValues] = useState(() => ({ ...EMPTY, fit: bodyForm.fit, ...preferences }))
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const errors = validatePreferences(values)
  const shown = submitted ? errors : {}
  const set = (key) => (value) => setValues((v) => ({ ...v, [key]: value }))

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    setPreferences(values)
    navigate(ROUTES.RECOMMENDATIONS)
  }

  return (
    <>
      <PageIntro title="Shopping preferences" description="Tell us what you are looking for. Leave a budget field empty for no limit." />
      <form className="card" onSubmit={submit} noValidate>
        <div className="card-body">
          <div className="row g-3">
            <FormField label="Occasion" required options={OCCASIONS} value={values.occasion} onChange={set('occasion')} error={shown.occasion} />
            <FormField label="Clothing category" required options={CATEGORIES} value={values.category} onChange={set('category')} error={shown.category} />
            <FormField label="Minimum budget (₹)" value={values.minBudget} onChange={set('minBudget')} error={shown.minBudget} />
            <FormField label="Maximum budget (₹)" value={values.maxBudget} onChange={set('maxBudget')} error={shown.maxBudget} />
            <FormField label="Preferred fit" options={FITS} placeholder="Any fit" value={values.fit} onChange={set('fit')} />
            <FormField label="Marketplace" options={MARKETPLACES} placeholder="Any marketplace" value={values.marketplace} onChange={set('marketplace')} />
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary">Show recommendations</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => { setValues(EMPTY); setSubmitted(false) }}>Reset</button>
          </div>
        </div>
      </form>
    </>
  )
}
