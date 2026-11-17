import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './database'
import { userService } from './userService'

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
})
