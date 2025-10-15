import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleVenta]),
    ProductoModule, //Importar para usar ProductoService
  ],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  exports: [DetalleVentaService], //Exportar para uso en VentaModule
})
export class DetalleVentaModule {}