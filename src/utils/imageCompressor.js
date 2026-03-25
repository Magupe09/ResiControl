/**
 * Comprime una imagen usando el canvas del navegador.
 * Reduce significativamente el tamaño manteniendo calidad aceptable.
 * 
 * @param {File} file - Archivo de imagen original
 * @param {number} maxWidth - Ancho máximo (default: 1024)
 * @param {number} quality - Calidad de compresión 0-1 (default: 0.7)
 * @returns {Promise<File>} - Archivo comprimido
 */
export async function compressImage(file, maxWidth = 1024, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      
      // Crear canvas y dibujar imagen redimensionada
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      
      // Comprimir como JPEG
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
    }
    
    img.onerror = () => {
      reject(new Error('No se pudo cargar la imagen'))
    }
    
    // Cargar imagen desde el archivo
    img.src = URL.createObjectURL(file)
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
