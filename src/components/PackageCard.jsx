import { useState, useRef } from 'react'
import { markDelivered, uploadPhoto } from '../supabase'

function PackageCard({ pkg, onDelivered }) {
  const [loading, setLoading] = useState(false)
  const [showDeliverForm, setShowDeliverForm] = useState(false)
  const [receiverName, setReceiverName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [deliveryPhoto, setDeliveryPhoto] = useState(null)
  const deliveryFileInputRef = useRef(null)
  const isDelivered = pkg.estado === 'entregado'

  function handleDeliveryPhotoChange(e) {
    // Simple approach - just store the file directly
    const file = e.target.files?.[0]
    if (!file) return
    
    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto es muy grande. Máximo 5MB.')
      return
    }
    
    setError(null)
    setDeliveryPhoto(file)
    // Skip preview to avoid potential issues
  }

  function removeDeliveryPhoto() {
    setDeliveryPhoto(null)
    if (deliveryFileInputRef.current) {
      deliveryFileInputRef.current.value = ''
    }
  }

  async function handleMarkDelivered() {
    if (!receiverName.trim()) {
      setError('Por favor ingresa el nombre de quien recibe')
      return
    }
    setLoading(true)
    setError(null)

    try {
      let deliveryPhotoUrl = null
      if (deliveryPhoto) {
        console.log('Uploading delivery photo:', deliveryPhoto.name)
        const { data: url, error: uploadError } = await uploadPhoto(deliveryPhoto)
        if (uploadError) {
          console.error('Error uploading delivery photo:', uploadError)
          // Continue without photo - don't fail the delivery
        } else {
          console.log('Delivery photo uploaded:', url)
          deliveryPhotoUrl = url
        }
      }

      const { error } = await markDelivered(pkg.id, receiverName.trim(), deliveryPhotoUrl)
      
      if (error) {
        console.error(error)
        setError('Error al marcar como entregado. Intenta de nuevo.')
        setLoading(false)
        return
      }
      
      // Success!
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onDelivered()
      }, 1500)
      
    } catch (err) {
      console.error('Delivery exception:', err)
      setError('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
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
        {pkg.foto_entrega_url && (
          <div className="card-photo">
            <img src={pkg.foto_entrega_url} alt="Foto de entrega" />
          </div>
        )}
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
          <div className="form-group">
            <label>Foto de entrega (opcional)</label>
            {!deliveryPhoto ? (
              <button 
                type="button" 
                className="btn-photo"
                onClick={() => deliveryFileInputRef.current?.click()}
                disabled={loading}
              >
                📷 Agregar foto de entrega
              </button>
            ) : (
              <div className="photo-preview">
                <span style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>
                  📷 {deliveryPhoto.name}
                </span>
                <button type="button" className="btn-remove-photo" onClick={removeDeliveryPhoto}>✕</button>
              </div>
            )}
            <input
              ref={deliveryFileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleDeliveryPhotoChange}
              onAbort={() => console.log('Camera aborted')}
              style={{ display: 'none' }}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="deliver-actions">
            <button 
              className="btn-cancel"
              onClick={() => {
                setShowDeliverForm(false)
                setReceiverName('')
                setDeliveryPhoto(null)
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
