# Task 05 — Component: PackageList

## Context
Create the component that fetches and displays all packages from Supabase.
It fetches data on mount and re-fetches whenever the parent tells it to (via a `refreshKey` prop).
It renders a `PackageCard` for each package.

## Prerequisites
- Task 01 completed (Vite project initialized)
- Task 03 completed (`src/supabase.js` with `getPackages`)
- Task 06 completed (`PackageCard.jsx` exists) ← or create a stub first

> ⚠️ If `PackageCard` doesn't exist yet, create a temporary stub:
> ```jsx
> function PackageCard({ pkg }) { return <div>{pkg.apartment}</div> }
> export default PackageCard
> ```
> Replace with final version once Task 06 is done.

## What you must do

### Create `/Users/magupe/Documents/proyects/ResiControl/src/components/PackageList.jsx`

```jsx
import { useEffect, useState } from 'react'
import { getPackages } from '../supabase'
import PackageCard from './PackageCard'

function PackageList({ refreshKey, onDelivered }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await getPackages()
      if (fetchError) {
        setError('No se pudo cargar la lista de paquetes.')
        console.error(fetchError)
      } else {
        setPackages(data || [])
      }
      setLoading(false)
    }

    fetchPackages()
  }, [refreshKey]) // re-fetches every time refreshKey changes

  if (loading) return <p className="list-status">Cargando paquetes...</p>
  if (error) return <p className="list-status list-error">{error}</p>
  if (packages.length === 0) return <p className="list-status">No hay paquetes registrados.</p>

  const pending = packages.filter(p => p.status === 'pending')
  const delivered = packages.filter(p => p.status === 'delivered')

  return (
    <div className="package-list">
      <h2>Paquetes Pendientes ({pending.length})</h2>
      {pending.length === 0 && (
        <p className="list-status">✅ Todos los paquetes han sido entregados.</p>
      )}
      {pending.map(pkg => (
        <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
      ))}

      {delivered.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Entregados Hoy ({delivered.length})</h2>
          {delivered.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
          ))}
        </>
      )}
    </div>
  )
}

export default PackageList
```

## Props
| Prop | Type | Description |
|------|------|-------------|
| `refreshKey` | number | Changing this value triggers a re-fetch (parent increments it) |
| `onDelivered` | function | Passed down to `PackageCard` — called after marking delivered |

## Logic Notes
- `useEffect` runs whenever `refreshKey` changes
- Packages are split into `pending` and `delivered` for display
- Always show pending first, delivered below (as a historical log)
- States: `loading`, `error`, `empty`, `has data`

## Success Criteria
- [ ] File exists at `src/components/PackageList.jsx`
- [ ] Uses `useEffect` with `[refreshKey]` dependency
- [ ] Calls `getPackages()` from `../supabase`
- [ ] Splits packages into pending and delivered sections
- [ ] Renders `PackageCard` for each package
- [ ] Shows loading, error, and empty states

## Files created in this task
- `src/components/PackageList.jsx` (new file)
