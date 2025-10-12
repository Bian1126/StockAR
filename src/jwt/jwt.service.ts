import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

export interface Payload {
  id: number;
  email: string;
  rol?: string;
  permisos?: string[];
  exp?: number;
}

@Injectable()
export class JwtService {
  private config;
  constructor(private readonly configService: ConfigService) {
    this.config = {
      auth: {
        secret: this.configService.get<string>('JWT_AUTH_SECRET') || 'authSecret',
        expiresIn: this.configService.get<string>('JWT_AUTH_EXPIRES') || '15m',
      },
      refresh: {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refreshSecret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') || '1d',
      },
    };
  }
  generateToken(payload: Payload, type: 'refresh' | 'auth' = 'auth'): string {
      const secret = this.config[type].secret as Secret;
      const options: SignOptions = {
        expiresIn: this.config[type].expiresIn as SignOptions['expiresIn'],
      };
      return jwt.sign(payload as JwtPayload | string, secret, options);
  }

  refreshToken(refreshToken: string): { accessToken: string; refreshToken: string } {
    try {
      const payload = this.getPayload(refreshToken, 'refresh');
      const timeToExpire = dayjs.unix(payload.exp!).diff(dayjs(), 'minute');
      return {
        accessToken: this.generateToken(payload, 'auth'),
        refreshToken:
          timeToExpire < 20
            ? this.generateToken(payload, 'refresh')
            : refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): Payload {
      const secret = this.config[type].secret as Secret;
      const decoded = jwt.verify(token, secret) as JwtPayload | string | object;
      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid token payload format');
      }
      if (!('email' in decoded)) {
        throw new UnauthorizedException('Token payload missing email');
      }
      return decoded as Payload;
  }
}