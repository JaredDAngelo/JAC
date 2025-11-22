import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="px-6 py-20 lg:px-12 lg:py-32 text-center container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">Gestión de Juntas de Acción Comunal</h1>
        <p className="text-lg text-muted-foreground text-balance mb-12">Plataforma profesional para gestionar de manera eficiente juntas de acción comunal, documentación, certificados y libros de registro.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/registro">
            <button className="px-6 py-3 bg-[#013d2d] text-white rounded">Registrarse →</button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 border rounded">Iniciar sesión</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
