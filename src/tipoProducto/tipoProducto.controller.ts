import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { TipoProductoService } from './tipoProducto.service';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { CreateTipoProductoDto } from '../common/dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from '../common/dto/update-tipo-producto.dto';

@Controller('tipo-producto')
export class TipoProductoController {
  constructor(private readonly tipoProductoService: TipoProductoService) {}

  @Post()
  async create(@Body() data: CreateTipoProductoDto): Promise<TipoProducto> {
    return await this.tipoProductoService.create(data);
  }

  @Get()
  async findAll(): Promise<TipoProducto[]> {
    return await this.tipoProductoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TipoProducto> {
    const tipoProducto = await this.tipoProductoService.findOne(Number(id));
    if (!tipoProducto) throw new NotFoundException('TipoProducto no encontrado');
    return tipoProducto;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTipoProductoDto): Promise<TipoProducto | null> {
    return await this.tipoProductoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tipoProductoService.remove(Number(id));
  }
}