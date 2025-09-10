import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from '../entities/moneda.entity';
import { MonedaService } from '../moneda/moneda.service';
import { MonedaController } from './moneda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Moneda])],
  providers: [MonedaService],
  controllers: [MonedaController],
  exports: [MonedaService],
})
export class MonedaModule {}