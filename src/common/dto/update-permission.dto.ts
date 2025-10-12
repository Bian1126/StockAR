import { PartialType } from '@nestjs/mapped-types';
import { CreatePermisoDto } from './create-permission.dto';

export class UpdatePermisoDto extends PartialType(CreatePermisoDto) {}