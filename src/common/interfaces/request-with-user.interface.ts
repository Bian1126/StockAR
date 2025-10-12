import { Request } from 'express';

export interface UserI {
  id: number;
  email: string;
  password: string;
  rol?: string;
  permisos?: string[];
}

export interface RequestWithUser extends Request {
  user: UserI;
}