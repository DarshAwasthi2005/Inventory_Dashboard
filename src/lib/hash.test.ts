import { describe, expect, it } from 'vitest'
import { hashPassword, needsRehash, sha256, verifyPassword } from './hash'

describe('sha256', () => {
  it('matches the known SHA-256 digest of "abc"', async () => {
    expect(await sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('password hashing', () => {
  it('verifies the correct password and rejects a wrong one', async () => {
    const stored = await hashPassword('Secret123')

    expect(await verifyPassword('Secret123', stored)).toBe(true)
    expect(await verifyPassword('Secret124', stored)).toBe(false)
  })

  it('uses a random salt, so the same password hashes differently each time', async () => {
    expect(await hashPassword('Secret123')).not.toBe(await hashPassword('Secret123'))
  })

  it('never contains the plain password', async () => {
    expect(await hashPassword('Secret123')).not.toContain('Secret123')
  })

  it('still verifies legacy SHA-256 hashes and flags them for an upgrade', async () => {
    const legacy = await sha256('admin123')

    expect(await verifyPassword('admin123', legacy)).toBe(true)
    expect(needsRehash(legacy)).toBe(true)
    expect(needsRehash(await hashPassword('admin123'))).toBe(false)
  })
})
