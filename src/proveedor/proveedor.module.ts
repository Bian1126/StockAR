import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from '../entities/proveedor.entity';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  providers: [ProveedorService],
  controllers: [ProveedorController],
  exports: [ProveedorService],
})
export class ProveedorModule {}