import type { SignOptions } from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";

const testUser = {
    name: "lpereira",
    roles: [ "user", "admin" ]
}

const auth : FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post('/login', {
        schema: {
            tags: ["auth"],
            summary: "Ruta para obtener token",
            description: "Mediante usuario y contraseña se puede obtener el token",
            body: {
                type: "object",
                properties: {
                    user: { type: "string" },
                    password: { type: "string" }
                }
            }
        }
    }, (req, res) => {
        const { password } = req.body as { password: string };

        const user = testUser;

        if (password == "contraseña") {
            const signOptions: SignOptions = {
                expiresIn: '1h',
                notBefore: '0s',
            }
            const token = fastify.jwt.sign({ user }, signOptions);
            return { token };
        }

        res.code(401)
        return { message: "No autorizado" }
    })

    fastify.get('/profile', {
        schema: {
            tags: ["auth"],
            summary: "Obtener perfil del usuario",
            description: "Ruta para obtener el perfil del usuario",
            security: [
                { bearerAuth: [] }
            ]
        },
        onRequest: async (req, res) => await req.jwtVerify()
    },
    async (req, res) => {
        const user = req.user;

        return user;
    });
}

export default auth