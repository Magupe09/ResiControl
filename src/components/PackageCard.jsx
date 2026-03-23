import { useState } from 'react'
import { markDelivered } from '../supabase'

function PackageCard({ pkg, onDelivered }) {
  const [loading, setLoading] = useState(false)
  const [showDeliverForm, setShowDeliverForm] = useState(false)
  const [receiverName, setReceiverName] = useState('')
  const [success, setSuccess] = useState(false)
  const isDelivered = pkg.estado === 'entregado'

  async function handleMarkDelivered() {
    if (!receiverName.trim()) {
      alert('Por favor ingresa el nombre de quien recibe')
      return
    }
    setLoading(true)
    const { error } = await markDelivered(pkg.id, receiverName.trim())
    setLoading(false)
    if (error) {
      console.error(error)
      alert('Error al marcar como entregado. Intenta de nuevo.')
      return
    }
    // Feedback de éxito antes de volver
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onDelivered()
    }, 1500)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isDelivered) {
    return (
      <div className="package-card card-delivered">
        <div className="card-header">
          <span className="card-badge">✅ Entregado</span>
          <span className="card-date">{formatDate(pkg.fecha_entrega)}</span>
        </div>
        <div className="card-body">
          <p className="card-tower">{pkg.torre}</p>
          <p className="card-apartment">Apto {pkg.apartamento}</p>
        </div>
        {pkg.receptor && (
          <p className="card-receiver">Recibido por: {pkg.receptor}</p>
        )}
      </div>
    )
  }

  if (showDeliverForm) {
    return (
      <div className="package-card card-pending">
        <div className="card-header">
          <span className="card-badge">📦 Pendiente</span>
          <span className="card-date">{formatDate(pkg.created_at)}</span>
        </div>
        <div className="card-body">
          <p className="card-tower">{pkg.torre}</p>
          <p className="card-apartment">Apto {pkg.apartamento}</p>
        </div>
        <div className="deliver-form">
          <input
            type="text"
            placeholder="Nombre de quien recibe"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="receiver-input"
          />
          <div className="deliver-actions">
            <button 
              className="btn-cancel"
              onClick={() => {
                setShowDeliverForm(false)
                setReceiverName('')
              }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              className="btn-confirm-deliver"
              onClick={handleMarkDelivered}
              disabled={loading}
            >
              {loading ? 'Entregando...' : '✅ Confirmar Entrega'}
            </button>
          </div>
          {success && <p className="form-success">✅ Entrega confirmada</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="package-card card-pending">
      {pkg.foto_url && (
        <div className="card-photo">
          <img src={pkg.foto_url} alt="Foto del paquete" />
        </div>
      )}
      <div className="card-header">
        <span className="card-badge">📦 Pendiente</span>
        <span className="card-date">{formatDate(pkg.created_at)}</span>
      </div>
      <div className="card-body">
        <p className="card-tower">{pkg.torre}</p>
        <p className="card-apartment">Apto {pkg.apartamento}</p>
      </div>
      <button
        className="btn-deliver"
        onClick={() => setShowDeliverForm(true)}
      >
        📤 Marcar como Entregado
      </button>
    </div>
  )
}

export default PackageCard
