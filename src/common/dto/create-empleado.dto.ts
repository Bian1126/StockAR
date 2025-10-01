// create-empleado.dto.ts
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsInt()
  @IsNotEmpty()
  idRol!: number;
}
