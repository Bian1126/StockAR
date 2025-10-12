import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { TipoMonedaService } from './tipoMoneda.service';

@Controller('tipo-moneda')
export class TipoMonedaController {
  constructor(private readonly service: TipoMonedaService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
