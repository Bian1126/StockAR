import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermisoDto } from '../common/dto/create-permission.dto';
import { UpdatePermisoDto } from '../common/dto/update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermisoDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermisoDto) {
    return await this.permissionService.update(Number(id), updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.permissionService.remove(Number(id));
  }
}