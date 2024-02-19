import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator'; // Importa la función isArray de class-validator
import { Request, Response, NextFunction } from 'express'; // Importa las interfaces de Request, Response y NextFunction de Express
import { verify } from 'jsonwebtoken'; // Importa la función verify de jsonwebtoken
import { UsersService } from '../../users/users.service'; // Importa el servicio UsersService
import { UserEntity } from 'src/users/entities/user.entity'; // Importa la entidad UserEntity

// Extiende la interfaz global de Express para incluir una propiedad currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity; // Define una propiedad opcional currentUser de tipo UserEntity en la interfaz Request de Express
    }
  }
}

@Injectable() // Marca la clase como un proveedor inyectable
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {} // Inyecta el servicio UsersService en el constructor

  // Implementa el método use de la interfaz NestMiddleware
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization; // Obtiene el encabezado de autorización de la solicitud
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      // Verifica si el encabezado de autorización es válido
      req.currentUser = null; // Si no es válido, establece currentUser en null
      next(); // Llama a la función next para continuar con el siguiente middleware
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1]; // Extrae el token JWT del encabezado de autorización
        const { id } = <JwtPayload>(
          verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        ); // Verifica y decodifica el token JWT para obtener el ID del usuario
        const currentUser = await this.usersService.findOne(+id); // Busca el usuario correspondiente en la base de datos
        req.currentUser = currentUser; // Establece currentUser en el usuario encontrado
        next(); // Llama a la función next para continuar con el siguiente middleware
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}

// Define una interfaz JwtPayload para especificar la estructura del payload del token JWT
interface JwtPayload {
  id: string; // Define una propiedad id de tipo string en la interfaz JwtPayload
}
