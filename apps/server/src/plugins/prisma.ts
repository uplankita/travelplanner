import fp from 'fastify-plugin'
import { prisma } from '@ai-travel/database'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma
  }
}

export default fp(async (fastify) => {
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect()
  })
}, {
  name: 'prisma',
  dependencies: []
}) 