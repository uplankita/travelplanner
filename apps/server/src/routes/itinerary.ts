import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { Type } from '@sinclair/typebox'

// Define the request parameters and body types
interface ItineraryParams {
  id: string;
}

interface ItineraryBody {
  destination: string;
  days: number;
  budget: number;
}

// Define the authenticated request type
interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
  };
}

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

const itineraryRoutes: FastifyPluginAsync = async (fastify) => {
  const ItineraryQuery = Type.Object({
    destination: Type.String(),
    days: Type.Number(),
    budget: Type.Number()
  })

  // Get all itineraries for a user
  fastify.get('/itineraries', {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // For development, use test user
      const userId = 'test-user'
      return await fastify.prisma.itinerary.findMany({
        where: { userId },
        include: {
          activities: {
            include: {
              location: true
            }
          }
        }
      })
    }
  })

  // Generate new itinerary
  fastify.post<{ Body: ItineraryBody }>('/generate-itinerary', {
    schema: {
      body: ItineraryQuery
    },
    handler: async (request, reply) => {
      const { destination, days, budget } = request.body
      
      // Ensure test user exists
      await ensureTestUser(fastify.prisma)
      const userId = 'test-user'

      // Generate itinerary using AI
      const aiSuggestions = await fastify.ai.generateItinerary(destination, days, budget)

      // Save to database
      const itinerary = await fastify.prisma.itinerary.create({
        data: {
          destination,
          days,
          budget,
          userId,
          activities: {
            create: aiSuggestions.activities.map(activity => ({
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

      return itinerary
    }
  })

  // Get specific itinerary
  fastify.get<{ Params: ItineraryParams }>('/itineraries/:id', {
    handler: async (request, reply) => {
      const { id } = request.params
      // For development, use test user
      const userId = 'test-user'

      const itinerary = await fastify.prisma.itinerary.findFirst({
        where: {
          id,
          userId
        },
        include: {
          activities: {
            include: {
              location: true
            }
          }
        }
      })

      if (!itinerary) {
        reply.code(404).send({ error: 'Itinerary not found' })
        return
      }

      return itinerary
    }
  })
}

export default itineraryRoutes 