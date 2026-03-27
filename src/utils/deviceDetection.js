/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILIDADES DE DETECCIÓN DE DISPOSITIVO
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ¿Por qué necesitamos esto?
 * ----------------
 * No todos los dispositivos son iguales. Un iPhone 15 tiene ~6GB de RAM y un
 * procesador potente, mientras que un Android de 2018 puede tener solo 2GB.
 * 
 * Si intentamos procesar una foto de 20MB en un dispositivo con poca memoria,
 * el navegador puede cerrarse (crash) o la página puede quedarse colgada.
 * 
 * Esta utilidad nos permite detectar las capacidades del dispositivo y ajustar
 * nuestra estrategia de procesamiento de imágenes accordingly.
 * 
 * Conceptos clave:
 * - navigator.hardwareConcurrency: número de "núcleos" de CPU (más núcleos = más poder)
 * - navigator.deviceMemory: memoria RAM aproximada (solo funciona en algunos navegadores)
 * - Connection API: tipo de conexión (4G, 3G, etc.)
 */

// Constantes que definen los límites
// Ajustamos estos valores basándonos en pruebas reales en dispositivos reales
export const DEVICE_LIMITS = {
  // Para dispositivos de gama baja (< 2GB RAM o pocos núcleos)
  LOW_END: {
    maxFileSizeMB: 3,           // Archivos de hasta 3MB
    maxImageDimension: 800,    // Imágenes de hasta 800px de ancho
    compressionQuality: 0.5,   // Calidad 50% (más comprimido)
    enableTimeout: true         // Con timeout de seguridad
  },
  // Para dispositivos medianos (2-4GB RAM)
  MEDIUM: {
    maxFileSizeMB: 5,
    maxImageDimension: 1200,
    compressionQuality: 0.6,
    enableTimeout: true
  },
  // Para dispositivos de gama alta (> 4GB RAM)
  HIGH_END: {
    maxFileSizeMB: 10,
    maxImageDimension: 1600,
    compressionQuality: 0.7,
    enableTimeout: true
  }
}

/**
 * Detecta las capacidades del dispositivo
 * 
 * Returns: { tier: 'LOW_END' | 'MEDIUM' | 'HIGH_END', limits: {...} }
 * 
 * ¿Cómo funciona?
 * 1. Intenta obtener la memoria RAM del dispositivo (si está disponible)
 * 2. Obtiene el número de núcleos de CPU
 * 3. Determina el "tier" basándose en estos valores
 * 4. Devuelve los límites apropiados para ese tier
 */
export function detectDeviceCapabilities() {
  // Paso 1: Obtener memoria RAM (puede no estar disponible en todos los navegadores)
  // navigator.deviceMemory devuelve la RAM en GB (4, 8, etc.)
  // Si no está disponible, asumimos un valor por defecto conservador
  const memoryGB = navigator.deviceMemory || 2 // Default: 2GB si no se puede detectar

  // Paso 2: Obtener número de núcleos de CPU
  // Más núcleos = más poder de procesamiento para comprimir imágenes
  const cores = navigator.hardwareConcurrency || 2 // Default: 2 si no se puede detectar

  // Paso 3: Detectar tipo de conexión
  // Esto es útil para ajustar timeouts (conexión lenta = más tiempo)
  const connection = navigator.connection || {}
  const isSlowConnection = connection.effectiveType === '2g' || connection.effectiveType === '3g'

  // Logging para debug - en producción esto se quita
  console.log('📱 Capacidades del dispositivo:')
  console.log(`   RAM: ~${memoryGB}GB`)
  console.log(`   Núcleos: ${cores}`)
  console.log(`   Conexión: ${connection.effectiveType || 'unknown'}`)

  // Paso 4: Determinar el tier
  // Esta lógica está basada en pruebas empíricas, no en documentación oficial
  let tier = 'MEDIUM' // Por defecto asumimos dispositivo mediano

  if (memoryGB < 2 || cores < 4) {
    tier = 'LOW_END'
  } else if (memoryGB >= 4 && cores >= 6) {
    tier = 'HIGH_END'
  }

  // Retornar los límites correspondientes
  return {
    tier,
    limits: DEVICE_LIMITS[tier],
    memoryGB,
    cores,
    isSlowConnection,
    // Información adicional que puede ser útil
    info: {
      isLowEnd: tier === 'LOW_END',
      isHighEnd: tier === 'HIGH_END',
      browserName: getBrowserName(),
      osName: getOSName()
    }
  }
}

/**
 * Valida si un archivo de imagen es aceptable para el dispositivo
 * 
 * @param {File} file - El archivo a validar
 * @param {Object} limits - Los límites del dispositivo (de detectDeviceCapabilities)
 * @returns {Object} - { valid: boolean, error?: string, shouldCompress: boolean }
 * 
 * ¿Por qué necesitamos validar?
 * - Si el archivo es demasiado grande, el procesamiento puede fallar
 * - Es mejor detectar el problema ANTES de intentar procesar
 * - Así podemos mostrar un mensaje claro al usuario
 */
export function validateImageFile(file, limits) {
  const maxSizeBytes = limits.maxFileSizeMB * 1024 * 1024

  // Caso 1: Archivo vacío
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: 'El archivo está vacío',
      shouldCompress: false
    }
  }

  // Caso 2: Archivo demasiado grande
  // Primero advertimos, pero permitimos intentar (con compresión)
  if (file.size > maxSizeBytes * 1.5) {
    // Si es más de 1.5x el límite, rechazamos directamente
    return {
      valid: false,
      error: `La foto es muy grande (${formatBytes(file.size)}). Máximo ${limits.maxFileSizeMB}MB.`,
      shouldCompress: false
    }
  }

  // Caso 3: Archivo grande pero procesable
  // Marcamos para comprimir antes de subir
  if (file.size > maxSizeBytes) {
    return {
      valid: true,
      error: null,
      shouldCompress: true,
      reason: 'El archivo es grande, se comprimirá antes de subir'
    }
  }

  // Caso 4: Archivo dentro del límite - procesar normal
  return {
    valid: true,
    error: null,
    shouldCompress: false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detecta el nombre del navegador
 * Útil para debugging y para ajustar estrategias por navegador
 */
function getBrowserName() {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser'
  if (ua.includes('Edg')) return 'Edge'
  return 'Unknown'
}

/**
 * Detecta el sistema operativo
 * Útil para estrategias específicas por plataforma
 */
function getOSName() {
  const ua = navigator.userAgent
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  return 'Unknown'
}

/**
 * Formatea bytes a string legible
 * Ejemplo: 1024 -> "1 KB", 1048576 -> "1 MB"
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Verifica si el navegador soporta características necesarias
 * Esto es importante porque algunos navegadores viejos no soportan todas las APIs
 */
export function checkBrowserSupport() {
  const features = {
    // File API - necesario para leer archivos
    fileAPI: typeof File !== 'undefined',
    // Canvas API - necesario para comprimir
    canvas: typeof document !== 'undefined' && !!document.createElement('canvas').getContext,
    // Promise - necesario para async/await
    promises: typeof Promise !== 'undefined',
    // fetch API - necesario para subir archivos
    fetch: typeof fetch !== 'undefined',
    // Blob API - necesario para crear archivos comprimidos
    blob: typeof Blob !== 'undefined'
  }

  const allSupported = Object.values(features).every(f => f)
  
  if (!allSupported) {
    console.warn('⚠️ Navegador con soporte limitado:', features)
  }

  return {
    supported: allSupported,
    features
  }
}
