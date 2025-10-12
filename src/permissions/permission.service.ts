import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermisoDto } from '../common/dto/create-permission.dto';
import { UpdatePermisoDto } from '../common/dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permisoRepository: Repository<Permission>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permission> {
    const permiso = this.permisoRepository.create(createPermisoDto as any);
    try {
  const saved: any = await this.permisoRepository.save(permiso);
  if (Array.isArray(saved)) return saved[0] as Permission;
  return saved as Permission;
    } catch (err) {
      // Log and rethrow with more context so the caller (or logs) show the real error
      // eslint-disable-next-line no-console
      console.error('Error saving Permission:', err);
      throw err;
    }
  }

  async findAll(): Promise<Permission[]> {
    return await this.permisoRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<Permission> {
    const permiso = await this.permisoRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return permiso;
  }

  async update(id: number, updatePermisoDto: UpdatePermisoDto): Promise<Permission> {
    const permiso = await this.findOne(id);
    Object.assign(permiso, updatePermisoDto as any);
    return await this.permisoRepository.save(permiso);
  }

  async remove(id: number): Promise<void> {
    const permiso = await this.findOne(id);
    await this.permisoRepository.remove(permiso);
  }
}