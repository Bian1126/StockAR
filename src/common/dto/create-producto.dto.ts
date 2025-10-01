import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: number;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  marca!: string;

  @IsNumber()
  @IsPositive()
  precioNeto!: number;

  @IsNumber()
  @IsPositive()
  precioVenta!: number;

  @IsNumber()
  @IsPositive()
  iva!: number;

  @IsNumber()
  @IsPositive()
  ganancia!: number;

  @IsInt()
  @IsPositive()
  stock!: number;

  @IsInt()
  @IsPositive()
  idTipoProducto!: number; // Relación con TipoProducto

  @IsInt()
  @IsPositive()
  idMoneda!: number; // Relación con Moneda
}