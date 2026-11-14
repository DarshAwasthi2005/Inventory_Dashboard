import { db } from './database'
import type { SessionUser } from './types'
import { sha256 } from '../lib/hash'

// Pehli baar ke liye demo users bana deta hai (agar koi user nahi hai)
async function seedUsers(): Promise<void> {
  if ((await db.users.count()) > 0) return

  await db.users.bulkAdd([
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: await sha256('admin123'),
      role: 'admin',
    },
    {
      name: 'Normal User',
      email: 'user@demo.com',
      passwordHash: await sha256('user123'),
      role: 'user',
    },
  ])
}

export const userService = {
  async authenticate(email: string, password: string): Promise<SessionUser> {
    await seedUsers()

    const user = await db.users.where('email').equals(email.trim().toLowerCase()).first()
    const hash = await sha256(password)

    // Email galat ho ya password, message ek hi: attacker ko hint nahi milta
    if (!user || user.passwordHash !== hash) {
      throw new Error('Email ya password galat hai')
    }

    return { id: user.id!, name: user.name, email: user.email, role: user.role }
  },
}
