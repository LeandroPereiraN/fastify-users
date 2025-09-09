import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, opts) => {
    fastify.decorate("myObject", { hello: "world" });
    fastify.decorate("myFunction", () => {
        return "Hello from myFunction";
    })
})

declare module 'fastify' {
    interface FastifyInstance {
        myObject: { hello: string }
        myFunction(): string
    }  
}