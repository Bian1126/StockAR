import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  cantidad!: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productoId!: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  ventaId!: number;
}