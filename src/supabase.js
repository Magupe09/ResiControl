import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// ─── CRUD FUNCTIONS ───────────────────────────────────────────────────────────

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

export async function uploadPhoto(file) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('paquetes-fotos')
    .upload(fileName, file)
  if (error) return { data: null, error }
  
  const { data: urlData } = supabase.storage
    .from('paquetes-fotos')
    .getPublicUrl(fileName)
  
  return { data: urlData.publicUrl, error: null }
}

export async function getApartamentos() {
  const { data, error } = await supabase
    .from('apartamentos')
    .select('*')
    .order('torre', { ascending: true })
    .order('apartamento', { ascending: true })
  return { data, error }
}
