import { FastifyPluginAsync } from 'fastify'

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', {
    handler: async (request, reply) => {
      // Test database connection
      await fastify.prisma.$queryRaw`SELECT 1`
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString()
      }
    }
  })
}

export default healthRoutes 