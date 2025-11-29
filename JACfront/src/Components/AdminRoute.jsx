import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import auth from '../api/auth'
import { toast } from 'sonner'

export default function AdminRoute({ children }) {
  const location = useLocation()
  const token = auth.getToken()
  if (!token || auth.isTokenExpired()) return <Navigate to="/login" state={{ from: location }} replace />
  const user = auth.getUserFromToken()
  if (!user || (user.rol !== 'admin' && user.role !== 'admin')) {
    toast.error('Acceso denegado: necesitas permisos de administrador')
    return <Navigate to="/dashboard" replace />
  }
  return children
}
