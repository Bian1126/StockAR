import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MonedaService } from '../moneda/moneda.service';
import { CreateMonedaDto } from '../common/dto/create-moneda.dto';
import { UpdateMonedaDto } from '../common/dto/update-moneda.dto';

@Controller('monedas')
export class MonedaController {
  constructor(private readonly monedaService: MonedaService) {}

  @Post()
  async create(@Body() createMonedaDto: CreateMonedaDto) {
    return this.monedaService.create(createMonedaDto);
  }

  @Get()
  async findAll() {
    return this.monedaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.monedaService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMonedaDto: UpdateMonedaDto) {
    return this.monedaService.update(Number(id), updateMonedaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.monedaService.remove(Number(id));
  }
}