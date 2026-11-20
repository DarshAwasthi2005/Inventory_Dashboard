import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'

const app = createApp({ corsOrigins: ['http://localhost:5173'] })

describe('GET /api/health', () => {
  it('reports that the service is healthy', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('sends security headers', async () => {
    const response = await request(app).get('/api/health')

    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  it('allows the configured frontend origin only', async () => {
    const allowed = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')
    const blocked = await request(app)
      .get('/api/health')
      .set('Origin', 'http://evil.example')

    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173')
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined()
  })
})

describe('error handling', () => {
  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown')

    expect(response.status).toBe(404)
    expect(response.body.error.code).toBe('NOT_FOUND')
  })

  it('returns a JSON 400 for malformed request bodies', async () => {
    const response = await request(app)
      .post('/api/anything')
      .set('Content-Type', 'application/json')
      .send('{ not valid json')

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('BAD_REQUEST')
  })
})
