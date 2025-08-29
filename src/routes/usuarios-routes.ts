import type { FastifyInstance } from "fastify";

const usuarioSchema = {
    type: "object",
    properties: {
        id_usuario: { type: "number" },
        nombre: { type: "string", minLength: 2 }
    },
    required: ["id_usuario", "nombre"]
}

type User = {
    id_usuario: number;
    nombre: string;
    isAdmin: boolean;
}

const users: User[] = [
    { id_usuario: 1, nombre: 'Jorge', isAdmin: true },
    { id_usuario: 2, nombre: 'Alberto', isAdmin: false },
    { id_usuario: 3, nombre: 'Juan', isAdmin: false }
]

async function userRoutes(fastify: FastifyInstance, options: object) {
    fastify.get('/usuarios', {
        schema: {
            summary: 'Devuelve una lista de usuarios',
            description: 'Devuelve el id, nombre e isAdmin',
            tags: ['usuarios'],
            querystring: {
                type: "object",
                properties: {
                    nombre: { type: "string", minLength: 2 }
                },
                required: []
            },
            response: {
                200: {
                    description: 'Lista de usuarios',
                    type: 'array',
                    items: usuarioSchema
                }
            }
        }
    }, (req, res) => {
        const query = req.query as { nombre: string }
        const { nombre } = query

        if (!nombre) return users;

        return users
            .filter(user => user.nombre.toLowerCase()
                .includes(nombre.toLowerCase())
            );
    })

    fastify.get('/usuarios/:id_usuario', {
        schema: {
            summary: 'Devuelve un usuario por su ID',
            description: 'Devuelve el id, nombre e isAdmin del usuario',
            tags: ['usuarios'],
            params: {
                type: "object",
                properties: {
                    id_usuario: { type: "number" }
                },
                required: ["id_usuario"]
            },
            response: {
                200: {
                    description: 'Usuario encontrado',
                    type: 'object',
                    properties: usuarioSchema.properties
                },
                404: {
                    description: 'Usuario no encontrado',
                    type: 'object',
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params as { id_usuario: number };
        const user = users.find(user => user.id_usuario === id_usuario);
        if (user) return user;

        res.status(404).send({ message: 'Usuario no encontrado' });
    })

    fastify.post('/usuarios', {
        schema: {
            summary: 'Crea un nuevo usuario',
            description: 'Crea un nuevo usuario en la base de datos',
            tags: ['usuarios'],
            body: usuarioSchema,
            response: {
                201: {
                    description: 'Usuario creado',
                    type: 'object',
                    properties: usuarioSchema.properties
                }
            }
        }
    }, (req, res) => {
        const newUser = req.body as User;
        users.push(newUser);

        res.status(201).send(newUser);
    })

    fastify.put('/usuarios/:id_usuario', {
        schema: {
            summary: 'Actualiza un usuario por su ID',
            description: 'Actualiza el nombre del usuario',
            tags: ['usuarios'],
            params: {
                type: "object",
                properties: {
                    id_usuario: { type: "number" }
                },
                required: ["id_usuario"]
            },
            body: {
                type: "object",
                properties: {
                    nombre: { type: "string", minLength: 2 }
                },
                required: ["nombre"]
            },
            response: {
                204: {
                    description: 'Usuario actualizado',
                    type: 'null'
                },
                404: {
                    description: 'Usuario no encontrado',
                    type: 'object',
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params as { id_usuario: number };
        const user = users.find(user => user.id_usuario === id_usuario);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const { nombre } = req.body as { nombre: string };
        user.nombre = nombre;
        res.status(204).send();
    })

    fastify.delete('/usuarios/:id_usuario', {
        schema: {
            summary: 'Elimina un usuario por su ID',
            description: 'Elimina un usuario de la base de datos',
            tags: ['usuarios'],
            params: {
                type: "object",
                properties: {
                    id_usuario: { type: "number" }
                },
                required: ["id_usuario"]
            },
            response: {
                204: {
                    description: 'Usuario eliminado'
                },
                404: {
                    description: 'Usuario no encontrado',
                    type: 'object',
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params as { id_usuario: number };
        const userIndex = users.findIndex(user => user.id_usuario === id_usuario);
        if (userIndex === -1) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        users.splice(userIndex, 1);
        res.status(204).send();
    })

}

export default userRoutes