import { User } from "../../types/User.ts";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";

const usuarioSchema = {
    type: "object",
    properties: {
        id_usuario: { type: "number" },
        nombre: { type: "string", minLength: 2 }
    },
    required: ["id_usuario", "nombre"]
}

const users: User[] = [
    { id_usuario: 1, nombre: 'Jorge', isAdmin: true },
    { id_usuario: 2, nombre: 'Alberto', isAdmin: false },
    { id_usuario: 3, nombre: 'Juan', isAdmin: false }
]
let usersCount = users.length;

const userRoutes : FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.get('/usuarios', {
        schema: {
            summary: 'Devuelve una lista de usuarios',
            description: 'Devuelve el id, nombre e isAdmin',
            tags: ['usuarios'],
            querystring: Type.Object({ 
                nombre: Type.Optional(Type.String({ minLength: 2 })) 
            }),
            response: {
                200: {
                    description: 'Lista de usuarios',
                    type: 'array',
                    items: usuarioSchema
                }
            }
        }
    }, (req, res) => {
        const query = req.query
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
            params: Type.Pick(User, ["id_usuario"]),
            response: {
                200: User,
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
        const { id_usuario } = req.params;
        const user = users.find(user => user.id_usuario === id_usuario);
        if (user) return user;

        res.status(404).send({ message: 'Usuario no encontrado' });
    })

    fastify.post('/usuarios', {
        schema: {
            summary: 'Crea un nuevo usuario',
            description: 'Crea un nuevo usuario en la base de datos',
            tags: ['usuarios'],
            body: Type.Omit(User, ["id_usuario"]),
            response: {
                201: User
            }
        }
    }, (req, res) => {
        const user = req.body;
        usersCount++;

        const newUser = { 
            id_usuario: usersCount, 
            ...user 
        }
        users.push(newUser);

        res.status(201).send(newUser);
    })

    fastify.put('/usuarios/:id_usuario', {
        schema: {
            summary: 'Actualiza un usuario por su ID',
            description: 'Actualiza el nombre del usuario',
            tags: ['usuarios'],
            params: Type.Pick(User, ["id_usuario"]),
            body: User,
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
        const { id_usuario } = req.params;
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