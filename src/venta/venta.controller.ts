import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from '../common/dto/create-venta.dto';
import { UpdateVentaDto } from '../common/dto/update-venta.dto';

@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  create(@Body() dto: CreateVentaDto) {
    return this.ventaService.create(dto);
  }

  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVentaDto) {
    return this.ventaService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }
}
