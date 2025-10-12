import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMonedaDto } from './create-tipo-moneda.dto';

export class UpdateTipoMonedaDto extends PartialType(CreateTipoMonedaDto) {}
