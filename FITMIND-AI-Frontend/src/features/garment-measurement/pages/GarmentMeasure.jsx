import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import FormField from '../../../components/ui/FormField'
import { Loading } from '../../../components/ui/States'
import UploadPanel from '../../shared/components/UploadPanel'
import PointPicker from '../components/PointPicker'
import { useFit } from '../../../app/providers/AppProviders'
import { useSubmit } from '../../../hooks/useSubmit'
import { measurementService } from '../../../services/measurement/measurementService'
import { validateGarment } from '../../../utils/validation'
import { GARMENT_CATEGORIES, MEASUREMENT_LABELS } from '../../../constants/measurement'
import { ROUTES } from '../../../constants/routes'

const categoryOptions = Object.fromEntries(Object.entries(GARMENT_CATEGORIES).map(([key, c]) => [key, c.label]))

export default function GarmentMeasure() {
  const { garmentForm: form, setGarmentForm, garmentPhoto, setGarmentPhoto, setResults } = useFit()
  const [submitted, setSubmitted] = useState(false)
  const { loading, error, run, clearError } = useSubmit()
  const navigate = useNavigate()

  const set = (key) => (value) => setGarmentForm((f) => ({ ...f, [key]: value }))
  const changePhoto = (file) => {
    setGarmentPhoto(file)
    set('points')({}) // Points belong to one specific image.
  }

  const errors = validateGarment(form, garmentPhoto)
  const shown = submitted ? errors : {}
  const dimensions = GARMENT_CATEGORIES[form.category]?.dimensions || []
  const lines = {
    reference: 'Ruler / reference',
    ...Object.fromEntries(dimensions.map((key) => [key, MEASUREMENT_LABELS[key]])),
  }

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    clearError()
    if (Object.keys(errors).length) return
    run(
      (signal) => measurementService.createGarmentMeasurement(form, garmentPhoto, signal),
      (result) => {
        setResults((r) => ({ ...r, garment: result }))
        navigate(`${ROUTES.MEASUREMENT_RESULTS}?mode=garment`)
      }
    )
  }

  return (
    <>
      <PageIntro title="Garment measurements" description="Lay one garment flat, put a ruler or an object of known length beside it, and photograph it from directly above." />
      <form onSubmit={submit} noValidate>
        <fieldset disabled={loading}>
          <section className="card mb-4"><div className="card-body">
            <div className="row g-3">
              <FormField label="Garment category" required options={categoryOptions} value={form.category}
                onChange={(category) => setGarmentForm((f) => ({ ...f, category, points: f.points.reference ? { reference: f.points.reference } : {} }))}
                error={shown.category} hint={form.category === 'tshirt' ? 'T-shirts are measured with the shirt method.' : undefined} />
              <FormField label="Reference length (cm)" required value={form.referenceLength} onChange={set('referenceLength')}
                error={shown.referenceLength} hint="Real length between the two points you will mark, for example 30." />
              <div className="col-12">
                <UploadPanel label="Garment photograph with reference visible" required file={garmentPhoto} onChange={changePhoto} error={shown.photo} disabled={loading} />
              </div>
            </div>
          </div></section>

          <section className="card mb-4"><div className="card-body">
            <h2 className="h5">Mark the photo</h2>
            <p className="text-secondary">The ruler line is required. The other lines are optional and improve the dimensions you get back.</p>
            {garmentPhoto
              ? <PointPicker key={`${garmentPhoto.name}-${garmentPhoto.lastModified}`} file={garmentPhoto} lines={lines} points={form.points} onChange={set('points')} error={shown.reference} />
              : <p className="mb-0">Upload a photo first.{shown.reference && <span className="d-block text-danger small">{shown.reference}</span>}</p>}
          </div></section>

          {submitted && Object.keys(errors).length > 0 && <div className="alert alert-warning" role="alert">Please complete the highlighted items.</div>}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary">Measure garment</button>
        </fieldset>
        {loading && <Loading text="Uploading and measuring the garment…" />}
      </form>
    </>
  )
}
