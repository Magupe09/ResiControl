# Task 06 — Component: PackageCard

## Context
Create the card component that displays a single package.
The guard sees tower, apartment, date, and a "✅ Marcar Entregado" button.
The card changes appearance based on status (pending = amber, delivered = green).

## Prerequisites
- Task 01 completed (Vite project initialized)
- Task 03 completed (`src/supabase.js` with `markDelivered`)

## What you must do

### Create `/Users/magupe/Documents/proyects/ResiControl/src/components/PackageCard.jsx`

```jsx
import { useState } from 'react'
import { markDelivered } from '../supabase'

function PackageCard({ pkg, onDelivered }) {
  const [loading, setLoading] = useState(false)

  const isDelivered = pkg.status === 'delivered'

  async function handleMarkDelivered() {
    setLoading(true)
    const { error } = await markDelivered(pkg.id)
    setLoading(false)
    if (error) {
      console.error(error)
      alert('Error al marcar como entregado. Intenta de nuevo.')
      return
    }
    onDelivered() // notify parent to refresh list
  }

  // Format date: "17 mar 2026 - 06:00"
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`package-card ${isDelivered ? 'card-delivered' : 'card-pending'}`}>
      <div className="card-header">
        <span className="card-badge">{isDelivered ? '✅ Entregado' : '📦 Pendiente'}</span>
        <span className="card-date">{formatDate(pkg.created_at)}</span>
      </div>

      <div className="card-body">
        <p className="card-tower">{pkg.tower}</p>
        <p className="card-apartment">Apto {pkg.apartment}</p>
      </div>

      {!isDelivered && (
        <button
          className="btn-deliver"
          onClick={handleMarkDelivered}
          disabled={loading}
        >
          {loading ? 'Marcando...' : '✅ Marcar como Entregado'}
        </button>
      )}
    </div>
  )
}

export default PackageCard
```

## Props
| Prop | Type | Description |
|------|------|-------------|
| `pkg` | object | Full package object from Supabase `{id, tower, apartment, status, created_at}` |
| `onDelivered` | function | Called after successful status update — triggers list refresh in parent |

## Visual Rules (enforced via CSS in Task 08)
- Pending cards: amber/orange left border
- Delivered cards: green left border, slightly dimmed
- "Marcar Entregado" button only shows on pending cards
- Button fills full width of card (easy to tap on mobile)

## Error Handling
- Use `alert()` for errors (simple, no external library needed)
- Always re-enable button after error (via `setLoading(false)`)

## Success Criteria
- [ ] File exists at `src/components/PackageCard.jsx`
- [ ] Uses `markDelivered` from `../supabase`
- [ ] Button only shows when `status === 'pending'`
- [ ] Button disabled + text changes during loading
- [ ] Date formatted in Spanish (`es-CO` locale)
- [ ] `onDelivered()` called after successful update
- [ ] Card has different CSS class for pending vs delivered

## Files created in this task
- `src/components/PackageCard.jsx` (new file)
