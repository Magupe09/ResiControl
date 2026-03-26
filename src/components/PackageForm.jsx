import { useState, useRef, useMemo } from 'react'
import { insertPackage, uploadPhoto } from '../supabase'

// Ya no necesitamos compresión del lado del cliente
// La Edge Function ahora maneja la subida directamente

function formatBytes(bytes) {
  if (!bytes) return '0 Bytes'
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function PackageForm({ guardId, onPackageAdded, apartamentos }) {
  const [selectedTower, setSelectedTower] = useState('')
  const [selectedApartment, setSelectedApartment] = useState('')
  const [residentPhone, setResidentPhone] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const torres = useMemo(() => {
    if (!apartamentos) return []
    const unique = [...new Set(apartamentos.map(a => a.torre))]
    return unique.sort()
  }, [apartamentos])

  const apartmentsInTower = useMemo(() => {
    if (!apartamentos || !selectedTower) return []
    return apartamentos
      .filter(a => a.torre === selectedTower)
      .sort((a, b) => a.apartamento.localeCompare(b.apartamento, undefined, { numeric: true }))
  }, [apartamentos, selectedTower])

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

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    console.log('Foto seleccionada:', file.name, file.size, file.type)
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    setError(null)
    // Guardar la foto directamente - la Edge Function se encarga de todo
    setPhoto(file)
    console.log('Foto lista para subir:', file.name, formatBytes(file.size))
  }

  function removePhoto() {
    setPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation() // Prevenir recarga
    setError(null)
    if (!selectedTower || !selectedApartment) {
      setError('Por favor selecciona torre y apartamento.')
      return
    }
    setLoading(true)

    const apt = apartmentsInTower.find(a => a.id === selectedApartment)
    const towerLabel = selectedTower
    const apartmentLabel = apt?.apartamento || ''

    let photoUrl = null
    if (photo) {
      console.log('Uploading photo:', photo.name)
      const { data: url, error: uploadError } = await uploadPhoto(photo)
      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError('Error al subir la foto. El paquete se registrará sin foto.')
      } else {
        console.log('Photo uploaded successfully:', url)
        photoUrl = url
      }
    }
      
    

    const { error: supabaseError } = await insertPackage(
      towerLabel,
      apartmentLabel,
      guardId,
      photoUrl,
      residentPhone.trim()
    )
    setLoading(false)
    
    if (supabaseError) {
      setError('Error al registrar el paquete. Intenta de nuevo.')
      console.error(supabaseError)
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    setSelectedTower('')
    setSelectedApartment('')
    setResidentPhone('')
    removePhoto()
    onPackageAdded()
  } 

  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h2>Registrar Paquete</h2>
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
              📷 {photo.name} ({formatBytes(photo.size)})
            </span>
            <button type="button" className="btn-remove-photo" onClick={removePhoto}>✕</button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">✅ Paquete registrado con éxito</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (photo ? 'Subiendo foto y registrando...' : 'Registrando...') : '📦 Registrar Paquete'}
      </button>
    </form>
  )
}

export default PackageForm