import { IsString, IsOptional } from 'class-validator';

export class UpdateTipoProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}