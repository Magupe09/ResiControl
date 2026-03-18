import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── CRUD FUNCTIONS ───────────────────────────────────────────────────────────

/**
 * Register a new package.
 * @param {string} tower  - e.g. "Torre 1"
 * @param {string} apartment - e.g. "301"
 * @returns {Promise<{data, error}>}
 */
export async function insertPackage(tower, apartment) {
  const { data, error } = await supabase
    .from('packages')
    .insert([{ tower, apartment, status: 'pending' }])
    .select()
  return { data, error }
}

/**
 * Fetch all packages (newest first).
 * @returns {Promise<{data, error}>}
 */
export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

/**
 * Mark a package as delivered.
 * @param {string} id - UUID of the package
 * @returns {Promise<{data, error}>}
 */
export async function markDelivered(id) {
  const { data, error } = await supabase
    .from('packages')
    .update({ status: 'delivered' })
    .eq('id', id)
    .select()
  return { data, error }
}
