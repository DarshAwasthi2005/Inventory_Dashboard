import 'dotenv/config'
import { createApp } from './app.js'
import { loadConfig } from './config.js'

const config = loadConfig()
const app = createApp({ corsOrigins: config.CORS_ORIGIN })

const server = app.listen(config.PORT, () => {
  console.log(`API listening on http://localhost:${config.PORT} (${config.NODE_ENV})`)
})

// Graceful shutdown: stop accepting connections and let in-flight requests finish
function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
