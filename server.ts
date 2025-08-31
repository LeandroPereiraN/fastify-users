import Fastify from 'fastify'
import swagger from './src/plugins/swagger.ts'
import userRoutes from './src/routes/usuarios/usuarios-routes.ts'

const fastify = Fastify({
    logger: true
})

fastify.register(swagger)
fastify.register(userRoutes)

await fastify.listen({ host: '::', port: 3000 })