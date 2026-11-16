import { useAuth } from '../features/auth/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold">Inventory Dashboard</span>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="capitalize text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
