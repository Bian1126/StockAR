import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { DetalleVentaModule } from '../detalle-venta/detalle-venta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta]),
    DetalleVentaModule,
  ],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}