import { motion } from 'motion/react'
import { useAuth } from '../features/auth/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <motion.header
      className="border-b bg-white"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold">Inventory Dashboard</span>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
          >
            {user?.name.charAt(0).toUpperCase()}
          </span>
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
    </motion.header>
  )
}
