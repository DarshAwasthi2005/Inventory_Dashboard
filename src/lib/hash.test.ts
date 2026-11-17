import { describe, expect, it } from 'vitest'
import { sha256 } from './hash'

describe('sha256', () => {
  it('matches the known SHA-256 digest of "abc"', async () => {
    expect(await sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })

  it('is deterministic for the same input', async () => {
    expect(await sha256('admin123')).toBe(await sha256('admin123'))
  })

  it('produces different hashes for different inputs', async () => {
    expect(await sha256('admin123')).not.toBe(await sha256('admin124'))
  })
})
