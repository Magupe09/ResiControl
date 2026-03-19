import { useState } from 'react'
import PackageForm from './components/PackageForm'
import PackageList from './components/PackageList'
import './App.css'

function App() {
  // Incrementa refreshKey para refrescar PackageList tras registrar o entregar
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
