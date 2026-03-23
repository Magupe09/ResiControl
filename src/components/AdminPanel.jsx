import { useEffect, useState, useMemo } from 'react'
import { getPackages, getGuards } from '../supabase'

function AdminPanel({ currentGuard, onViewResident }) {
  const [packages, setPackages] = useState([])
  const [guards, setGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    tower: '',
    apartment: '',
    status: 'all',
    guardId: '',
    dateFrom: '',
    dateTo: '',
    lost: false,
    oldDays: 7
  })

  useEffect(() => {
    loadData()
  }, [filters])

  async function loadData() {
    setLoading(true)
    const [packagesRes, guardsRes] = await Promise.all([
      getPackages(filters),
      getGuards()
    ])
    setPackages(packagesRes.data || [])
    setGuards(guardsRes.data || [])
    setLoading(false)
  }

  function exportCSV() {
    const headers = ['ID', 'Torre', 'Apartamento', 'Estado', 'Guardia', 'Receptor', 'Teléfono', 'Fecha Registro', 'Fecha Entrega']
    const rows = packages.map(p => [
      p.id,
      p.torre,
      p.apartamento,
      p.estado,
      p.guards?.nombre || '',
      p.receptor || '',
      p.telefono_residente || '',
      p.created_at,
      p.fecha_entrega || ''
    ])
    
    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `paquetes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = useMemo(() => {
    const total = packages.length
    const registered = packages.filter(p => p.estado === 'registrado').length
    const delivered = packages.filter(p => p.estado === 'entregado').length
    
    const now = new Date()
    const oldPackages = packages.filter(p => {
      if (p.estado !== 'registrado') return false
      const created = new Date(p.created_at)
      const daysOld = (now - created) / (1000 * 60 * 60 * 24)
      return daysOld > filters.oldDays
    }).length
    
    return { total, registered, delivered, oldPackages }
  }, [packages, filters.oldDays])

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>📊 Panel de Administración</h2>
        <button className="btn-export" onClick={exportCSV}>
          📥 Exportar
        </button>
      </div>

      <div className="admin-actions-row">
        <button className="admin-action-card resident-action" onClick={onViewResident}>
          <span className="action-icon">👤</span>
          <span className="action-text">Panel Residente</span>
          <span className="action-desc">Ver historial de paquetes</span>
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.registered}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card stat-delivered">
          <span className="stat-number">{stats.delivered}</span>
          <span className="stat-label">Entregados</span>
        </div>
        <div className="stat-card stat-lost">
          <span className="stat-number">{stats.oldPackages}</span>
          <span className="stat-label">Sin entrega ({filters.oldDays}+ días)</span>
        </div>
      </div>

      <div className="admin-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Torre"
            value={filters.tower}
            onChange={(e) => setFilters(f => ({ ...f, tower: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Apartamento"
            value={filters.apartment}
            onChange={(e) => setFilters(f => ({ ...f, apartment: e.target.value }))}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="all">Todos</option>
            <option value="registrado">Registrado</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>
        <div className="filter-row">
          <select
            value={filters.guardId}
            onChange={(e) => setFilters(f => ({ ...f, guardId: e.target.value }))}
          >
            <option value="">Todos los guardias</option>
            {guards.map(g => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
          />
        </div>
        <div className="filter-row filter-lost">
          <label className="lost-filter">
            <input
              type="checkbox"
              checked={filters.lost}
              onChange={(e) => setFilters(f => ({ ...f, lost: e.target.checked }))}
            />
            <span>⚠️ Sin entregar por más de:</span>
            <input
              type="number"
              min="1"
              value={filters.oldDays}
              onChange={(e) => setFilters(f => ({ ...f, oldDays: parseInt(e.target.value) || 7 }))}
              className="days-input"
            />
            <span>días</span>
          </label>
        </div>
      </div>

      {loading ? (
        <p className="list-status">Cargando...</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Torre</th>
                <th>Apto</th>
                <th>Estado</th>
                <th>Guardia</th>
                <th>Receptor</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr><td colSpan="6" className="no-data">No hay paquetes</td></tr>
              ) : (
                packages.map(pkg => (
                  <tr key={pkg.id}>
                    <td>{pkg.torre}</td>
                    <td>{pkg.apartamento}</td>
                    <td>
                      <span className={`status-badge status-${pkg.estado}`}>
                        {pkg.estado === 'registrado' ? '📦' : '✅'}
                      </span>
                    </td>
                    <td>{pkg.guards?.nombre || '-'}</td>
                    <td>{pkg.receptor || '-'}</td>
                    <td>{formatDate(pkg.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
