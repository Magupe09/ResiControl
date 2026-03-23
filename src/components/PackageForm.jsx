import { useState, useRef } from 'react'
import { insertPackage, uploadPhoto } from '../supabase'

function PackageForm({ guardId, onPackageAdded }) {
  const [tower, setTower] = useState('')
  const [apartment, setApartment] = useState('')
  const [residentPhone, setResidentPhone] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notificationSent, setNotificationSent] = useState(false)
  const fileInputRef = useRef(null)

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
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
    setError(null)
    if (!tower.trim() || !apartment.trim()) {
      setError('Por favor completa torre y apartamento.')
      return
    }
    setLoading(true)

    let photoUrl = null
    if (photo) {
      const { data: url, error: uploadError } = await uploadPhoto(photo)
      if (uploadError) {
        setError('Error al subir la foto. El paquete se registrará sin foto.')
        console.error(uploadError)
      } else {
        photoUrl = url
      }
    }

    const { error: supabaseError } = await insertPackage(tower.trim(), apartment.trim(), guardId, photoUrl, residentPhone.trim())
    setLoading(false)
    
    if (supabaseError) {
      setError('Error al registrar el paquete. Intenta de nuevo.')
      console.error(supabaseError)
      return
    }

    setNotificationSent(true)
    setTimeout(() => setNotificationSent(false), 3000)
    setTower('')
    setApartment('')
    setResidentPhone('')
    removePhoto()
    onPackageAdded()
  }

  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h2>Registrar Paquete</h2>
      <div className="form-group">
        <label htmlFor="tower">Torre</label>
        <input
          id="tower"
          type="text"
          placeholder="Ej: Torre 1, Torre A"
          value={tower}
          onChange={(e) => setTower(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="apartment">Apartamento</label>
        <input
          id="apartment"
          type="text"
          placeholder="Ej: 101, 302B"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="residentPhone">WhatsApp del residente (opcional)</label>
        <input
          id="residentPhone"
          type="tel"
          placeholder="Ej: 3001234567"
          value={residentPhone}
          onChange={(e) => setResidentPhone(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      
      <div className="form-group">
        <label>Foto del paquete (opcional)</label>
        {!photoPreview ? (
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
            <img src={photoPreview} alt="Preview" />
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
      </div>

      {error && <p className="form-error">{error}</p>}
      {notificationSent && <p className="form-success">✅ Notificación enviada al residente</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Registrando...' : '📦 Registrar Paquete'}
      </button>
    </form>
  )
}

export default PackageForm
