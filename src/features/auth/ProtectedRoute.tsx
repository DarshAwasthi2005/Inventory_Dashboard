import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // from yaad rakhte hain, taaki login ke baad wahin wapas bhej sakein
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
