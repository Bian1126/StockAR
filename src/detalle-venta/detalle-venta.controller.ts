import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from 'common/dto/update-detalle-venta.dto';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  async create(@Body() createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    return await this.detalleVentaService.create(createDetalleVentaDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DetalleVenta> {
    const detalle = await this.detalleVentaService.findOne(Number(id));
    if (!detalle) throw new NotFoundException(`DetalleVenta no encontrado`);
    return detalle;
  }

  @Get()
  async findAll(): Promise<DetalleVenta[]> {
    return await this.detalleVentaService.findAll();
  }

  @Get('vista/all')
  async findAllForView(): Promise<any[]> {
    return await this.detalleVentaService.findAllForView();
  }
}