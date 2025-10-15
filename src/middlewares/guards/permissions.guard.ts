import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.permisos) throw new ForbiddenException('Sin permisos');
    const hasPermission = requiredPermissions.every(p => user.permisos.includes(p));
    if (!hasPermission) throw new ForbiddenException('Permiso denegado');
    return true;
  }
}