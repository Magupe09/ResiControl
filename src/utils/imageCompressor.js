/**
 * Comprime una imagen usando el canvas del navegador.
 * Reduce significativamente el tamaño manteniendo calidad aceptable.
 * 
 * @param {File} file - Archivo de imagen original
 * @param {number} maxWidth - Ancho máximo (default: 1024)
 * @param {number} quality - Calidad de compresión 0-1 (default: 0.7)
 * @returns {Promise<File>} - Archivo comprimido (o el original si falla)
 */
export async function compressImage(file, maxWidth = 1024, quality = 0.7) {
  // Si el archivo es pequeño (menor a 1MB), no comprimir - ya está bien
  if (file.size < 1024 * 1024) {
    console.log('Archivo pequeño, no se comprime:', formatBytes(file.size))
    return file
  }
  
  // Timeout de seguridad: si tarda más de 10 segundos, usar la original
  const timeoutId = setTimeout(() => {
    console.warn('Timeout de compresión, usando imagen original')
    throw new Error('Timeout de compresión')
  }, 10000)
  
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
