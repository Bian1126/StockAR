import { IsInt, IsPositive, IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDetalleDto {
  @IsInt()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsPositive()
  cantidad!: number;
}

export class CreateVentaDto {
  @IsString()
  @IsNotEmpty()
  estado!: string;

  @IsInt()
  @IsPositive()
  usuarioId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  detalle!: CreateVentaDetalleDto[];
  static detalle: any;
}