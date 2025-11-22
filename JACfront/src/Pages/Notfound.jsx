import React from 'react'
import { Link } from 'react-router-dom'

export default function Notfound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Página no encontrada</h1>
        <p className="mb-6 text-muted-foreground">Lo sentimos, la ruta que buscas no existe.</p>
        <div className="flex justify-center">
          <Link to="/" className="btn btn-primary px-4 py-2 rounded-md bg-primary text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
