import { useAuth } from '../features/auth/useAuth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">
        Welcome, {user?.name} ({user?.role})
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
      >
        Logout
      </button>
    </div>
  )
}
