import { useEffect, useState, useCallback } from 'react'
import { getPackages, subscribeToPackages } from '../supabase'
import PackageCard from './PackageCard'

function PackageList({ refreshKey, onDelivered }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')

  const fetchPackages = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [refreshKey, fetchPackages])

  // Realtime subscription
  useEffect(() => {
    let unsubscribe

    async function setupRealtime() {
      setRealtimeStatus('connecting')
      
      unsubscribe = subscribeToPackages(({ eventType, new: newRecord, old: oldRecord }) => {
        console.log('Realtime event:', eventType, newRecord)
        
        if (eventType === 'INSERT') {
          // New package added - add to list
          setPackages(prev => {
            // Avoid duplicates
            if (prev.some(p => p.id === newRecord.id)) return prev
            return [newRecord, ...prev]
          })
          setRealtimeStatus('connected')
        } else if (eventType === 'UPDATE') {
          // Package updated - update in list
          setPackages(prev => 
            prev.map(p => p.id === newRecord.id ? { ...p, ...newRecord } : p)
          )
          setRealtimeStatus('connected')
        } else if (eventType === 'DELETE') {
          // Package deleted - remove from list
          setPackages(prev => prev.filter(p => p.id !== oldRecord.id))
          setRealtimeStatus('connected')
        }
      })

      // Check connection after 2 seconds
      setTimeout(() => {
        setRealtimeStatus('connected')
      }, 2000)
    }

    setupRealtime()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

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

  // Realtime status indicator
  const realtimeIndicator = {
    connected: '🟢',
    connecting: '🟡',
    disconnected: '🔴'
  }

  if (loading) return <p className="list-status">Cargando paquetes...</p>
  if (error) return <p className="list-status list-error">{error}</p>
  if (packages.length === 0) {
    return (
      <div className="package-list">
        <div className="realtime-indicator" title={`Sincronización: ${realtimeStatus}`}>
          {realtimeIndicator[realtimeStatus]} {realtimeStatus === 'connected' ? 'Tiempo real activo' : 'Conectando...'}
        </div>
        <p className="list-status">No hay paquetes registrados.</p>
      </div>
    )
  }

  return (
    <div className="package-list">
      <div className="list-header">
        <div className="list-filter">
          <input
            type="text"
            placeholder="🔍 Buscar por torre o apartamento..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="realtime-indicator" title={`Sincronización: ${realtimeStatus}`}>
          {realtimeIndicator[realtimeStatus]} {realtimeStatus === 'connected' ? 'Tiempo real activo' : 'Conectando...'}
        </div>
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
