/**
 * Comprime una imagen usando el canvas del navegador.
 * Versión ultra-liviana optimizada para móviles con poca memoria.
 * 
 * @param {File} file - Archivo de imagen original
 * @param {number} maxWidth - Ancho máximo (default: 600px para móviles lentos)
 * @param {number} quality - Calidad de compresión 0-1 (default: 0.5 para compresión agresiva)
 * @returns {Promise<File>} - Archivo comprimido (o el original si falla)
 */
export async function compressImage(file, maxWidth = 600, quality = 0.5) {
  // Timeout de seguridad: si tarda más de 8 segundos, usar la original
  const timeoutId = setTimeout(() => {
    console.warn('Timeout de compresión, usando imagen original')
  }, 8000)
  
  try {
    const result = await doCompress(file, maxWidth, quality)
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Error en compresión:', error.message)
    // En caso de cualquier error, devolver la imagen original
    return file
  }
}

function doCompress(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    // Crear URL temporal
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    
    img.onload = () => {
      // Liberar URL temporal inmediatamente
      URL.revokeObjectURL(objectUrl)
      
      // Calcular nuevas dimensiones manteniendo proporción
      let width = img.width
      let height = img.height
      
      // PRE-REDUCCIÓN: Si la imagen es muy grande (más de 8MP), reducirla primero
      // Esto evita que el canvas falle por límite de tamaño
      const megapixels = (width * height) / 1000000
      if (megapixels > 8) {
        console.log('Imagen muy grande, pre-reducción:', megapixels.toFixed(1), 'MP')
        // Reducir a 800px temporalmente para el proceso inicial
        const scale = 800 / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      
      // Luego reducir al tamaño final si es necesario
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      
      try {
        // Crear canvas y dibujar imagen redimensionada
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        // Configurar para mejor rendimiento
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'medium'
        ctx.drawImage(img, 0, 0, width, height)
        
        // Comprimir como JPEG con calidad reducida
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir la imagen'))
              return
            }
            
            // Crear nuevo File con la imagen comprimida
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            
            console.log(`Imagen comprimida: ${formatBytes(file.size)} -> ${formatBytes(compressedFile.size)} (${Math.round((compressedFile.size / file.size) * 100)}%)`)
            
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      } catch (canvasError) {
        reject(new Error('Error al crear canvas: ' + canvasError.message))
      }
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No se pudo cargar la imagen'))
    }
    
    // Cargar imagen desde el archivo
    img.src = objectUrl
  })
}

/**
 * Formatea bytes a string legible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
