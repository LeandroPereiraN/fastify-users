import Fastify from 'fastify'
import swagger from './src/plugins/swagger.ts'
import userRoutes from './src/routes/usuarios/usuarios-routes.ts'
import sensible from '@fastify/sensible'
import auth from './src/routes/auth/auth-routes.ts'
import jwt from './src/plugins/jwt.ts'
import decorators from './src/decorators/decorators.ts'

const loggerOptions = {
    level: process.env.FASTIFY_LOG_LEVEL || 'trace',
    transport: {
        target: 'pino-Pretty',
        options: {
            translateTime: 'SYS:standard',
            ignore : 'pid,hostname',
            colorize: true,
        },
    }
}

const fastifyOptions = {
    logger : loggerOptions, //Esto se definio mas arriba, se puede usar muchas mas opciones o definirlas en esta parte
    ignoreTrailingSlash: true,
    bodyLimit: 1048576,
    pluginTimeout: 10000,
    maxParamLength: 100,
    disableRequestLogging: false,
    caseSensitive: true,
}

const fastify = Fastify(fastifyOptions);

await fastify.register(swagger)
await fastify.register(sensible)
await fastify.register(jwt)
await fastify.register(decorators)
fastify.register(auth)
fastify.register(userRoutes)

fastify.listen({
    port: parseInt(process.env.FASTIFY_PORT || '3000'),
    host: process.env.FASTIFY_HOST || '0.0.0.0',
}, (err: any) => {
    if (err) {
        fastify.log.error(err)
        fastify.close()
        process.exit(1)
    }
})