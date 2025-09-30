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
  tipoProducto!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  marca!: string;

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
  @IsPositive()
  stock!: number;

  @IsString()
  @IsPositive()
  proveedor!: string; 

  @IsInt()
  usuarioId?: number; // Puede ser opcional si el usuario es nullable
}