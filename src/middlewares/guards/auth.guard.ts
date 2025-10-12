import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.getPayload(token, 'auth');
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}