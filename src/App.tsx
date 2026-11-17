import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './features/auth/ProtectedRoute'

// Each page is loaded on demand instead of being part of the initial bundle
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

function PageFallback() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center bg-gray-100"
    >
      <span className="sr-only">Loading...</span>
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
      />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
