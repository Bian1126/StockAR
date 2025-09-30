import { IsString, IsNotEmpty, IsEmail, IsInt, IsPositive } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  contraseña!: string;

  @IsString()
  @IsNotEmpty()
  verificarContraseña!: string; 
}