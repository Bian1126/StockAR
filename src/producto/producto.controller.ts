import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../common/dto/create-producto.dto';
import { UpdateProductoDto } from '../common/dto/update-producto.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(@Body() data: CreateProductoDto): Promise<Producto> {
    return await this.productoService.create(data);
  }

  @Get()
  async findAll(): Promise<Producto[]> {
    return await this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto> {
    const producto = await this.productoService.findOne(Number(id));
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductoDto): Promise<Producto> {
    return await this.productoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.productoService.remove(Number(id));
  }
}