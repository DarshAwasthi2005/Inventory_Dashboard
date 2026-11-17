import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Remember the original location to return the user after login
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
