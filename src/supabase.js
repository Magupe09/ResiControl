import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getGuardByEmail(email) {
  const { data, error } = await supabase
    .from('guards')
    .select('*')
    .eq('email', email)
    .single()
  return { data, error }
}

// ═══════════════════════════════════════════════════════════════════════════
// CRUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register a new package.
 * @param {string} tower  - e.g. "Torre 1"
 * @param {string} apartment - e.g. "301"
 * @returns {Promise<{data, error}>}
 */
export async function insertPackage(tower, apartment, guardId, photoUrl = null, residentPhone = null) {
  const { data, error } = await supabase
    .from('packages')
    .insert([{ 
      torre: tower, 
      apartamento: apartment, 
      estado: 'registrado', 
      guard_id: guardId,
      foto_url: photoUrl,
      telefono_residente: residentPhone
    }])
    .select()
  return { data, error }
}

/**
 * Fetch all packages (newest first).
 * @returns {Promise<{data, error}>}
 */
export async function getPackages(filters = {}) {
  let query = supabase.from('packages').select('*, guards(nombre)')

  if (filters.tower) {
    query = query.ilike('torre', `%${filters.tower}%`)
  }
  if (filters.apartment) {
    query = query.ilike('apartamento', `%${filters.apartment}%`)
  }
  if (filters.status && filters.status !== 'all') {
    query = query.eq('estado', filters.status)
  }
  if (filters.guardId) {
    query = query.eq('guard_id', filters.guardId)
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo + 'T23:59:59')
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) return { data: [], error }
  
  let packages = data || []
  
  if (filters.lost && filters.oldDays) {
    const now = new Date()
    packages = packages.filter(p => {
      if (p.estado !== 'registrado') return false
      const created = new Date(p.created_at)
      const daysOld = (now - created) / (1000 * 60 * 60 * 24)
      return daysOld > filters.oldDays
    })
  }
  
  return { data: packages, error: null }
}

export async function getGuards() {
  const { data, error } = await supabase
    .from('guards')
    .select('id, nombre')
    .eq('activo', true)
  return { data, error }
}

/**
 * Mark a package as delivered.
 * @param {string} id - UUID of the package
 * @param {string} receiverName - Name of the person receiving
 * @param {string} deliveryPhotoUrl - Optional URL of delivery photo
 * @returns {Promise<{data, error}>}
 */
export async function markDelivered(id, receiverName, deliveryPhotoUrl = null) {
  const updateData = { 
    estado: 'entregado',
    receptor: receiverName,
    fecha_entrega: new Date().toISOString()
  }
  
  // Add delivery photo if provided
  if (deliveryPhotoUrl) {
    updateData.foto_entrega_url = deliveryPhotoUrl
  }
  
  const { data, error } = await supabase
    .from('packages')
    .update(updateData)
    .eq('id', id)
    .select()
  return { data, error }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUBIDA DE FOTOS CON TIMEOUT Y REINTENTOS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ¿Por qué necesitamos timeout y reintentos?
 * -------------------------------------------
 * En dispositivos móviles, la conexión puede ser inestable:
 * - La señal puede debilitarse mientras subes
 * - Puede haber un corte temporal de datos
 * - El servidor puede estar ocupado y tardar
 * 
 * Con timeout:
 * - Si la subida tarda más de X segundos, cancelamos
 * - Evitamos que la app quede "colgada" infinitamente
 * 
 * Con reintentos:
 * - Si falla por error de red, esperamos un poco y reintentamos
 * - A veces la segunda vez funciona
 */

const UPLOAD_TIMEOUT_MS = 30000  // 30 segundos de timeout
const MAX_RETRIES = 2            // Máximo 2 reintentos

/**
 * Sube una foto a Supabase Storage usando Edge Function
 * 
 * @param {File} file - Archivo a subir
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<{data: string|null, error: Error|null}>}
 * 
 * Características:
 * - Timeout de 30 segundos
 * - Reintentos automáticos en caso de error de red
 * - Mejor manejo de errores
 */
export async function uploadPhoto(file, options = {}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  // Opciones con valores por defecto
  const timeout = options.timeout || UPLOAD_TIMEOUT_MS
  const maxRetries = options.maxRetries !== undefined ? options.maxRetries : MAX_RETRIES
  
  // Helper para hacer fetch con timeout
  const fetchWithTimeout = async (url, options, timeoutMs) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      // Si fue abortado por timeout, crear error específico
      if (error.name === 'AbortError') {
        const timeoutError = new Error('La conexión tardó demasiado tiempo')
        timeoutError.code = 'TIMEOUT'
        throw timeoutError
      }
      throw error
    }
  }

  // Función interna para intentar la subida
  const attemptUpload = async (attemptNumber = 1) => {
    console.log(`📤 Intento de subida ${attemptNumber}/${maxRetries + 1}:`, file.name)
    
    try {
      // Crear FormData con el archivo
      const formData = new FormData()
      formData.append('file', file)
      
      // Llamar a la Edge Function
      const response = await fetchWithTimeout(
        `${supabaseUrl}/functions/v1/compress-image`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        },
        timeout
      )
      
      const result = await response.json()
      
      if (!response.ok || result.error) {
        const errorMsg = result.error || result.message || 'Error al subir la imagen'
        console.error(`❌ Error en intento ${attemptNumber}:`, errorMsg)
        
        // Si hay error de servidor (5xx), reintentar
        if (response.status >= 500 && attemptNumber <= maxRetries) {
          console.log('🔄 Reintentando en 2 segundos...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          return attemptUpload(attemptNumber + 1)
        }
        
        // Si es error de cliente (4xx), no reintentar
        const error = new Error(errorMsg)
        error.status = response.status
        throw error
      }
      
      console.log('✅ Foto subida exitosamente:', result.url)
      return { data: result.url, error: null }
      
    } catch (err) {
      console.error(`❌ Excepción en intento ${attemptNumber}:`, err.message)
      
      // Determinar si reintentar según el tipo de error
      const shouldRetry = 
        err.code === 'TIMEOUT' || 
        err.message.includes('network') ||
        err.message.includes('fetch') ||
        (err.status >= 500) ||
        (err.status === 0) // Error de red típicamente
      
      if (shouldRetry && attemptNumber <= maxRetries) {
        console.log('🔄 Reintentando en 2 segundos...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        return attemptUpload(attemptNumber + 1)
      }
      
      return { data: null, error: err }
    }
  }

  // Ejecutar el primer intento
  return attemptUpload(1)
}

export async function getApartamentos() {
  const { data, error } = await supabase
    .from('apartamentos')
    .select('*')
    .order('torre', { ascending: true })
    .order('apartamento', { ascending: true })
  return { data, error }
}

// ═══════════════════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Subscribe to package changes (INSERT, UPDATE, DELETE)
 * @param {function} callback - Called with { eventType, newRecord, oldRecord }
 * @returns {function} - Call to unsubscribe
 */
export function subscribeToPackages(callback) {
  const channel = supabase
    .channel('packages-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'packages'
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old
        })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
