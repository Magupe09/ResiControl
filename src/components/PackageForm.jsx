/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: PackageForm - FORMULARIO DE REGISTRO DE PAQUETES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este componente permite al guardia registrar un paquete con:
 * - Torre y apartamento
 * - Teléfono del residente
 * - Foto opcional del paquete
 * 
 * Cambios recientes:
 * - Agregamos manejo adaptativo de imágenes para dispositivos antiguos
 * - Mejoramos los mensajes de error
 * - Agregamos feedback visual durante la compresión
 * 
 * Conceptos de React que vas a aprender:
 * - useState: Para manejar el estado del componente (datos que cambian)
 * - useRef: Para acceder directamente a elementos del DOM
 * - useMemo: Para cálculos que solo deben ejecutarse cuando cambian sus dependencias
 */

import { useState, useRef, useMemo } from 'react'
import { insertPackage, uploadPhoto } from '../supabase'

// ═══════════════════════════════════════════════════════════════════════════
// NUEVAS IMPORTACIONES - Utilidades que creamos antes
// ═══════════════════════════════════════════════════════════════════════════
import { detectDeviceCapabilities, formatBytes } from '../utils/deviceDetection.js'
import { handleImageError } from '../utils/imageErrorHandler.js'
import { adaptiveCompress, compressIfNeeded } from '../utils/adaptiveImageCompressor.js'

/**
 * formatBytes - Convierte bytes a formato legible
 * Ejemplo: 1024 → "1 KB", 1048576 → "1 MB"
 */
function formatBytesHelper(bytes) {
  if (!bytes) return '0 Bytes'
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function PackageForm({ guardId, onPackageAdded, apartamentos }) {
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO DEL COMPONENTE
  // ═══════════════════════════════════════════════════════════════════════════
  // useState crea variables que cuando cambian, hacen que React vuelva a renderizar
  
  const [selectedTower, setSelectedTower] = useState('')
  const [selectedApartment, setSelectedApartment] = useState('')
  const [residentPhone, setResidentPhone] = useState('')
  const [photo, setPhoto] = useState(null)           // El archivo de foto original
  const [compressedPhoto, setCompressedPhoto] = useState(null) // La foto procesada
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO DE PROGRESO - Nuevo: para mostrar feedback al usuario
  // ═══════════════════════════════════════════════════════════════════════════
  const [processingStatus, setProcessingStatus] = useState(null) // 'compressing', 'uploading', null
  
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  // ═══════════════════════════════════════════════════════════════════════════
  // useMemo: Cálculos que solo se ejecutan cuando cambian las dependencias
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Obtener las torres únicas de los apartamentos disponibles
  const torres = useMemo(() => {
    if (!apartamentos) return []
    const unique = [...new Set(apartamentos.map(a => a.torre))]
    return unique.sort()
  }, [apartamentos])

  // Filtrar apartamentos por torre seleccionada
  const apartmentsInTower = useMemo(() => {
    if (!apartamentos || !selectedTower) return []
    return apartamentos
      .filter(a => a.torre === selectedTower)
      .sort((a, b) => a.apartamento.localeCompare(b.apartamento, undefined, { numeric: true }))
  }, [apartamentos, selectedTower])

  // ═══════════════════════════════════════════════════════════════════════════
  // MANEJADORES DE EVENTOS
  // ═══════════════════════════════════════════════════════════════════════════

  function handleTowerChange(e) {
    const tower = e.target.value
    setSelectedTower(tower)
    setSelectedApartment('')
    setResidentPhone('')
  }

  function handleApartmentChange(e) {
    const aptId = e.target.value
    setSelectedApartment(aptId)
    const apt = apartmentsInTower.find(a => a.id === aptId)
    if (apt?.telefono) {
      setResidentPhone(apt.telefono)
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * handlePhotoChange - PROCESAMIENTO DE FOTO CON MANEJO ADAPTATIVO
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * ¿Qué hace esta función?
   * 1. Obtiene el archivo de la cámara/galería
   * 2. Valida que sea una imagen
   * 3. Detecta las capacidades del dispositivo
   * 4. Decide si comprimir o no
   * 5. Ejecuta la compresión de forma segura
   * 
   * ¿Por qué tanto código? Porque los dispositivos antiguos son frágiles
   */
  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    console.log('📷 Foto seleccionada:', file.name, formatBytesHelper(file.size))
    
    // ================================================================
    // VALIDACIÓN BÁSICA - Paso 1: Verificar que sea una imagen
    // ================================================================
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    // Limpiar errores anteriores
    setError(null)
    setProcessingStatus('compressing')
    
    try {
      // ================================================================
      // DETECCIÓN DE CAPACIDADES - Paso 2: Conocer el dispositivo
      // ================================================================
      // Esto nos dice qué tan "poderoso" es el dispositivo
      const capabilities = detectDeviceCapabilities()
      console.log('📱 Dispositivo detectado:', capabilities.tier, 
        `(~${capabilities.memoryGB}GB RAM, ${capabilities.cores} núcleos)`)
      
      // ================================================================
      // COMPRESIÓN ADAPTATIVA - Paso 3: Procesar la imagen
      // ================================================================
      // Si la imagen es grande Y el dispositivo es débil, comprimir
      // El compresor ajustará automáticamente los parámetros
      let photoToUpload = file
      
      // Primero, ver si necesitamos comprimir
      // Usamos compressIfNeeded que solo comprime si es necesario
      const needsCompression = file.size > (capabilities.limits.maxFileSizeMB * 1024 * 1024)
      
      if (needsCompression) {
        console.log('🔄 Iniciando compresión adaptativa...')
        
        try {
          // adaptiveCompress detecta el dispositivo y ajusta los parámetros
          photoToUpload = await adaptiveCompress(file)
          console.log('✅ Compresión completada')
        } catch (compressError) {
          // Si la compresión falla, usamos la original
          // Pero primero clasificamos el error para dar feedback
          const classifiedError = handleImageError(compressError, (msg) => setError(msg))
          
          if (classifiedError.type === 'MEMORY_ERROR') {
            // Error de memoria: no arriesgamos, usamos original
            console.warn('⚠️ Compresión falló por memoria, usando original')
            photoToUpload = file
          } else {
            // Otro error: intentar de todas formas con la original
            throw compressError
          }
        }
      } else {
        console.log('✅ Imagen dentro del límite, sin compresión necesaria')
      }
      
      // Guardar referencias a las fotos
      // photo: la original (para mostrar en preview)
      // compressedPhoto: la procesada (para subir)
      setPhoto(file)
      setCompressedPhoto(photoToUpload)
      
      const savedBytes = file.size - photoToUpload.size
      if (savedBytes > 0) {
        console.log(`💾 Ahorro: ${formatBytesHelper(savedBytes)} (${Math.round((savedBytes/file.size)*100)}%)`)
      }
      
      setProcessingStatus(null)
      console.log('📷 Foto lista para subir:', photoToUpload.name, formatBytesHelper(photoToUpload.size))
      
    } catch (err) {
      console.error('❌ Error al procesar foto:', err)
      
      // Manejar el error y mostrar mensaje al usuario
      handleImageError(err, (msg) => setError(msg))
      setProcessingStatus(null)
      
      // En caso de error, no guardamos la foto
      // El usuario puede intentar de nuevo
      setPhoto(null)
      setCompressedPhoto(null)
    }
  }

  function removePhoto() {
    setPhoto(null)
    setCompressedPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * handleSubmit - ENVÍO DEL FORMULARIO
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * ¿Qué hace esta función?
   * 1. Valida que estén llenos torre y apartamento
   * 2. Sube la foto (si hay)
   * 3. Registra el paquete en la base de datos
   * 4. Limpia el formulario si todo sale bien
   */
  async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation() // Prevenir recarga de página
    setError(null)
    
    // Validación de campos requeridos
    if (!selectedTower || !selectedApartment) {
      setError('Por favor selecciona torre y apartamento.')
      return
    }
    
    setLoading(true)
    setProcessingStatus('uploading')

    const apt = apartmentsInTower.find(a => a.id === selectedApartment)
    const towerLabel = selectedTower
    const apartmentLabel = apt?.apartamento || ''

    // ═══════════════════════════════════════════════════════════════════════
    // SUBIDA DE FOTO - Usamos la foto comprimida, no la original
    // ═══════════════════════════════════════════════════════════════════════
    let photoUrl = null
    if (compressedPhoto) {
      console.log('📤 Subiendo foto:', compressedPhoto.name)
      
      // Subir la foto comprimida (si hay) o la original
      const photoToUpload = compressedPhoto || photo
      const { data: url, error: uploadError } = await uploadPhoto(photoToUpload)
      
      if (uploadError) {
        // Manejar error de subida
        console.error('❌ Error al subir foto:', uploadError)
        handleImageError(uploadError, (msg) => setError(msg + ' El paquete se registrará sin foto.'))
        // NO fallamos todo el formulario, solo la foto
      } else {
        console.log('✅ Foto subida exitosamente:', url)
        photoUrl = url
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // REGISTRO DEL PAQUETE EN BASE DE DATOS
    // ═══════════════════════════════════════════════════════════════════════
    const { error: supabaseError } = await insertPackage(
      towerLabel,
      apartmentLabel,
      guardId,
      photoUrl,
      residentPhone.trim()
    )
    
    setLoading(false)
    setProcessingStatus(null)
    
    if (supabaseError) {
      setError('Error al registrar el paquete. Intenta de nuevo.')
      console.error(supabaseError)
      return
    }

    // Éxito: limpiar formulario
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    setSelectedTower('')
    setSelectedApartment('')
    setResidentPhone('')
    removePhoto()
    onPackageAdded()
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * RENDER - Rendering del componente
   * ═══════════════════════════════════════════════════════════════════════════
   */
  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h2>Registrar Paquete</h2>
      
      {/* Campo: Torre */}
      <div className="form-group">
        <label htmlFor="tower">Torre</label>
        <select
          id="tower"
          value={selectedTower}
          onChange={handleTowerChange}
          disabled={loading}
        >
          <option value="">Seleccionar torre...</option>
          {torres.map(torre => (
            <option key={torre} value={torre}>{torre}</option>
          ))}
        </select>
      </div>
      
      {/* Campo: Apartamento */}
      <div className="form-group">
        <label htmlFor="apartment">Apartamento</label>
        <select
          id="apartment"
          value={selectedApartment}
          onChange={handleApartmentChange}
          disabled={loading || !selectedTower}
        >
          <option value="">Seleccionar apartamento...</option>
          {apartmentsInTower.map(apt => (
            <option key={apt.id} value={apt.id}>{apt.apartamento}</option>
          ))}
        </select>
      </div>
      
      {/* Campo: Teléfono del residente */}
      <div className="form-group">
        <label htmlFor="residentPhone">WhatsApp del residente</label>
        <input
          id="residentPhone"
          type="tel"
          placeholder="3001234567"
          value={residentPhone}
          onChange={(e) => setResidentPhone(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      
      {/* Campo: Foto del paquete */}
      <div className="form-group">
        <label>Foto del paquete (opcional)</label>
        
        {!photo ? (
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            <button 
              type="button" 
              className="btn-photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              📷 Tomar foto
            </button>
            <button 
              type="button" 
              className="btn-photo"
              onClick={() => galleryInputRef.current?.click()}
              disabled={loading}
              style={{ background: '#6b7280' }}
            >
              🖼️ Elegir de galería
            </button>
          </div>
        ) : (
          <div className="photo-preview">
            <span style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>
              {/* Mostrar información de la foto */}
              📷 {photo.name}
              {/* Si hay compresión, mostrar el tamaño reducido */}
              {compressedPhoto && compressedPhoto !== photo && (
                <span style={{ fontSize: '0.85em', color: '#22c55e' }}>
                  {' '}→ {formatBytesHelper(compressedPhoto.size)}
                </span>
              )}
            </span>
            <button type="button" className="btn-remove-photo" onClick={removePhoto}>✕</button>
          </div>
        )}
        
        {/* Input oculto para cámara */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        
        {/* Input oculto para galería */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
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
      {success && <p className="form-success">✅ Paquete registrado con éxito</p>}
      
      {/* Botón de envío */}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading 
          ? (processingStatus === 'uploading' ? 'Subiendo foto y registrando...' : 'Registrando...') 
          : '📦 Registrar Paquete'
        }
      </button>
    </form>
  )
}

export default PackageForm
