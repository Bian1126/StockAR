import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../common/dto/create-producto.dto';
import { UpdateProductoDto } from '../common/dto/update-producto.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  async findAll(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto | undefined> {
    return this.productoService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productoService.remove(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto
  ): Promise<Producto> {
    return this.productoService.update(Number(id), updateProductoDto);
  }

  @Patch(':id/stock/:cantidad')
  async updateStock(
    @Param('id') id: string,
    @Param('cantidad') cantidad: string
  ): Promise<Producto> {
    return this.productoService.updateStock(Number(id), Number(cantidad));
  }

  @Get(':id/precio-final')
  async calcularPrecioFinal(@Param('id') id: string): Promise<number> {
    return this.productoService.calcularPrecioFinal(Number(id));
  }
}