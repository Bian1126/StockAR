import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException } from '@nestjs/common';
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
    const moneda = await this.monedaService.findOne(Number(id));
    if (!moneda) throw new NotFoundException('Moneda no encontrada');
    return moneda;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMonedaDto: UpdateMonedaDto) {
    const updated = await this.monedaService.update(Number(id), updateMonedaDto as any);
    if (!updated) throw new NotFoundException('Moneda no encontrada');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const moneda = await this.monedaService.findOne(Number(id));
    if (!moneda) throw new NotFoundException('Moneda no encontrada');
    await this.monedaService.remove(Number(id));
    return { message: 'Moneda eliminada' };
  }

}