import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../common/dto/create-rol.dto';
import { UpdateRolDto } from '../common/dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({ relations: ['empleados'] });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { idRol: id }, relations: ['empleados'] });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolRepository.remove(rol);
  }
}