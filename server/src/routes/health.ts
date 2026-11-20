import { Router } from 'express'

export const healthRouter = Router()

// Used by hosting platforms and monitors to check that the service is alive
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})
