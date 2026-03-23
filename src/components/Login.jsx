import { useState, useEffect } from 'react'
import { signIn, signOut, getSession, getGuardByEmail } from '../supabase'
import { config } from '../config'

export default function Login({ onLogin, currentGuard }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const { session } = await getSession()
    if (session?.user?.email) {
      const { data: guard } = await getGuardByEmail(session.user.email)
      if (guard) {
        onLogin(guard)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { data: guard, error: guardError } = await getGuardByEmail(email)
    
    if (guardError || !guard) {
      await signOut()
      setError('Usuario no encontrado en el sistema')
      setLoading(false)
      return
    }

    setLoading(false)
    onLogin(guard)
  }

  async function handleLogout() {
    await signOut()
    onLogin(null)
  }

  if (currentGuard) {
    return null
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🏢</div>
          <h1>{config.nombreConjunto}</h1>
          <p className="login-subtitle">Portal de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span>🚀</span> Ingresar
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>🔐 Acceso exclusivo para personal autorizado</p>
        </div>
      </div>
    </div>
  )
}
