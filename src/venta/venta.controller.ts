import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VentaService } from './venta.service';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto } from '../common/dto/create-venta.dto';
import { UpdateVentaDto } from '../common/dto/update-venta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(@Body() createVentaDto: CreateVentaDto): Promise<Venta> {
    return await this.ventaService.create(createVentaDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Venta | undefined> {
    return await this.ventaService.findOne(Number(id));
  }

  @Get()
  async findAll(): Promise<Venta[]> {
    return await this.ventaService.findAll();
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto): Promise<Venta | null> {
    return await this.ventaService.update(Number(id), updateVentaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ventaService.remove(Number(id));
  }
}