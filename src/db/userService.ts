import { db } from './database'
import type { NewUserInput, SessionUser, User } from './types'
import { hashPassword, needsRehash, verifyPassword } from '../lib/hash'
import { newUserSchema } from '../lib/authSchemas'

const DUPLICATE_EMAIL_MESSAGE = 'An account with this email already exists'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function toSessionUser(user: User): SessionUser {
  return { id: user.id!, name: user.name, email: user.email, role: user.role }
}

// Development convenience only: demo accounts are never created in production builds
async function seedDemoUsers(): Promise<void> {
  if (!import.meta.env.DEV) return
  if ((await db.users.count()) > 0) return

  await db.users.bulkAdd([
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: await hashPassword('admin123'),
      role: 'admin',
    },
    {
      name: 'Normal User',
      email: 'user@demo.com',
      passwordHash: await hashPassword('user123'),
      role: 'user',
    },
  ])
}

export const userService = {
  async authenticate(email: string, password: string): Promise<SessionUser> {
    await seedDemoUsers()

    const user = await db.users.where('email').equals(normalizeEmail(email)).first()
    const isValid = user ? await verifyPassword(password, user.passwordHash) : false

    // One generic message for an unknown email and a wrong password
    if (!user || !isValid) throw new Error('Invalid email or password')

    // Upgrade legacy or weaker hashes now that we know the plain password
    if (needsRehash(user.passwordHash) && user.id !== undefined) {
      await db.users.update(user.id, { passwordHash: await hashPassword(password) })
    }

    return toSessionUser(user)
  },

  async register(input: NewUserInput): Promise<SessionUser> {
    const data = newUserSchema.parse(input)
    const email = normalizeEmail(data.email)

    if (await db.users.where('email').equals(email).first()) {
      throw new Error(DUPLICATE_EMAIL_MESSAGE)
    }

    // The first account becomes the administrator; everyone after is a regular user
    const isFirstUser = (await db.users.count()) === 0
    const user: User = {
      name: data.name,
      email,
      passwordHash: await hashPassword(data.password),
      role: isFirstUser ? 'admin' : 'user',
    }

    let id: number | undefined
    try {
      id = await db.users.add(user)
    } catch (err) {
      if (err instanceof Error && err.name === 'ConstraintError') {
        throw new Error(DUPLICATE_EMAIL_MESSAGE)
      }
      throw err
    }
    if (id === undefined) throw new Error('Unable to create the account')

    return toSessionUser({ ...user, id })
  },
}
