import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  contraseña!: string;
}