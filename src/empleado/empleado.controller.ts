import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from '../entities/empleado.entity';
import { CreateEmpleadoDto } from '../common/dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../common/dto/update-empleado.dto';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async create(@Body() data: CreateEmpleadoDto): Promise<Empleado> {
    return await this.empleadoService.create(data);
  }

  @Get()
  async findAll(): Promise<Empleado[]> {
    return await this.empleadoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Empleado> {
    const empleado = await this.empleadoService.findOne(Number(id));
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEmpleadoDto): Promise<Empleado> {
    return await this.empleadoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.empleadoService.remove(Number(id));
  }
}