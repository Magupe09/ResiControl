import { useState, useRef, useMemo } from 'react'
import { insertPackage, uploadPhoto } from '../supabase'
import { compressImage } from '../utils/imageCompressor'

function PackageForm({ guardId, onPackageAdded, apartamentos }) {
  const [selectedTower, setSelectedTower] = useState('')
  const [selectedApartment, setSelectedApartment] = useState('')
  const [residentPhone, setResidentPhone] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

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

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    console.log('Foto seleccionada:', file.name, file.size, file.type)
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    setError(null)
    setPhoto(null) // Reset mientras comprime
    setCompressing(true)
    
    try {
      // Comprimir imagen ANTES de guardar (reduce ~15MB a ~300KB)
      const compressedFile = await compressImage(file, 1024, 0.7)
      setPhoto(compressedFile)
      console.log('Foto comprimida y lista:', compressedFile.size)
    } catch (err) {
      console.error('Error al comprimir:', err)
      // Si falla la compresión, usar la original (el storage debería aceptarla si no es enorme)
      setPhoto(file)
    } finally {
      setCompressing(false)
    }
  }

  function removePhoto() {
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
        {compressing ? (
          <div className="photo-preview" style={{ padding: '1rem', textAlign: 'center' }}>
            ⏳ Comprimiendo imagen...
          </div>
        ) : !photo ? (
          <button 
            type="button" 
            className="btn-photo"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            📷 Agregar foto
          </button>
        ) : (
          <div className="photo-preview">
            <span style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>
              📷 {photo.name}
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
          onAbort={() => console.log('Camera aborted')}
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