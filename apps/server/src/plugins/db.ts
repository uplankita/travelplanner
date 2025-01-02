import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  // Database connection logic
}

export default fp(dbPlugin, {
  name: 'db'
}) 