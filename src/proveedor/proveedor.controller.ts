import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from '../common/dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../common/dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  async create(@Body() createProveedorDto: CreateProveedorDto) {
    return await this.proveedorService.create(createProveedorDto);
  }

  @Get()
  async findAll() {
    return await this.proveedorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.proveedorService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return await this.proveedorService.update(+id, updateProveedorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.proveedorService.remove(+id);
  }
}