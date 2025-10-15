import http from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { logger } from './config/logger.js'
import { env } from './config/env.js'
import { setupRealtime } from './realtime/socket.js'

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: env.ORIGIN || '*' }
})
setupRealtime(io)

const port = env.PORT || 4000
server.listen(port, () => {
  logger.info({ port }, 'API server listening')
})
