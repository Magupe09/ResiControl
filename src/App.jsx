import { useState, useEffect } from 'react'
import Login from './components/Login'
import PackageForm from './components/PackageForm'
import PackageList from './components/PackageList'
import AdminPanel from './components/AdminPanel'
import ResidentPanel from './components/ResidentPanel'
import { signOut, getApartamentos } from './supabase'
import { config } from './config'
import './App.css'

function App() {
  const [currentGuard, setCurrentGuard] = useState(null)
  const [view, setView] = useState('dashboard')
  const [mainAction, setMainAction] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [apartamentos, setApartamentos] = useState([])

  useEffect(() => {
    async function loadApartamentos() {
      const { data } = await getApartamentos()
      if (data) setApartamentos(data)
    }
    loadApartamentos()
  }, [])

  const isAdmin = currentGuard && (
    currentGuard.nombre.toLowerCase().includes('admin') || 
    currentGuard.email.toLowerCase().includes('admin')
  )

  function handleRefresh() {
    setRefreshKey(prev => prev + 1)
  }

  function handleLogin(guard) {
    setCurrentGuard(guard)
    setView('dashboard')
    setMainAction(null)
  }

  function handleNavigate(newView) {
    setView(newView)
    if (newView === 'dashboard') {
      setMainAction(null)
    }
  }

  async function handleLogout() {
    await signOut()
    setCurrentGuard(null)
    setView('dashboard')
    setMainAction(null)
  }

  function handleAction(action) {
    setMainAction(action)
    setView(action === 'receive' ? 'receive' : action === 'deliver' ? 'deliver' : action === 'resident' ? 'resident' : 'dashboard')
  }

  function handleBack() {
    setMainAction(null)
    setView('dashboard')
  }

  return (
    <div className="app-container">
      {!currentGuard && (
        <Login onLogin={handleLogin} currentGuard={currentGuard} />
      )}
      
      {currentGuard && (
        <header className="app-header">
          <div className="header-top">
            <h1>📦 ResiControl</h1>
            <p className="conjunto-name">{config.nombreConjunto}</p>
          </div>
          
          <div className="header-center">
            {view === 'dashboard' && (
              <div className="actions-container">
                <button 
                  className={`action-main-btn ${mainAction === 'receive' ? 'active' : ''}`}
                  onClick={() => handleAction('receive')}
                >
                  <span className="action-icon">📥</span>
                  <span className="action-title">Recibir</span>
                  <span className="action-subtitle">Registrar paquete</span>
                </button>

                <button 
                  className={`action-main-btn ${mainAction === 'deliver' ? 'active' : ''}`}
                  onClick={() => handleAction('deliver')}
                >
                  <span className="action-icon">📤</span>
                  <span className="action-title">Entregar</span>
                  <span className="action-subtitle">Marcar entrega</span>
                </button>

                {isAdmin && (
                  <button 
                    className="action-main-btn admin-btn"
                    onClick={() => handleNavigate('admin')}
                  >
                    <span className="action-icon">⚙️</span>
                    <span className="action-title">Admin</span>
                    <span className="action-subtitle">Panel de administración</span>
                  </button>
                )}
              </div>
            )}

            {view === 'receive' && (
              <div className="center-view">
                <button className="btn-back-action" onClick={handleBack}>
                  ← Volver
                </button>
                <PackageForm 
                  guardId={currentGuard.id} 
                  onPackageAdded={() => { 
                    setTimeout(() => {
                      handleRefresh(); 
                      handleBack(); 
                    }, 2000) 
                  }}
                  apartamentos={apartamentos}
                />
              </div>
            )}

            {view === 'deliver' && (
              <div className="center-view">
                <button className="btn-back-action" onClick={handleBack}>
                  ← Volver
                </button>
                <PackageList 
                  refreshKey={refreshKey} 
                  onDelivered={() => { handleRefresh(); handleBack(); }} 
                />
              </div>
            )}

            {view === 'admin' && (
              <div className="center-view">
                <button className="btn-back-action" onClick={handleBack}>
                  ← Volver
                </button>
                <AdminPanel currentGuard={currentGuard} onViewResident={() => handleNavigate('resident')} />
              </div>
            )}

            {view === 'resident' && (
              <div className="center-view">
                <button className="btn-back-action" onClick={() => setView('admin')}>
                  ← Volver
                </button>
                <ResidentPanel />
              </div>
            )}
          </div>
          
          <div className="header-footer">
            <span className="header-user">
              <span className="user-name">👮 {currentGuard.nombre}</span>
              <span className="header-divider">|</span>
              <button className="btn-logout" onClick={handleLogout}>
                <span>⏻</span>
                <span>Salir</span>
              </button>
            </span>
          </div>
        </header>
      )}
    </div>
  )
}

export default App
