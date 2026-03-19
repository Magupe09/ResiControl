import { useEffect, useState } from 'react'
import { getPackages } from '../supabase'
import PackageCard from './PackageCard'

function PackageList({ refreshKey, onDelivered }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [refreshKey]) // re-fetches every time refreshKey changes

  if (loading) return <p className="list-status">Cargando paquetes...</p>
  if (error) return <p className="list-status list-error">{error}</p>
  if (packages.length === 0) return <p className="list-status">No hay paquetes registrados.</p>

  const pending = packages.filter(p => p.status === 'pending')
  const delivered = packages.filter(p => p.status === 'delivered')

  return (
    <div className="package-list">
      <h2>Paquetes Pendientes ({pending.length})</h2>
      {pending.length === 0 && (
        <p className="list-status">✅ Todos los paquetes han sido entregados.</p>
      )}
      {pending.map(pkg => (
        <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
      ))}
      {delivered.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Entregados Hoy ({delivered.length})</h2>
          {delivered.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onDelivered={onDelivered} />
          ))}
        </>
      )}
    </div>
  )
}

export default PackageList
