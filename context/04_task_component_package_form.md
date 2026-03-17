# Task 04 — Component: PackageForm

## Context
Create the form that security guards use to register new packages.
This is the most-used component in the app — UX must be fast and simple.
The guard fills in tower + apartment and clicks "Registrar Paquete".

## Prerequisites
- Task 01 completed (Vite project initialized)
- Task 03 completed (`src/supabase.js` exists with `insertPackage`)

## What you must do

### Create `/Users/magupe/Documents/proyects/ResiControl/src/components/PackageForm.jsx`

```jsx
import { useState } from 'react'
import { insertPackage } from '../supabase'

function PackageForm({ onPackageAdded }) {
  const [tower, setTower] = useState('')
  const [apartment, setApartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!tower.trim() || !apartment.trim()) {
      setError('Por favor completa torre y apartamento.')
      return
    }

    setLoading(true)
    const { error: supabaseError } = await insertPackage(tower.trim(), apartment.trim())
    setLoading(false)

    if (supabaseError) {
      setError('Error al registrar el paquete. Intenta de nuevo.')
      console.error(supabaseError)
      return
    }

    // Reset form on success
    setTower('')
    setApartment('')
    onPackageAdded() // notify parent to refresh list
  }

  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h2>Registrar Paquete</h2>

      <div className="form-group">
        <label htmlFor="tower">Torre</label>
        <input
          id="tower"
          type="text"
          placeholder="Ej: Torre 1, Torre A"
          value={tower}
          onChange={(e) => setTower(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label htmlFor="apartment">Apartamento</label>
        <input
          id="apartment"
          type="text"
          placeholder="Ej: 101, 302B"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Registrando...' : '📦 Registrar Paquete'}
      </button>
    </form>
  )
}

export default PackageForm
```

## Props
| Prop | Type | Description |
|------|------|-------------|
| `onPackageAdded` | function | Called after successful insert. Parent uses this to refresh the package list. |

## UX Rules (must follow)
- Inputs must be large (handled in Task 08 CSS)
- Label must be above each input (not placeholder-only)
- Button text changes to "Registrando..." during loading
- Error message appears in red below the inputs
- Form resets after successful submit

## Success Criteria
- [ ] File exists at `src/components/PackageForm.jsx`
- [ ] Uses `useState` for `tower`, `apartment`, `loading`, `error`
- [ ] Calls `insertPackage` from `../supabase`
- [ ] Calls `onPackageAdded()` prop after success
- [ ] Form clears after successful submit
- [ ] Shows error if fields are empty
- [ ] Button is disabled during loading

## Files created in this task
- `src/components/PackageForm.jsx` (new file)
