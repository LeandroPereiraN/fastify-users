import type { FastifyPluginAsync } from "fastify";

const testUser = {
    name: "lpereira",
    roles: [ "user", "admin" ]
}

const testToken = Buffer.from(
    JSON.stringify(testUser)
).toString("base64")

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
        const { user, password } = req.body as { user: string, password: string };
        if (password == "contraseña") {
            return { token : testToken }
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
        }
    }, (req, res) => {
        const token = req.headers.authorization?.slice(7);
        if (!token) {
            res.code(401);
            return { message: "No autorizado" };
        }
        const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

        return user;
    });
}

export default auth