import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

// Import plugins
import prismaPlugin from './plugins/prisma'
import aiPlugin from './plugins/ai'

// Import routes
import itineraryRoutes from './routes/itinerary'
import healthRoutes from './routes/health'
import testRoutes from './routes/test'

// Add environment variable validation
function validateEnv() {
  const required = [
    'DATABASE_URL',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'JWT_SECRET'
  ]

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}

async function main() {
  try {
    validateEnv()
    
    const server = Fastify({
      logger: true
    }).withTypeProvider<TypeBoxTypeProvider>()

    // Register plugins
    await server.register(cors, {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8080']
    })
    
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key'
    })

    // Register database plugin
    await server.register(prismaPlugin)
    
    // Register AI plugin
    await server.register(aiPlugin)

    // Register routes last
    await server.register(healthRoutes, { prefix: '/api/v1' })
    await server.register(testRoutes, { prefix: '/api/v1' })
    await server.register(itineraryRoutes, { prefix: '/api/v1' })

    await server.listen({ port: 4000, host: '0.0.0.0' })
    console.log('Server listening on port 4000')
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

main() 