import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  marca!: string;

  @IsString()
  @IsNotEmpty()
  rubro!: string;

  @IsNumber()
  @IsPositive()
  precioNeto!: number;

  @IsInt()
  @IsPositive()
  monedaId!: number;

  @IsNumber()
  @IsPositive()
  iva!: number;

  @IsNumber()
  @IsPositive()
  ganancia!: number;

  @IsInt()
  stock!: number;

  @IsInt()
  @IsPositive()
  proveedorId!: number;

  @IsInt()
  usuarioId?: number; // Puede ser opcional si el usuario es nullable
}