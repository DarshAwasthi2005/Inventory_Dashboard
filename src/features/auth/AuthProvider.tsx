import { useState, type ReactNode } from 'react'
import type { SessionUser } from '../../db/types'
import { userService } from '../../db/userService'
import { AuthContext } from './AuthContext'

const STORAGE_KEY = 'inventory-session'

// Refresh karne par bhi login bana rahe, isliye localStorage se padhte hain
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

  async function login(email: string, password: string) {
    const sessionUser = await userService.authenticate(email, password)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
