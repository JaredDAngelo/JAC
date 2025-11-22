import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../../assets/images/logo-juntas.svg'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', contrasena: '', contrasena_confirmacion: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.contrasena !== formData.contrasena_confirmacion) {
      setError('Las contraseñas no coinciden')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formData.nombre, correo: formData.correo, contrasena: formData.contrasena }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Error al registrarse')
        setIsLoading(false)
        return
      }
      navigate('/login')
    } catch {
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
          <h2 className="text-lg font-semibold mb-4">Crear cuenta</h2>
          {error && <div className="mb-3 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Nombre completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Correo electrónico</label>
              <input name="correo" type="email" value={formData.correo} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Contraseña</label>
              <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Confirmar contraseña</label>
              <input name="contrasena_confirmacion" type="password" value={formData.contrasena_confirmacion} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#013d2d] text-white px-4 py-2 rounded">{isLoading ? 'Registrando...' : 'Registrarse'}</button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-[#013d2d] font-semibold">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
