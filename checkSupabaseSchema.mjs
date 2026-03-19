import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Variables de entorno no configuradas correctamente.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkPackagesTable() {
  try {
    const { data, error } = await supabase.from('packages').select('*').limit(1)
    if (error) {
      console.error('ERROR al consultar la tabla:', error.message)
      process.exit(1)
    }
    if (!data) {
      console.log('La tabla packages no devolvió datos (pero existe).')
    } else {
      console.log('Estructura de la tabla packages:', Object.keys(data[0] || {}))
      console.log('Fila ejemplo:', data[0])
    }
    process.exit(0)
  } catch (err) {
    console.error('Excepción al consultar Supabase:', err)
    process.exit(1)
  }
}

checkPackagesTable()
