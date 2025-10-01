import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateMonedaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsNumber()
  @IsPositive()
  cotizacion!: number;

  @IsInt()
  @IsPositive()
  tipoMonedaId!: number;
}