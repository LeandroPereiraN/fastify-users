import fastifyPlugin from 'fastify-plugin'
import jwt from '@fastify/jwt'
import type { User } from '../types/User'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default fastifyPlugin(async (fastify, opts) => {
    fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'supersecret'
    })

    fastify.decorate("authenticate", async function(req: FastifyRequest, res: FastifyReply) {
        await req.jwtVerify()
    })
})
    
declare module 'fastify' {
    interface FastifyJWT {
        user: User
        payload: User
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate(req: FastifyRequest, res: FastifyReply): Promise<void>
    }
}
