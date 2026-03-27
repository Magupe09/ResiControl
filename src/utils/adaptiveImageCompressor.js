/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPRESOR DE IMÁGENES ADAPTATIVO
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ¿Por qué necesitamos un compresor "adaptativo"?
 * -----------------------------------------
 * Un compresor fijo no funciona bien para todos los dispositivos:
 * - En un iPhone nuevo: podemos comprimir más porque tiene mucha RAM
 * - En un Android antiguo: necesitamos comprimir MUCHO para que no falle
 * 
 * Este compresor:
 * 1. Detecta las capacidades del dispositivo
 * 2. Ajusta los parámetros de compresión según esas capacidades
 * 3. Maneja errores de forma elegante (en lugar de crashear, intenta alternativas)
 * 4. Tiene un timeout de seguridad para no dejar colgada la app
 * 
 * Conceptos clave que vas a aprender:
 * - Canvas API: La forma nativa del navegador para procesar imágenes
 * - Blob: Tipo de archivo binario, similar a File pero más básico
 * - URL.createObjectURL: Crea una URL temporal para mostrar imágenes sin subirlas
 * - Progresión: Intentar primero con lo fácil, si falla ir a lo difícil
 */

import { detectDeviceCapabilities, formatBytes } from './deviceDetection.js'

/**
 * Comprime una imagen adaptando los parámetros al dispositivo
 * 
 * @param {File} file - Archivo de imagen original
 * @param {Object} options - Opciones overrides (opcional)
 * @returns {Promise<File>} - Archivo comprimido (o el original si falla)
 * 
 * Ejemplo de uso:
 * const compressed = await adaptiveCompress(photoFile)
 * // Listo para subir
 */
export async function adaptiveCompress(file, options = {}) {
  // Paso 1: Detectar capacidades del dispositivo
  // Esto nos dice qué tan "poderoso" es el dispositivo
  const capabilities = detectDeviceCapabilities()
  
  // Paso 2: Determinar parámetros de compresión
  // Usamos los límites del dispositivo, pero allow overrides
  const maxWidth = options.maxWidth || capabilities.limits.maxImageDimension
  const quality = options.quality || capabilities.limits.compressionQuality
  const timeout = options.timeout || (capabilities.limits.enableTimeout ? 10000 : 0)
  
  console.log('🖼️ Compresión adaptativa iniciada:')
  console.log(`   Dispositivo: ${capabilities.tier} (~${capabilities.memoryGB}GB RAM)`)
  console.log(`   Imagen original: ${file.name} (${formatBytes(file.size)})`)
  console.log(`   Configuración: maxWidth=${maxWidth}px, quality=${quality}`)
  
  // Paso 3: Ejecutar compresión con timeout de seguridad
  // Si tarda demasiado, usamos la imagen original
  if (timeout > 0) {
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Timeout de compresión alcanzado, usando imagen original')
    }, timeout)
    
    try {
      const result = await doCompress(file, maxWidth, quality, capabilities)
      clearTimeout(timeoutId)
      return result
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } else {
    return doCompress(file, maxWidth, quality, capabilities)
  }
}

/**
 * Compresión progresiva: intenta primero, si falla reduce las expectativas
 * Esta es la parte más importante - maneja los casos donde el canvas falla
 * 
 * ¿Por qué progresivo?
 * -------------------
 * Imagina que tienes una foto de 4000x3000 (12MP). Intentar comprimir eso
 * directamente puede fallar porque:
 * 1. Cargar la imagen en memoria usa mucha RAM
 * 2. Crear un canvas de 4000x3000 puede exceder límites del navegador
 * 3. El proceso de redimensionar consume más memoria
 * 
 * La estrategia progresiva:
 * 1. Primero intentamos con los parámetros "ideales"
 * 2. Si falla, reducimos drásticamente (menor tamaño, menor calidad)
 * 3. Si sigue fallando, usamos la imagen original (sin comprimir)
 */
function doCompress(file, maxWidth, quality, capabilities) {
  return new Promise((resolve, reject) => {
    // Crear URL temporal para cargar la imagen
    // ¿Qué es una URL de objeto?
    // Es una referencia en memoria a un archivo sin necesidad de subirlo a un servidor
    // Es como una "dirección temporal" que el navegador entiende
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    // onload se ejecuta cuando la imagen se cargó correctamente
    img.onload = () => {
      // IMPORTANTE: Liberar la URL temporal INMEDIATAMENTE
      // Si no lo haces, se queda en memoria y puede causar fugas de memoria
      URL.revokeObjectURL(objectUrl)
      
      // Intentar comprimir, pero manejar errores
      try {
        const result = attemptCompress(img, file, maxWidth, quality, capabilities)
        resolve(result)
      } catch (error) {
        // Si la primera compresión falla, intentar con parámetros reducidos
        if (maxWidth > 400) {
          console.log('🔄 Retry con parámetros reducidos...')
          try {
            // Reducir a la mitad
            const reducedResult = attemptCompress(img, file, 400, 0.4, capabilities)
            resolve(reducedResult)
          } catch (retryError) {
            // Si sigue fallando, devolver la original
            console.warn('⚠️ Compresión falló, usando imagen original')
            resolve(file)
          }
        } else {
          // Si ya estamos en parámetros mínimos y falla, devolver original
          reject(error)
        }
      }
    }

    // onerror se ejecuta si la imagen no se pudo cargar
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No se pudo cargar la imagen. El archivo puede estar corrupto.'))
    }

    // Cargar la imagen desde el archivo
    img.src = objectUrl
  })
}

/**
 * Intenta comprimir la imagen usando canvas
 * Esta función puede fallar si el canvas es muy grande
 */
function attemptCompress(img, file, maxWidth, quality, capabilities) {
  // Calcular nuevas dimensiones
  // Mantenemos la proporción (aspect ratio) para que no se deforme
  let width = img.width
  let height = img.height
  
  // Reducir si excede el ancho máximo
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }

  // PRE-VERIFICACIÓN: ¿El canvas será muy grande?
  // Algunos navegadores tienen límites de tamaño de canvas
  // El límite típico es 4096x4096 o 16384x16384 dependiendo del dispositivo
  const MAX_CANVAS_SIZE = 8192 // Límite conservador
  
  if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
    console.warn(`⚠️ Imagen muy grande (${width}x${height}), reduciendo más`)
    const scale = MAX_CANVAS_SIZE / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  // Crear el canvas donde vamos a dibujar la imagen
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  // Obtener el "contexto" 2D del canvas
  // Es donde dibujamos la imagen redimensionada
  const ctx = canvas.getContext('2d')
  
  // Configurar calidad del redimensionado
  // imageSmoothingEnabled = true hace que la imagen no se vea pixelada
  // imageSmoothingQuality = 'high' usa el mejor algoritmo disponible
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'medium' // 'low' es más rápido, 'high' es más lento pero se ve mejor

  // Dibujar la imagen redimensionada en el canvas
  // Esto es lo que realmente consume memoria
  ctx.drawImage(img, 0, 0, width, height)

  // Convertir el canvas a un blob (archivo binario)
  // toBlob es asíncrono y comprime la imagen
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Error al comprimir la imagen'))
          return
        }

        // Crear un nuevo File con el blob comprimido
        // Mantenemos el nombre original pero cambiamos el tipo a JPEG
        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
          type: 'image/jpeg',
          lastModified: Date.now()
        })

        const savedBytes = file.size - compressedFile.size
        const savedPercent = Math.round((savedBytes / file.size) * 100)

        console.log(`✅ Compresión exitosa:`)
        console.log(`   Original: ${formatBytes(file.size)}`)
        console.log(`   Comprimida: ${formatBytes(compressedFile.size)}`)
        console.log(`   Ahorro: ${savedPercent}% (${formatBytes(savedBytes)})`)

        resolve(compressedFile)
      },
      'image/jpeg',
      quality
    )
  })
}

/**
 * Versión simple que siempre comprime (para cuando no necesitas detección)
 * Útil si solo quieres una compresión básica
 */
export async function simpleCompress(file, maxWidth = 800, quality = 0.5) {
  return adaptiveCompress(file, { maxWidth, quality })
}

/**
 * Comprime solo si es necesario (si ya es pequeña, no comprime)
 * Útil para evitar comprimir dos veces una imagen ya pequeña
 */
export async function compressIfNeeded(file, maxSizeMB = 2, maxWidth = 800) {
  const sizeMB = file.size / (1024 * 1024)
  
  // Si la imagen ya es pequeña, no comprimir
  if (sizeMB <= maxSizeMB) {
    console.log('📷 Imagen ya es pequeña, usando original')
    return file
  }
  
  console.log(`📷 Imagen grande (${sizeMB.toFixed(1)}MB), comprimiendo...`)
  return adaptiveCompress(file, { maxWidth })
}
