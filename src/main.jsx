import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Manejador global de errores para evitar crashes silenciosos
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Error global capturado:', { message, source, lineno, colno, error })
  return false // Permite que el error se maneje normalmente también
}

// Manejador de promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', function(event) {
  console.error('Promesa rechazada no manejada:', event.reason)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
