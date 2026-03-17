# Task 07 — App Assembly (App.jsx)

## Context
Wire all components together in `App.jsx`.
This is the main layout file — it renders the header, the package form, and the package list.
It manages the `refreshKey` state that triggers list re-fetches.

## Prerequisites
- Task 04 completed (`PackageForm.jsx` exists)
- Task 05 completed (`PackageList.jsx` exists)
- Task 06 completed (`PackageCard.jsx` exists)

## What you must do

### Replace `/Users/magupe/Documents/proyects/ResiControl/src/App.jsx` with:

```jsx
import { useState } from 'react'
import PackageForm from './components/PackageForm'
import PackageList from './components/PackageList'
import './App.css'

function App() {
  // Incrementing this triggers PackageList to re-fetch
  const [refreshKey, setRefreshKey] = useState(0)

  function handleRefresh() {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📦 ResiControl</h1>
        <p>Gestión de correspondencia</p>
      </header>

      <main className="app-main">
        <PackageForm onPackageAdded={handleRefresh} />
        <PackageList refreshKey={refreshKey} onDelivered={handleRefresh} />
      </main>
    </div>
  )
}

export default App
```

## How the refresh pattern works
```
User submits form
  → PackageForm calls onPackageAdded()
    → App increments refreshKey
      → PackageList sees new refreshKey
        → PackageList re-fetches from Supabase
          → Updated list renders
```

## Rules
- Keep `App.jsx` minimal — no business logic here
- Only manage `refreshKey` state at this level
- Do NOT import Supabase directly in App.jsx
- Header must be simple: app name + tagline only

## Success Criteria
- [ ] `App.jsx` imports `PackageForm` and `PackageList`
- [ ] `refreshKey` state is managed in App
- [ ] `handleRefresh` is passed as `onPackageAdded` to PackageForm
- [ ] `handleRefresh` is passed as `onDelivered` to PackageList
- [ ] `refreshKey` is passed to PackageList
- [ ] App runs without console errors

## Files modified in this task
- `src/App.jsx` (replace placeholder from Task 01)
