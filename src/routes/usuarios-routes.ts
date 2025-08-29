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
    fastify.get('/users', {
        schema: {
            summary: 'Devuelve una lista de usuarios',
            description: 'Devuelve el id, nombre e isAdmin',
            tags: ['users'],
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

    fastify.get('/users/:id', {
        schema: {
            summary: 'Devuelve un usuario por su ID',
            description: 'Devuelve el id, nombre e isAdmin del usuario',
            tags: ['users'],
            params: {
                type: "object",
                properties: {
                    id: { type: "number" }
                },
                required: ["id"]
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
        const { id } = req.params as { id: number };
        const user = users.find(user => user.id_usuario === id);
        if (user) return user;

        res.status(404).send({ message: 'Usuario no encontrado' });
    })

    fastify.post('/users', {
        schema: {
            summary: 'Crea un nuevo usuario',
            description: 'Crea un nuevo usuario en la base de datos',
            tags: ['users'],
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

    fastify.put('/users/:id', {
        schema: {
            summary: 'Actualiza un usuario por su ID',
            description: 'Actualiza el nombre e isAdmin del usuario',
            tags: ['users'],
            params: {
                type: "object",
                properties: {
                    id: { type: "number" }
                },
                required: ["id"]
            },
            body: {
                type: "object",
                properties: {
                    nombre: { type: "string", minLength: 2 },
                    isAdmin: { type: "boolean" }
                },
                required: ["nombre", "isAdmin"]
            },
            response: {
                200: {
                    description: 'Usuario actualizado',
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
        const { id } = req.params as { id: number };
        const user = users.find(user => user.id_usuario === id);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const body = req.body as Partial<User>;
        const updatedUser: User = { ...user, ...body };
        users.splice(users.indexOf(user), 1, updatedUser);
        res.send(updatedUser);
    })

    fastify.delete('/users/:id', {
        schema: {
            summary: 'Elimina un usuario por su ID',
            description: 'Elimina un usuario de la base de datos',
            tags: ['users'],
            params: {
                type: "object",
                properties: {
                    id: { type: "number" }
                },
                required: ["id"]
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
        const { id } = req.params as { id: number };
        const userIndex = users.findIndex(user => user.id_usuario === id);
        if (userIndex === -1) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        users.splice(userIndex, 1);
        res.status(204).send();
    })

}

export default userRoutes