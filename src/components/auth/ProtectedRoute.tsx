import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loading } from '../common/Loading'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/auth'

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth(); const location = useLocation()
  if (loading) return <Loading fullPage label="Restoring your secure session…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/access-denied" replace />
  return <Outlet />
}
