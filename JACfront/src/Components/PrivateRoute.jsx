import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import auth from '../api/auth'

export default function PrivateRoute() {
  const location = useLocation()
  const token = auth.getToken()
  // Comprobar existencia y expiración del token
  const isAuthenticated = !!token && !auth.isTokenExpired()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si está autenticado, renderizamos el Outlet para las rutas anidadas
  return <Outlet />
}
