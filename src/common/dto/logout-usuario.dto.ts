import { IsInt, IsPositive } from 'class-validator';

export class LogoutUsuarioDto {
  @IsInt()
  @IsPositive()
  idUsuario!: number;
}