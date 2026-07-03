import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminRoute() {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="auth-loading">Loading…</div>
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/account" replace />

  return <Outlet />
}

export function CustomerRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="auth-loading">Loading…</div>
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
