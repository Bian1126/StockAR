import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateMonedaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsNumber()
  @IsPositive()
  cotizacion!: number;
}