import { User } from "../../types/User.ts";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import UserRepositoty from "../../repositories/user-repository.ts";
import { ElementNotFoundError } from "../../models/errors.ts";

const usuarioSchema = {
    type: "object",
    properties: {
        id_usuario: { type: "number" },
        nombre: { type: "string", minLength: 2 }
    },
    required: ["id_usuario", "nombre"]
}

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
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
        const { nombre } = query;
        fastify.log.info({ query: req.query }, 'Request /usuarios');
        if (!nombre) return UserRepositoty.getUsers();

        return UserRepositoty.getUsersByName(nombre);
    })

    fastify.get('/usuarios/:id_usuario', {
        schema: {
            summary: 'Devuelve un usuario por su ID',
            description: 'Devuelve el id, nombre e isAdmin del usuario',
            tags: ['usuarios'],
            params: Type.Pick(User, ["id_usuario"]),
            response: {
                200: User,
                // 404: {
                //     description: 'Usuario no encontrado',
                //     type: 'object',
                //     properties: {
                //         message: { type: "string" }
                //     }
                // }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params;
        console.log(`[GET /usuarios/${id_usuario}] -> Buscando usuario`);
        const user = UserRepositoty.getUserById(id_usuario);
        if (user) {
            console.log(`[GET /usuarios/${id_usuario}] -> Usuario encontrado:`, user);
            return user;
        }

        console.log(`[GET /usuarios/${id_usuario}] -> Usuario no encontrado`);

        throw new ElementNotFoundError()
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
        const newUser = UserRepositoty.createUser(user);

        console.log(`[POST /usuarios] -> Usuario creado con ID: ${newUser.id_usuario}`);

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
                // 404: {
                //     description: 'Usuario no encontrado',
                //     type: 'object',
                //     properties: {
                //         message: { type: "string" }
                //     }
                // }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params;
        const body = req.body;
        if (body.id_usuario !== id_usuario) res.badRequest('El id_usuario del body no coincide con el del param');

        const { nombre } = req.body;

        const oldUser = UserRepositoty.getUserById(id_usuario);
        if (!oldUser) throw new ElementNotFoundError();

        console.log(`[PUT /usuarios/${id_usuario}] -> Nombre antiguo: ${oldUser.nombre}, Nombre nuevo: ${nombre}`);
        console.log(`[PUT /usuarios/${id_usuario}] -> Usuario actualizado correctamente`);

        UserRepositoty.updateUser(id_usuario, { nombre });
        res.status(204).send();
    })

    fastify.delete('/usuarios/:id_usuario', {
        schema: {
            summary: 'Elimina un usuario por su ID',
            description: 'Elimina un usuario de la base de datos',
            tags: ['usuarios'],
            params: Type.Pick(User, ["id_usuario"]),
            response: {
                204: {
                    description: 'Usuario eliminado'
                },
                // 404: {
                //     description: 'Usuario no encontrado',
                //     type: 'object',
                //     properties: {
                //         message: { type: "string" }
                //     }
                // }
            }
        }
    }, (req, res) => {
        const { id_usuario } = req.params;
        if (!UserRepositoty.deleteUser(id_usuario)) {

            console.log(`[DELETE /usuarios/${id_usuario}] -> Usuario no encontrado`);

            throw new ElementNotFoundError()
        }

        console.log(`[DELETE /usuarios/${id_usuario}] -> Usuario eliminado correctamente`);
        res.status(204).send();
    })

}

export default userRoutes