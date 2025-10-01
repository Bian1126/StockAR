import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { RolService } from './rol.service';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../common/dto/create-rol.dto';
import { UpdateRolDto } from '../common/dto/update-rol.dto';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return await this.rolService.create(createRolDto);
  }

  @Get()
  async findAll(): Promise<Rol[]> {
    return await this.rolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rol> {
    const rol = await this.rolService.findOne(Number(id));
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto): Promise<Rol> {
    return await this.rolService.update(Number(id), updateRolDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.rolService.remove(Number(id));
  }
}