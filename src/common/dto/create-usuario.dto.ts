import { IsString, IsNotEmpty, IsEmail, IsInt, IsPositive } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  contraseña!: string;

  @IsInt()
  @IsPositive()
  rolId!: number; // Relación con Rol
}