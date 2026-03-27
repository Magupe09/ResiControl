/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: PackageCard - TARJETA DE PAQUETE (para entregar)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este componente muestra un paquete y permite marcarlo como entregado.
 * Tiene dos usos:
 * 1. Mostrar el paquete registrado (con foto)
 * 2. Formulario de entrega (para confirmar quién recibe)
 * 
 * Cambios recientes:
 * - Agregamos manejo adaptativo de imágenes para la foto de entrega
 * - Mejoramos los mensajes de error
 */

import { useState, useRef } from 'react'
import { markDelivered, uploadPhoto } from '../supabase'

// ═══════════════════════════════════════════════════════════════════════════
// NUEVAS IMPORTACIONES - Utilidades para manejo de imágenes
// ═══════════════════════════════════════════════════════════════════════════
import { detectDeviceCapabilities, formatBytes } from '../utils/deviceDetection.js'
import { handleImageError } from '../utils/imageErrorHandler.js'
import { adaptiveCompress, compressIfNeeded } from '../utils/adaptiveImageCompressor.js'

function PackageCard({ pkg, onDelivered }) {
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO DEL COMPONENTE
  // ═══════════════════════════════════════════════════════════════════════════
  const [loading, setLoading] = useState(false)
  const [showDeliverForm, setShowDeliverForm] = useState(false)
  const [receiverName, setReceiverName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  // Estado para fotos
  const [deliveryPhoto, setDeliveryPhoto] = useState(null)        // Foto original
  const [compressedDeliveryPhoto, setCompressedDeliveryPhoto] = useState(null) // Foto procesada
  const [processingStatus, setProcessingStatus] = useState(null)  // Estado de procesamiento
  
  const deliveryFileInputRef = useRef(null)
  const isDelivered = pkg.estado === 'entregado'

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * handleDeliveryPhotoChange - PROCESAMIENTO DE FOTO DE ENTREGA
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * Esta función procesa la foto que el guardia toma al entregar el paquete.
   * Aplica las mismas técnicas de compresión adaptativa que en PackageForm.
   */
  async function handleDeliveryPhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    console.log('📷 Foto de entrega seleccionada:', file.name, formatBytes(file.size))
    
    // Validación básica
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    setError(null)
    setProcessingStatus('compressing')
    
    try {
      // Detectar capacidades del dispositivo
      const capabilities = detectDeviceCapabilities()
      console.log('📱 Dispositivo:', capabilities.tier, `(~${capabilities.memoryGB}GB RAM)`)
      
      // Comprimir si es necesario
      let photoToUpload = file
      const needsCompression = file.size > (capabilities.limits.maxFileSizeMB * 1024 * 1024)
      
      if (needsCompression) {
        console.log('🔄 Comprimiendo foto de entrega...')
        
        try {
          photoToUpload = await adaptiveCompress(file)
          console.log('✅ Compresión completada')
        } catch (compressError) {
          const classifiedError = handleImageError(compressError, (msg) => setError(msg))
          
          if (classifiedError.type === 'MEMORY_ERROR') {
            console.warn('⚠️ Compresión falló por memoria, usando original')
            photoToUpload = file
          } else {
            throw compressError
          }
        }
      }
      
      // Guardar referencias
      setDeliveryPhoto(file)
      setCompressedDeliveryPhoto(photoToUpload)
      
      const savedBytes = file.size - photoToUpload.size
      if (savedBytes > 0) {
        console.log(`💾 Ahorro: ${formatBytes(savedBytes)} (${Math.round((savedBytes/file.size)*100)}%)`)
      }
      
      setProcessingStatus(null)
      console.log('📷 Foto de entrega lista:', photoToUpload.name, formatBytes(photoToUpload.size))
      
    } catch (err) {
      console.error('❌ Error al procesar foto:', err)
      handleImageError(err, (msg) => setError(msg))
      setProcessingStatus(null)
      setDeliveryPhoto(null)
      setCompressedDeliveryPhoto(null)
    }
  }

  function removeDeliveryPhoto() {
    setDeliveryPhoto(null)
    setCompressedDeliveryPhoto(null)
    if (deliveryFileInputRef.current) {
      deliveryFileInputRef.current.value = ''
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * handleMarkDelivered - CONFIRMAR ENTREGA DEL PAQUETE
   * ═══════════════════════════════════════════════════════════════════════════
   */
  async function handleMarkDelivered() {
    if (!receiverName.trim()) {
      setError('Por favor ingresa el nombre de quien recibe')
      return
    }
    setLoading(true)
    setError(null)

    try {
      let deliveryPhotoUrl = null
      
      // Subir la foto de entrega (comprimida si hay)
      if (compressedDeliveryPhoto || deliveryPhoto) {
        const photoToUpload = compressedDeliveryPhoto || deliveryPhoto
        console.log('📤 Subiendo foto de entrega:', photoToUpload.name)
        
        const { data: url, error: uploadError } = await uploadPhoto(photoToUpload)
        
        if (uploadError) {
          console.error('Error uploading delivery photo:', uploadError)
          handleImageError(uploadError, (msg) => setError(msg + ' La entrega将继续 sin foto.'))
          // NO fallamos la entrega, solo advertimos
        } else {
          console.log('✅ Foto de entrega subida:', url)
          deliveryPhotoUrl = url
        }
      }

      // Actualizar el paquete como entregado
      const { error } = await markDelivered(pkg.id, receiverName.trim(), deliveryPhotoUrl)
      
      if (error) {
        console.error(error)
        setError('Error al marcar como entregado. Intenta de nuevo.')
        setLoading(false)
        return
      }
      
      // Éxito
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Vista cuando el paquete ya fue entregado
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Vista del formulario de entrega
  // ═══════════════════════════════════════════════════════════════════════════
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
          {/* Campo: Nombre de quien recibe */}
          <input
            type="text"
            placeholder="Nombre de quien recibe"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="receiver-input"
          />
          
          {/* Campo: Foto de entrega */}
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
                  {/* Mostrar si hay compresión */}
                  {compressedDeliveryPhoto && compressedDeliveryPhoto !== deliveryPhoto && (
                    <span style={{ fontSize: '0.85em', color: '#22c55e' }}>
                      {' '}→ {formatBytes(compressedDeliveryPhoto.size)}
                    </span>
                  )}
                </span>
                <button type="button" className="btn-remove-photo" onClick={removeDeliveryPhoto}>✕</button>
              </div>
            )}
            
            {/* Input oculto para cámara */}
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
          
          {/* Mensajes de estado */}
          {processingStatus && (
            <p className="form-info">
              {processingStatus === 'compressing' ? '🔄 Comprimiendo imagen...' : '📤 Subiendo imagen...'}
            </p>
          )}
          
          {error && <p className="form-error">{error}</p>}
          
          {/* Botones de acción */}
          <div className="deliver-actions">
            <button 
              className="btn-cancel"
              onClick={() => {
                setShowDeliverForm(false)
                setReceiverName('')
                removeDeliveryPhoto()
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Vista normal del paquete (pendiente)
  // ═══════════════════════════════════════════════════════════════════════════
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
