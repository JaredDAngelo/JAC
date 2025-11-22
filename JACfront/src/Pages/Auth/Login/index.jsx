import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../../assets/images/logo-juntas.svg'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <img src={logo} alt="JAC" className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold">JAC</h1>
          <p className="text-slate-600">Gestión de Juntas de Acción Comunal</p>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Iniciar sesión</h2>
          {error && <div className="mb-3 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#013d2d] text-white px-4 py-2 rounded">{isLoading ? 'Iniciando...' : 'Iniciar sesión'}</button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta? <Link to="/registro" className="text-[#013d2d] font-semibold">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
