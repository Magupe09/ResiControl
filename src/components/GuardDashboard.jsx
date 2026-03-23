function GuardDashboard({ guard, onNavigate, currentView, isAdmin }) {
  return (
    <div className="guard-dashboard">
      <div className="guard-welcome">
        <span className="guard-icon">👮</span>
        <h2>Bienvenido, {guard.nombre}</h2>
      </div>

      <div className="dashboard-actions">
        <button 
          className={`action-btn ${currentView === 'receive' ? 'active' : ''}`}
          onClick={() => onNavigate('receive')}
        >
          <span className="action-icon">📥</span>
          <span className="action-text">Recibir</span>
          <span className="action-subtext">Registrar nuevo paquete</span>
        </button>

        <button 
          className={`action-btn ${currentView === 'deliver' ? 'active' : ''}`}
          onClick={() => onNavigate('deliver')}
        >
          <span className="action-icon">📤</span>
          <span className="action-text">Entregar</span>
          <span className="action-subtext">Marcar como entregado</span>
        </button>

        {isAdmin && (
          <button 
            className={`action-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            <span className="action-icon">⚙️</span>
            <span className="action-text">Admin</span>
            <span className="action-subtext">Panel de administración</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default GuardDashboard
