import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../entities/venta.entity';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { ProductoModule } from '../producto/producto.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { DetalleVentaModule } from '../detalle-venta/detalle-venta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
    ProductoModule,
    EmpleadoModule,
    DetalleVentaModule, //Importar DetalleVentaModule
  ],
  controllers: [VentaController],
  providers: [VentaService],
  exports: [VentaService],
})
export class VentaModule {}