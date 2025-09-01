import {createError} from '@fastify/error'

export const UnknownError = createError('Error_desconocido', 'Se ha producido un error desconocido ', 500);
export const ElementNotFoundError = createError('Elemento_no_encontrado', 'El elemento no se ha encontrado', 404);
export const AuthorizedError = createError('No_autorizado', 'No esta autorizado', 401);
export const PermissionError = createError('Sin_permisos','No se cumple con los permisos necesarios',403);
export const DataBaseConectionError = createError('Error_de_conexion_con_la_base_de_datos','No se ha podido conectar con la base de datos',500);

