import Fastify from 'fastify'
import type { FastifyInstance,FastifyListenOptions } from 'fastify'
import swagger from './src/plugins/swagger.ts'
import userRoutes from './src/routes/usuarios/usuarios-routes.ts'
import sensible from '@fastify/sensible'

const loggerOptions = {
    level: process.env.FASTIFY_LOG_LEVEL || 'trace', // Muestra logueos de trace o superiores
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

const fastifyListenOptions : FastifyListenOptions = {
    port: parseInt(process.env.FASTIFY_PORT || '3000'),
    host: process.env.FASTIFY_HOST || '0.0.0.0',
}

const fastify:FastifyInstance = Fastify(fastifyOptions);

fastify.register(swagger)
fastify.register(sensible)
fastify.register(userRoutes)

fastify.listen(fastifyListenOptions, (err: any) => {
    if (err) {
        fastify.log.error(err)
        fastify.close()
        process.exit(1)
    }
})