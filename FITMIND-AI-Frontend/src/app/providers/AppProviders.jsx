import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const FitContext = createContext(null)

const BODY_FORM = {
  mode: 'photo', height: '', weight: '', age: '', sizingProfile: '', fit: '',
  manual: { shoulder_width: '', chest_circumference: '', waist_circumference: '', hip_circumference: '', inseam: '' },
}
const GARMENT_FORM = { category: '', referenceLength: '', points: {} }

export function AppProviders({ children }) {
  // Forms, photos and results live in memory only: they survive navigation, not a page reload.
  const [bodyForm, setBodyForm] = useState(BODY_FORM)
  const [bodyPhotos, setBodyPhotos] = useState({ front: null, side: null })
  const [garmentForm, setGarmentForm] = useState(GARMENT_FORM)
  const [garmentPhoto, setGarmentPhoto] = useState(null)
  const [results, setResults] = useState({ body: null, garment: null })
  const [preferences, setPreferences] = useLocalStorage('fitmind.preferences', null)
  const [savedIds, setSavedIds] = useLocalStorage('fitmind.saved', [])

  const value = {
    bodyForm, setBodyForm, bodyPhotos, setBodyPhotos,
    garmentForm, setGarmentForm, garmentPhoto, setGarmentPhoto,
    results, setResults, preferences, setPreferences, savedIds, setSavedIds,
  }
  return <FitContext.Provider value={value}>{children}</FitContext.Provider>
}

export const useFit = () => useContext(FitContext)
