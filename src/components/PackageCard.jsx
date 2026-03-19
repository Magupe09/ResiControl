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
