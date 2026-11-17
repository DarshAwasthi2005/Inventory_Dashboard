import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './database'
import { userService } from './userService'
import { sha256 } from '../lib/hash'

beforeEach(async () => {
  await db.users.clear()
})

describe('userService.authenticate', () => {
  it('signs in the demo admin and returns a session user without the password hash', async () => {
    const user = await userService.authenticate('admin@demo.com', 'admin123')

    expect(user.role).toBe('admin')
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('treats the email as case-insensitive', async () => {
    const user = await userService.authenticate('  USER@demo.com ', 'user123')
    expect(user.role).toBe('user')
  })

  it('rejects a wrong password and an unknown email with the same message', async () => {
    await expect(userService.authenticate('admin@demo.com', 'wrong')).rejects.toThrow(
      'Invalid email or password',
    )
    await expect(userService.authenticate('nobody@demo.com', 'admin123')).rejects.toThrow(
      'Invalid email or password',
    )
  })

  it('upgrades a legacy SHA-256 hash after a successful sign in', async () => {
    await db.users.add({
      name: 'Legacy User',
      email: 'legacy@example.com',
      passwordHash: await sha256('Secret123'),
      role: 'user',
    })

    await userService.authenticate('legacy@example.com', 'Secret123')

    const stored = await db.users.where('email').equals('legacy@example.com').first()
    expect(stored?.passwordHash.startsWith('pbkdf2-sha256$')).toBe(true)
  })
})

describe('userService.register', () => {
  const input = { name: 'Asha Rao', email: 'asha@example.com', password: 'Secret123' }

  it('makes the first account an admin and every later account a regular user', async () => {
    const first = await userService.register(input)
    const second = await userService.register({ ...input, email: 'ravi@example.com' })

    expect(first.role).toBe('admin')
    expect(second.role).toBe('user')
  })

  it('stores a salted hash and never the plain password', async () => {
    await userService.register(input)

    const stored = await db.users.where('email').equals(input.email).first()
    expect(stored?.passwordHash).not.toContain('Secret123')
    expect(stored?.passwordHash.startsWith('pbkdf2-sha256$')).toBe(true)
  })

  it('rejects a duplicate email regardless of letter case', async () => {
    await userService.register(input)

    await expect(
      userService.register({ ...input, email: 'ASHA@example.com' }),
    ).rejects.toThrow('already exists')
  })

  it('rejects weak passwords', async () => {
    await expect(userService.register({ ...input, password: 'short1' })).rejects.toThrow()
    await expect(
      userService.register({ ...input, password: 'onlyletters' }),
    ).rejects.toThrow()
  })

  it('lets a newly registered user sign in', async () => {
    await userService.register(input)

    const user = await userService.authenticate('asha@example.com', 'Secret123')
    expect(user.name).toBe('Asha Rao')
  })
})
