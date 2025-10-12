import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoMonedaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  codigo!: string; // e.g. 'USD', 'EUR'
}
