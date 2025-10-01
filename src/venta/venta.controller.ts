import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DetalleVentaService } from '../detalle-venta/detalle-venta.service';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from '../common/dto/update-detalle-venta.dto';

@Controller('detalle-ventas')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  create(@Body() dto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(dto);
  }

  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleVentaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleVentaService.remove(+id);
  }
}
