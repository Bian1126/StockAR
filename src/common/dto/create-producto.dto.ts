import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, IsOptional, Min } from 'class-validator';

export class CreateProductoDto {
  @IsInt()
  @IsPositive()
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

  // Precio de compra por unidad en la moneda seleccionada
  @IsNumber()
  @IsPositive()
  precioNeto!: number;

  // precioVenta lo calculamos en backend; si lo querés enviar puede ser opcional
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioVenta?: number; // creo q no lo usamos 

  @IsNumber()
  @Min(0)
  iva!: number;

  // Ganancia (porcentaje) que viene desde el front (pantalla Calcular Precio)
  @IsNumber()
  @Min(0)
  ganancia!: number;

  @IsInt()
  @Min(1)
  stock!: number;

  @IsInt()
  @IsPositive()
  idTipoProducto!: number; // Relación con TipoProducto

  @IsInt()
  @IsPositive()
  idMoneda!: number; // Relación con Moneda
}