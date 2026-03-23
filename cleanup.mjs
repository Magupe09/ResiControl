import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const PHOTO_RETENTION_DAYS = 30 // 1 mes
const DATA_RETENTION_DAYS = 90 // 3 meses

async function cleanupOldData() {
  console.log('🧹 Iniciando limpieza de datos...\n')
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - DATA_RETENTION_DAYS)
  const cutoffStr = cutoffDate.toISOString()

  console.log(`📅 Cutoff para datos: ${cutoffDate.toLocaleDateString('es-CO')} (${DATA_RETENTION_DAYS} días)`)

  // 1. Obtener paquetes viejos para eliminar sus fotos
  console.log('\n1️⃣ Buscando paquetes viejos...')
  const { data: oldPackages, error: fetchError } = await supabase
    .from('packages')
    .select('id, foto_url, created_at')
    .lt('created_at', cutoffStr)
    .not('foto_url', 'is', null)

  if (fetchError) {
    console.error('❌ Error al buscar paquetes:', fetchError.message)
    return
  }

  console.log(`   Encontrados ${oldPackages?.length || 0} paquetes con fotos antiguas`)

  // 2. Eliminar fotos del storage
  if (oldPackages && oldPackages.length > 0) {
    console.log('\n2️⃣ Eliminando fotos del Storage...')
    
    for (const pkg of oldPackages) {
      if (pkg.foto_url) {
        try {
          const fileName = pkg.foto_url.split('/').pop()
          const { error: deleteError } = await supabase.storage
            .from('paquetes-fotos')
            .remove([fileName])
          
          if (deleteError) {
            console.log(`   ⚠️ Error al eliminar foto: ${deleteError.message}`)
          } else {
            console.log(`   ✅ Foto eliminada: ${fileName}`)
          }
        } catch (err) {
          console.log(`   ⚠️ Error: ${err.message}`)
        }
      }
    }
  }

  // 3. Eliminar paquetes viejos (hard delete)
  console.log('\n3️⃣ Eliminando paquetes viejos de la base de datos...')
  const { data: deletedData, error: deleteError } = await supabase
    .from('packages')
    .delete()
    .lt('created_at', cutoffStr)
    .select('id')

  if (deleteError) {
    console.error('❌ Error al eliminar paquetes:', deleteError.message)
  } else {
    console.log(`   ✅ Eliminados ${deletedData?.length || 0} paquetes`)
  }

  console.log('\n✅ Limpieza completada!')
}

cleanupOldData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error durante la limpieza:', err)
    process.exit(1)
  })
