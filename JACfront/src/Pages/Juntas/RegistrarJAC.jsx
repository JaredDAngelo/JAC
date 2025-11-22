import React from 'react'
import { Link } from 'react-router-dom'

export default function RegistrarJAC() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Registrar Junta</h1>
      <p>Página de registro de Juntas (placeholder).</p>
      <Link to="/dashboard/juntas" className="text-primary underline">Volver a Juntas</Link>
    </div>
  )
}
