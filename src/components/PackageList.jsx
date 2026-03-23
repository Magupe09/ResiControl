import { useEffect, useState } from 'react'
import { getPackages } from '../supabase'
import PackageCard from './PackageCard'

function PackageList({ refreshKey, onDelivered }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await getPackages()
      if (fetchError) {
        setError('No se pudo cargar la lista de paquetes.')
        console.error(fetchError)
      } else {
        setPackages(data || [])
      }
      setLoading(false)
    }
    fetchPackages()
  }, [refreshKey])

  const pending = packages.filter(p => p.estado === 'registrado')
  const delivered = packages.filter(p => p.estado === 'entregado')

  const filteredPending = filter 
    ? pending.filter(p => 
        p.apartamento.toLowerCase().includes(filter.toLowerCase()) ||
        p.torre.toLowerCase().includes(filter.toLowerCase())
      )
    : pending

  const filteredDelivered = filter
    ? delivered.filter(p => 
        p.apartamento.toLowerCase().includes(filter.toLowerCase()) ||
        p.torre.toLowerCase().includes(filter.toLowerCase())
      )
    : delivered

  if (loading) return <p className="list-status">Cargando paquetes...</p>
  if (error) return <p className="list-status list-error">{error}</p>
  if (packages.length === 0) return <p className="list-status">No hay paquetes registrados.</p>

  return (
    <div className="package-list">
      <div className="list-filter">
        <input
          type="text"
          placeholder="🔍 Buscar por torre o apartamento..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <h2>Paquetes Pendientes ({filteredPending.length})</h2>
      {filteredPending.length === 0 && (
        <p className="list-status">
          {filter ? '🔍 No hay coincidencias' : '✅ Todos los paquetes han sido entregados.'}
        </p>
      )}
      {filteredPending.map(pkg => (
        <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
      ))}
      
      {filteredDelivered.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Entregados ({filteredDelivered.length})</h2>
          {filteredDelivered.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
          ))}
        </>
      )}
    </div>
  )
}

export default PackageList
