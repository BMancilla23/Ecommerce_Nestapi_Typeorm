
import { SetMetadata } from '@nestjs/common';

// Este decorador `AuthorizeRoles` se utiliza para asignar roles a los controladores o métodos específicos.
// Toma un número variable de argumentos, que representan los roles permitidos para acceder a un recurso.

export const AuthorizeRoles = (...roles: string[]) => SetMetadata('allowedRoles', roles);