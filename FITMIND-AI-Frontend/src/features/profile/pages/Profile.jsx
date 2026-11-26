import { useState } from 'react'
import PageIntro from '../../../components/ui/PageIntro'
import FormField from '../../../components/ui/FormField'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { validateNumber } from '../../../utils/validation'

const EMPTY = { name: '', height: '', chest: '', waist: '', hip: '' }
const FIELDS = {
  height: { label: 'Height (cm)', min: 51, max: 250 },
  chest: { label: 'Chest (cm)', min: 40, max: 200 },
  waist: { label: 'Waist (cm)', min: 40, max: 200 },
  hip: { label: 'Hip (cm)', min: 40, max: 220 },
}

export default function Profile() {
  const [stored, setStored] = useLocalStorage('fitmind.profile', EMPTY)
  const [values, setValues] = useState(stored)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const set = (key) => (value) => { setValues((v) => ({ ...v, [key]: value })); setMessage('') }

  const save = (event) => {
    event.preventDefault()
    const found = Object.fromEntries(Object.entries(FIELDS)
      .map(([key, rule]) => [key, validateNumber(values[key], rule)])
      .filter(([, text]) => text))
    setErrors(found)
    if (Object.keys(found).length) return setMessage('')
    setStored(values)
    setMessage('Saved in this browser.')
  }

  const clear = () => { setValues(EMPTY); setStored(EMPTY); setErrors({}); setMessage('Profile cleared.') }

  return (
    <>
      <PageIntro title="Your profile" description="Saved only in this browser. There is no account or server sync yet." />
      <form className="card" onSubmit={save} noValidate>
        <div className="card-body">
          <div className="row g-3">
            <FormField label="Display name" type="text" inputMode="text" value={values.name} onChange={set('name')} maxLength={60} className="col-12" />
            {Object.entries(FIELDS).map(([key, rule]) => (
              <FormField key={key} label={rule.label} value={values[key]} onChange={set(key)} error={errors[key]} />
            ))}
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-outline-secondary" onClick={clear}>Clear</button>
          </div>
          {message && <p className="text-success mt-3 mb-0" role="status">{message}</p>}
        </div>
      </form>
    </>
  )
}
