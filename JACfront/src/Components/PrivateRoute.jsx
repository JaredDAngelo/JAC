import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  // Simple auth check: presence of token in localStorage (adjust to your auth flow)
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const isAuthenticated = !!token

  if (!isAuthenticated) {
    // redirect to login and save attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
