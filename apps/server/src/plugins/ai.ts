import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { generateItinerary } from '@ai-travel/ai'

declare module 'fastify' {
  interface FastifyInstance {
    ai: {
      generateItinerary: typeof generateItinerary
    }
  }
}

const aiPlugin: FastifyPluginAsync = async (fastify) => {
  // Verify environment variables
  if (!process.env.OPENAI_API_KEY) {
    fastify.log.warn('OPENAI_API_KEY is not set')
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    fastify.log.warn('ANTHROPIC_API_KEY is not set')
  }

  fastify.decorate('ai', {
    generateItinerary
  })
}

export default fp(aiPlugin, {
  name: 'ai',
  dependencies: []
}) 