import { useState } from 'react'
import { supabase } from '../supabase'

function ResidentPanel() {
  const [searchPhone, setSearchPhone] = useState('')
  const [searchApartment, setSearchApartment] = useState('')
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

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

  async function searchPackages() {
    if (!searchPhone.trim() && !searchApartment.trim()) {
      setError('Ingresa WhatsApp o apartamento para buscar')
      return
    }
    setLoading(true)
    setError(null)
    setHasSearched(true)

    let query = supabase.from('packages').select('*').order('created_at', { ascending: false })
    
    if (searchPhone.trim()) {
      query = query.eq('telefono_residente', searchPhone.trim())
    } else if (searchApartment.trim()) {
      query = query.ilike('apartamento', `%${searchApartment.trim()}%`)
    }

    const { data, error: fetchError } = await query
    
    setLoading(false)
    if (fetchError) {
      setError('Error al buscar paquetes')
      console.error(fetchError)
    } else {
      setPackages(data || [])
    }
  }

  return (
    <div className="resident-panel">
      <div className="resident-header">
        <h2>🏠 Mi Historial de Paquetes</h2>
        <p>Ingresa tu WhatsApp o apartamento para ver tus paquetes</p>
      </div>

      <div className="resident-search">
        <input
          type="tel"
          placeholder="Tu número WhatsApp"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <span className="search-or">ó</span>
        <input
          type="text"
          placeholder="Tu apartamento"
          value={searchApartment}
          onChange={(e) => setSearchApartment(e.target.value)}
        />
        <button onClick={searchPackages} disabled={loading} className="btn-search">
          {loading ? 'Buscando...' : '🔍 Buscar'}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {hasSearched && !loading && (
        <div className="resident-results">
          {packages.length === 0 ? (
            <p className="no-packages">No se encontraron paquetes</p>
          ) : (
            <>
              <p className="results-count">Encontrados: {packages.length} paquete(s)</p>
              {packages.map(pkg => (
                <div key={pkg.id} className={`resident-card ${pkg.estado === 'entregado' ? 'delivered' : ''}`}>
                  <div className="resident-card-header">
                    <span className="status">{pkg.estado === 'entregado' ? '✅ Entregado' : '📦 Pendiente'}</span>
                    <span className="date">{formatDate(pkg.created_at)}</span>
                  </div>
                  <div className="resident-card-body">
                    <p className="address">{pkg.torre} - Apto {pkg.apartamento}</p>
                    {pkg.foto_url && (
                      <img src={pkg.foto_url} alt="Foto del paquete" className="resident-photo" />
                    )}
                    {pkg.estado === 'entregado' && pkg.receptor && (
                      <p className="receiver">Recibido por: {pkg.receptor}</p>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ResidentPanel
