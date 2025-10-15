import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from '../entities/moneda.entity';
import { TipoMoneda } from '../entities/tipo-moneda.entity';
import { MonedaService } from '../moneda/moneda.service';
import { MonedaController } from './moneda.controller';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Moneda, TipoMoneda])],
  providers: [MonedaService, CotizacionService],
  controllers: [MonedaController, CotizacionController],
  exports: [MonedaService, CotizacionService],
})
export class MonedaModule {}