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

async function checkGuardsAndAuth() {
  try {
    console.log('--- Verificando la tabla "guards" ---')
    const { data: guards, error: guardsError } = await supabase.from('guards').select('*')
    
    if (guardsError) {
      console.error('❌ ERROR al consultar la tabla guards:', guardsError.message)
    } else if (guards && guards.length > 0) {
      console.log(`✅ Se encontraron ${guards.length} guardias en la tabla:`)
      console.table(guards)
    } else {
      console.log('⚠️ La tabla "guards" existe pero está vacía.')
    }

    console.log('\nNota: La lista de usuarios de Auth (Authentication -> Users) no se puede verificar directamente desde el cliente con la ANON_KEY por razones de seguridad. Debes revisarla en el Dashboard de Supabase.')
    
    process.exit(0)
  } catch (err) {
    console.error('Excepción al consultar Supabase:', err)
    process.exit(1)
  }
}

checkGuardsAndAuth()
