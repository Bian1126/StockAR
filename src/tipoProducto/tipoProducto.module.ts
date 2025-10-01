import { Module } from '@nestjs/common';
import { TipoProductoController } from './tipoProducto.controller';
import { TipoProductoService } from './tipoProducto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProducto } from '../entities/tipo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoProducto])],
  controllers: [TipoProductoController],
  providers: [TipoProductoService],
  exports: [TipoProductoService],
})
export class TipoProductoModule {}