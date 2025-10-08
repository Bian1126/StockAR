import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { Moneda } from '../entities/moneda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, TipoProducto, Moneda])],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}