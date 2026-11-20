import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.js'

export interface AppOptions {
  corsOrigins: string[]
}

// Builds the app without starting a server, so tests can use it directly
export function createApp({ corsOrigins }: AppOptions) {
  const app = express()

  app.use(helmet())
  // Only origins on the allow-list receive CORS headers
  app.use(cors({ origin: corsOrigins, credentials: true }))
  app.use(express.json({ limit: '100kb' }))

  app.use('/api/health', healthRouter)

  // These two must stay last
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
