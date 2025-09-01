import Fastify from 'fastify'
import swagger from './src/plugins/swagger.ts'
import userRoutes from './src/routes/usuarios/usuarios-routes.ts'

const fastify = Fastify({
    logger: true
})

const loggerOptions = {
    level: process.env.FASTIFY_LOG_LEVEL || 'trace',
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:standard',
            ignore : 'pid,hostname',
            colorize: true,
        },
    }
}

fastify.register(swagger)
fastify.register(userRoutes)

await fastify.listen({ host: '::', port: 3000 })