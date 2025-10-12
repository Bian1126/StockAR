import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMoneda } from '../entities/tipo-moneda.entity';
import { TipoMonedaService } from './tipoMoneda.service';
import { TipoMonedaController } from './tipoMoneda.controller';

@Module({
	imports: [TypeOrmModule.forFeature([TipoMoneda])],
	controllers: [TipoMonedaController],
	providers: [TipoMonedaService],
    exports: [TipoMonedaService],
})
export class TipoMonedaModule {}
