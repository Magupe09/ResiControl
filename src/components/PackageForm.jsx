import { useState } from 'react'
import { insertPackage } from '../supabase'

function PackageForm({ onPackageAdded }) {
  const [tower, setTower] = useState('')
  const [apartment, setApartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!tower.trim() || !apartment.trim()) {
      setError('Por favor completa torre y apartamento.')
      return
    }
    setLoading(true)
    const { error: supabaseError } = await insertPackage(tower.trim(), apartment.trim())
    setLoading(false)
    if (supabaseError) {
      setError('Error al registrar el paquete. Intenta de nuevo.')
      console.error(supabaseError)
      return
    }
    // Reset form on success
    setTower('')
    setApartment('')
    onPackageAdded() // notify parent to refresh list
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
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Registrando...' : '📦 Registrar Paquete'}
      </button>
    </form>
  )
}

export default PackageForm
