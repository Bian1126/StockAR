import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;
}