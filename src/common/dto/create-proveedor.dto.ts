import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  contacto!: string;

  @IsString()
  @IsNotEmpty()
  rubro!: string;
}