import { useState, type ReactNode } from 'react'
import type { NewUserInput, SessionUser } from '../../db/types'
import { userService } from '../../db/userService'
import { AuthContext } from './AuthContext'

const STORAGE_KEY = 'inventory-session'

// Restore the session from localStorage so login survives a page refresh
function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(loadSession)

  function startSession(sessionUser: SessionUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  async function login(email: string, password: string) {
    startSession(await userService.authenticate(email, password))
  }

  async function register(input: NewUserInput) {
    startSession(await userService.register(input))
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
