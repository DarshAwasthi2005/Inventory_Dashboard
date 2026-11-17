import { createContext } from 'react'
import type { NewUserInput, SessionUser } from '../../db/types'

export interface AuthContextValue {
  user: SessionUser | null
  login: (email: string, password: string) => Promise<void>
  register: (input: NewUserInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
