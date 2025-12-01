import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../../assets/images/logo-juntas.svg'
import auth from '../../../api/auth'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', contrasena: '', contrasena_confirmacion: '', cedula: '' })
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
    if (!formData.cedula) {
      setError('La cédula es obligatoria')
      return
    }
    setIsLoading(true)
    try {
      const payload = { nombre: formData.nombre, correo: formData.correo, contraseña: formData.contrasena, cedula: Number(formData.cedula) };
      const data = await auth.register(payload);
      toast.success('Registro exitoso. Puedes iniciar sesión ahora.')
      navigate('/login')
    } catch (err) {
      // Manejar errores provenientes del backend (axios)
      const msg = (err && err.response && err.response.data && (err.response.data.message || err.response.data.error)) || err.message || 'Error de conexión. Por favor intenta de nuevo.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <img src={logo} alt="JAC" className="w-15 h-16 mx-auto sm:w-25 sm:h-20" />
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
              <label className="block text-sm">Cédula</label>
              {/* usar input type=text + inputMode para evitar el "contador" de los number inputs y aceptar solo dígitos */}
              <input
                name="cedula"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={formData.cedula}
                onChange={(e) => {
                  // aceptar solo dígitos
                  const digits = e.target.value.replace(/\D/g, '');
                  handleChange({ target: { name: 'cedula', value: digits } });
                }}
                required
                className="w-full border px-3 py-2 rounded"
              />
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
