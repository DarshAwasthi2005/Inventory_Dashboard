import { describe, expect, it } from 'vitest'
import { loadConfig } from './config.js'

describe('loadConfig', () => {
  it('applies safe defaults when nothing is set', () => {
    const config = loadConfig({})

    expect(config.PORT).toBe(4000)
    expect(config.NODE_ENV).toBe('development')
    expect(config.CORS_ORIGIN).toEqual(['http://localhost:5173'])
  })

  it('reads values from the environment', () => {
    expect(loadConfig({ PORT: '8080', NODE_ENV: 'production' }).PORT).toBe(8080)
  })

  it('splits a comma-separated list of allowed origins', () => {
    const config = loadConfig({
      CORS_ORIGIN: 'https://app.example.com, https://admin.example.com',
    })

    expect(config.CORS_ORIGIN).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ])
  })

  it('fails fast when the origin list is empty', () => {
    expect(() => loadConfig({ CORS_ORIGIN: ' , ' })).toThrow(
      'Invalid environment configuration',
    )
  })

  it('fails fast on an invalid port', () => {
    expect(() => loadConfig({ PORT: 'abc' })).toThrow('Invalid environment configuration')
  })
})
