import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/* @Injectable()
export class AuthorizeGuard implements CanActivate {
    
    constructor(private reflector: Reflector) {}

    // Implementación del método canActivate requerido por la interfaz CanActivate
    canActivate(context: ExecutionContext): boolean {
        
        // Obtiene los roles permitidos del metadata utilizando el Reflector
        const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
        
        // Obtiene la solicitud HTTP del contexto
        const request = context.switchToHttp().getRequest();
        
        // Verifica si el usuario actual tiene uno de los roles permitidos
        const result = request?.currentUser?.roles.map((role: string) => allowedRoles.includes(role)).find((val: boolean) => val === true);

        // Si el usuario tiene uno de los roles permitidos, se permite el acceso
        if (result) {
            return true;
        }

        // Si el usuario no tiene un rol permitido, se lanza una excepción de no autorizado
        throw new UnauthorizedException('Sorry, you are not authorized.');
    }
} */


// El mixin AuthorizeGuard es una función que toma los roles permitidos como argumento
export const AuthorizeGuard = (allowedRoles: string[]) => {
    
    // Define una clase interna llamada RolesGuardMixin que implementa la interfaz CanActivate
    class RolesGuardMixin implements CanActivate {
        
        // Implementa el método canActivate requerido por la interfaz CanActivate
        canActivate(context: ExecutionContext): boolean {
            
            // Obtiene la solicitud HTTP del contexto
            const request = context.switchToHttp().getRequest();
            
            // Verifica si el usuario actual tiene uno de los roles permitidos
            const result = request?.currentUser?.roles.map((role: string) => allowedRoles.includes(role)).find((val: boolean) => val === true);

            // Si el usuario tiene uno de los roles permitidos, se permite el acceso
            if (result) {
                return true;
            }

            // Si el usuario no tiene un rol permitido, se lanza una excepción de no autorizado
            throw new UnauthorizedException('Sorry, you are not authorized.');
        }
    }
    
    // Crea una instancia del mixin usando la función mixin de NestJS
    const guard = mixin(RolesGuardMixin);
    
    // Devuelve la instancia del mixin para su uso como guardia en la aplicación
    return guard;
}





