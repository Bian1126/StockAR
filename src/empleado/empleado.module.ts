import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from '../entities/empleado.entity';
import { Rol } from '../entities/rol.entity';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, Rol])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
 
})
export class EmpleadoModule {}