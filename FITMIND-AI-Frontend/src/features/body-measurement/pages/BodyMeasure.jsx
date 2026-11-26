import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../../../components/ui/PageIntro'
import FormField from '../../../components/ui/FormField'
import { Loading } from '../../../components/ui/States'
import UploadPanel from '../../shared/components/UploadPanel'
import { useFit } from '../../../app/providers/AppProviders'
import { useSubmit } from '../../../hooks/useSubmit'
import { measurementService } from '../../../services/measurement/measurementService'
import { manualMeasurements } from '../../../services/measurement/normalize'
import { validateBasics, validateManual } from '../../../utils/validation'
import { MANUAL_BODY_FIELDS, MEASUREMENT_LABELS } from '../../../constants/measurement'
import { FITS, SIZING_PROFILES } from '../../../constants/options'
import { ROUTES } from '../../../constants/routes'

export default function BodyMeasure() {
  const { bodyForm: form, setBodyForm, bodyPhotos, setBodyPhotos, setResults } = useFit()
  const [submitted, setSubmitted] = useState(false)
  const { loading, error, run, clearError } = useSubmit()
  const navigate = useNavigate()
  const manualMode = form.mode === 'manual'

  const set = (key) => (value) => setBodyForm((f) => ({ ...f, [key]: value }))
  const setManual = (key) => (value) => setBodyForm((f) => ({ ...f, manual: { ...f.manual, [key]: value } }))
  const setPhoto = (key) => (file) => setBodyPhotos((p) => ({ ...p, [key]: file }))

  const errors = {
    ...validateBasics(form),
    ...(manualMode
      ? validateManual(form.manual, MANUAL_BODY_FIELDS, MEASUREMENT_LABELS)
      : bodyPhotos.front ? {} : { front: 'Upload a front-facing full-body photo.' }),
  }
  const shown = submitted ? errors : {}

  const finish = (result) => {
    setResults((r) => ({ ...r, body: result }))
    navigate(`${ROUTES.MEASUREMENT_RESULTS}?mode=body`)
  }

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    clearError()
    if (Object.keys(errors).length) return
    if (manualMode) finish(manualMeasurements(form.manual))
    else run((signal) => measurementService.createBodyMeasurement(form, bodyPhotos, signal), finish)
  }

  return (
    <>
      <PageIntro title="Body measurements" description="Enter your details, then upload a photo or type in measurements you already have." />
      <div className="btn-group mb-4" role="group" aria-label="Measurement method">
        {[['photo', 'Estimate from photo'], ['manual', 'Enter manually']].map(([mode, text]) => (
          <button key={mode} type="button" disabled={loading} aria-pressed={form.mode === mode}
            className={`btn ${form.mode === mode ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { set('mode')(mode); setSubmitted(false); clearError() }}>{text}</button>
        ))}
      </div>

      <form onSubmit={submit} noValidate>
        <fieldset disabled={loading}>
          <section className="card mb-4"><div className="card-body">
            <h2 className="h5 mb-3">Your details</h2>
            <div className="row g-3">
              <FormField label="Height (cm)" required value={form.height} onChange={set('height')} error={shown.height} />
              <FormField label="Weight (kg)" required value={form.weight} onChange={set('weight')} error={shown.weight} />
              <FormField label="Age" value={form.age} onChange={set('age')} error={shown.age} className="col-md-4" />
              <FormField label="Body-sizing profile" options={SIZING_PROFILES} value={form.sizingProfile} onChange={set('sizingProfile')} className="col-md-4" />
              <FormField label="Fit preference" options={FITS} value={form.fit} onChange={set('fit')} className="col-md-4" />
            </div>
            {!manualMode && <p className="form-text mt-3 mb-0">The current estimate uses height and your front photo. Weight, age, sizing profile, fit and the side photo are sent to the server but do not change the measurements yet.</p>}
          </div></section>

          {manualMode ? (
            <section className="card mb-4"><div className="card-body">
              <h2 className="h5">Your measurements (cm)</h2>
              <p className="text-secondary">Fill in the ones you know. At least one is needed.</p>
              <div className="row g-3">
                {Object.keys(MANUAL_BODY_FIELDS).map((key) => (
                  <FormField key={key} label={MEASUREMENT_LABELS[key]} value={form.manual[key]} onChange={setManual(key)} error={shown[key]} />
                ))}
              </div>
              {shown.manual && <div className="invalid-feedback d-block mt-3" role="alert">{shown.manual}</div>}
            </div></section>
          ) : (
            <section className="card mb-4"><div className="card-body">
              <h2 className="h5">Photos</h2>
              <p className="text-secondary">Stand straight with your whole body in the frame, against a plain, well-lit background. Photos are sent to the server only when you press the button below.</p>
              <div className="row g-3">
                <div className="col-md-6"><UploadPanel label="Front-facing full-body photo" required file={bodyPhotos.front} onChange={setPhoto('front')} error={shown.front} disabled={loading} /></div>
                <div className="col-md-6"><UploadPanel label="Side-facing photo" file={bodyPhotos.side} onChange={setPhoto('side')} disabled={loading} /></div>
              </div>
            </div></section>
          )}

          {submitted && Object.keys(errors).length > 0 && <div className="alert alert-warning" role="alert">Please correct the highlighted fields.</div>}
          {error && <div className="alert alert-danger" role="alert">{error} You can also switch to “Enter manually”.</div>}
          <button type="submit" className="btn btn-primary">{manualMode ? 'Save measurements' : 'Get measurements'}</button>
        </fieldset>
        {loading && <Loading text="Uploading and analysing your photo…" />}
      </form>
    </>
  )
}
