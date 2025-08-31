import { Type } from "@fastify/type-provider-typebox";
import type { Static } from "@fastify/type-provider-typebox";

export const User = Type.Object({
    id_usuario: Type.Integer(),
    nombre: Type.String({ minLength: 2 }),
    isAdmin: Type.Optional(Type.Boolean())
}, {
    description: "Descripcion del esquema de usuario"
})

export type User = Static<typeof User>;