/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MANEJO DE ERRORES PARA SUBIDA DE IMÁGENES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ¿Por qué necesitamos un manejo de errores específico?
 * -----------------------------------------
 * Cuando subes una foto, pueden pasar muchas cosas malas:
 * - El archivo es muy grande → falla al procesarlo
 * - Sin memoria suficiente → el navegador crashea
 * - La conexión se corta → la subida queda colgada
 * - El servidor rechaza el archivo → error de red
 * 
 * Cada tipo de error necesita un tratamiento diferente.
 * Este módulo clasifica los errores y sugiere acciones al usuario.
 * 
 * Conceptos clave:
 * - Error de memoria: Ocurre cuando el dispositivo no tiene suficiente RAM
 * - Error de red: Ocurre cuando la conexión falla o es muy lenta
 * - Error de tamaño: Ocurre cuando el archivo excede límites
 * - Error de servidor: Ocurre cuando Supabase rechaza el archivo
 */

// Tipos de errores que podemos encontrar
export const ErrorTypes = {
  MEMORY_ERROR: 'MEMORY_ERROR',       // El dispositivo no tiene suficiente RAM
  NETWORK_ERROR: 'NETWORK_ERROR',     // Problema de conexión
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',     // La operación tardó demasiado
  SIZE_ERROR: 'SIZE_ERROR',           // El archivo es muy grande
  SERVER_ERROR: 'SERVER_ERROR',       // El servidor respondió con error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'     // Error inesperado
}

/**
 * Clasifica un error según su tipo
 * 
 * @param {Error} error - El error a clasificar
 * @returns {Object} - { type, message, suggestion, severity }
 * 
 * ¿Cómo funciona la clasificación?
 * --------------------------------
 * 1. Miramos el mensaje del error
 * 2. Buscamos patrones que nos digan qué tipo de error es
 * 3. Generamos un mensaje amigable para el usuario
 * 4. Sugerimos una acción para resolverlo
 */
export function classifyError(error) {
  // Si no hay error, no hay clasificación
  if (!error) {
    return {
      type: ErrorTypes.UNKNOWN_ERROR,
      message: 'Error desconocido',
      suggestion: 'Intenta de nuevo',
      severity: 'high'
    }
  }

  const errorMessage = (error.message || error.toString()).toLowerCase()
  const errorCode = error.code || ''
  const statusCode = error.status || error.statusCode || 0

  // Caso 1: Error de memoria
  // Palabras clave: "out of memory", "allocation failed", "memory limit"
  if (
    errorMessage.includes('out of memory') ||
    errorMessage.includes('allocation failed') ||
    errorMessage.includes('memory') ||
    errorMessage.includes('script error') // En iOS, los errores de memoria a veces aparecen como "script error"
  ) {
    return {
      type: ErrorTypes.MEMORY_ERROR,
      message: 'Tu dispositivo no tiene suficiente memoria para procesar esta imagen',
      suggestion: 'Intenta con una foto más pequeña o usa la galería para seleccionar una imagen más pequeña',
      severity: 'high'
    }
  }

  // Caso 2: Error de timeout
  // Palabras clave: "timeout", "timed out", "abort"
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out') ||
    error.name === 'AbortError' ||
    errorCode === 'ECONNABORTED'
  ) {
    return {
      type: ErrorTypes.TIMEOUT_ERROR,
      message: 'La operación tardó demasiado tiempo',
      suggestion: 'Revisa tu conexión a internet e intenta de nuevo',
      severity: 'medium'
    }
  }

  // Caso 3: Error de red
  // Palabras clave: "network", "fetch", "failed to fetch", "connection"
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    statusCode === 0 ||
    statusCode === 408 ||
    statusCode === 503 ||
    statusCode === 504
  ) {
    return {
      type: ErrorTypes.NETWORK_ERROR,
      message: 'Hubo un problema con la conexión a internet',
      suggestion: 'Verifica que estás conectado a WiFi o datos móviles e intenta de nuevo',
      severity: 'medium'
    }
  }

  // Caso 4: Error de tamaño
  // Palabras clave: "size", "too large", "payload"
  if (
    errorMessage.includes('too large') ||
    errorMessage.includes('file size') ||
    errorMessage.includes('payload') ||
    statusCode === 413
  ) {
    return {
      type: ErrorTypes.SIZE_ERROR,
      message: 'El archivo es muy grande para subirlo',
      suggestion: 'Selecciona una imagen más pequeña o intenta comprimirla primero',
      severity: 'high'
    }
  }

  // Caso 5: Error de servidor (Supabase)
  // Status codes 500, 502, 503, etc.
  if (statusCode >= 500) {
    return {
      type: ErrorTypes.SERVER_ERROR,
      message: 'El servidor tuvo un problema (no es tu culpa)',
      suggestion: 'Intenta de nuevo en unos minutos',
      severity: 'medium'
    }
  }

  // Caso 6: Error de autenticación
  if (statusCode === 401 || statusCode === 403) {
    return {
      type: ErrorTypes.SERVER_ERROR,
      message: 'Error de autenticación',
      suggestion: 'Cierra sesión y vuelve a entrar',
      severity: 'high'
    }
  }

  // Caso 7: Default - Error desconocido
  return {
    type: ErrorTypes.UNKNOWN_ERROR,
    message: error.message || 'Ocurrió un error inesperado',
    suggestion: 'Intenta de nuevo. Si el problema persiste, contacta al administrador.',
    severity: 'low'
  }
}

/**
 * Maneja un error mostrando la sugerencia apropiada
 * 
 * @param {Error} error - El error a manejar
 * @param {Function} onError - Callback para mostrar el error al usuario
 * 
 * Ejemplo de uso:
 * handleImageError(error, (msg) => setError(msg))
 */
export function handleImageError(error, onError) {
  const classified = classifyError(error)
  
  console.error('Error clasificado:', classified)
  
  // Construir mensaje para el usuario
  // Incluimos la sugerencia para que sepa qué hacer
  const userMessage = `${classified.message}. ${classified.suggestion}`
  
  if (onError) {
    onError(userMessage)
  }
  
  return classified
}

/**
 * Crea un mensaje de estado para mostrar durante la subida
 * Esto ayuda al usuario a entender qué está pasando
 */
export function getUploadStatusMessage(status, progress) {
  switch (status) {
    case 'preparing':
      return 'Preparando imagen...'
    case 'compressing':
      return 'Comprimiendo imagen...'
    case 'uploading':
      return progress ? `Subiendo... ${progress}%` : 'Subiendo imagen...'
    case 'success':
      return '¡Imagen subida exitosamente!'
    case 'error':
      return 'Error al subir la imagen'
    default:
      return 'Procesando...'
  }
}

/**
 * Determina si se debe reintentar la operación automáticamente
 * Solo reintentamos errores de red o timeout, nunca errores de memoria o tamaño
 */
export function shouldRetry(classifiedError) {
  return (
    classifiedError.type === ErrorTypes.NETWORK_ERROR ||
    classifiedError.type === ErrorTypes.TIMEOUT_ERROR ||
    classifiedError.type === ErrorTypes.SERVER_ERROR
  )
}

/**
 * Retorna el número de reintentos permitidos según el tipo de error
 */
export function getMaxRetries(errorType) {
  switch (errorType) {
    case ErrorTypes.NETWORK_ERROR:
      return 2  // Reintentar hasta 2 veces
    case ErrorTypes.TIMEOUT_ERROR:
      return 1  // Reintentar solo 1 vez
    case ErrorTypes.SERVER_ERROR:
      return 1  // Reintentar solo 1 vez
    default:
      return 0  // No reintentar otros errores
  }
}
