import { FastifyPluginAsync } from 'fastify'

async function ensureTestUser(prisma: any) {
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user',
      email: 'test@example.com',
      name: 'Test User'
    }
  })
  return testUser
}

const testRoutes: FastifyPluginAsync = async (fastify) => {
  // Test database connection
  fastify.get('/test/db', {
    handler: async (request, reply) => {
      try {
        if (!fastify.prisma) {
          throw new Error('Prisma client not initialized')
        }
        const result = await fastify.prisma.$queryRaw`SELECT NOW()`
        const timestamp = Array.isArray(result) && result[0] ? result[0] : new Date()
        return { status: 'Database connected', timestamp }
      } catch (error: any) {
        fastify.log.error(error)
        return { 
          status: 'Database error', 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }
    }
  })

  // Test AI generation
  fastify.get('/test/ai', {
    handler: async (request, reply) => {
      try {
        const testItinerary = await fastify.ai.generateItinerary(
          'Paris',
          3,
          1000
        )
        return { status: 'AI working', itinerary: testItinerary }
      } catch (error: any) {
        return { status: 'AI error', error: error.message }
      }
    }
  })

  // Test full flow
  fastify.post('/test/full', {
    handler: async (request, reply) => {
      try {
        // 0. Ensure test user exists
        const testUser = await ensureTestUser(fastify.prisma)

        // 1. Generate itinerary
        const itinerary = await fastify.ai.generateItinerary(
          'Tokyo',
          5,
          2000
        )

        // 2. Save to database
        const saved = await fastify.prisma.itinerary.create({
          data: {
            destination: itinerary.destination,
            days: itinerary.days,
            budget: itinerary.budget,
            userId: testUser.id,
            activities: {
              create: itinerary.activities.map(activity => ({
                name: activity.name,
                description: activity.description,
                cost: activity.cost,
                duration: activity.duration,
                location: {
                  create: {
                    name: activity.location.name,
                    latitude: activity.location.coordinates.lat,
                    longitude: activity.location.coordinates.lng
                  }
                }
              }))
            }
          },
          include: {
            activities: {
              include: {
                location: true
              }
            }
          }
        })

        return { status: 'Full flow working', data: saved }
      } catch (error: any) {
        fastify.log.error(error)
        return { 
          status: 'Full flow error', 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }
    }
  })
}

export default testRoutes 