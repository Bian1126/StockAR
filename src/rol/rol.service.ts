import { Injectable } from '@nestjs/common';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../common/dto/create-rol.dto';
import { UpdateRolDto } from '../common/dto/update-rol.dto';

@Injectable()
export class RolService {
  private readonly roles: Rol[] = [];
  private nextId = 1;

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = { ...createRolDto, id: this.nextId++ } as Rol;
    this.roles.push(rol);
    return rol;
  }

  async findAll(): Promise<Rol[]> {
    return this.roles;
  }

  async findOne(id: number): Promise<Rol | undefined> {
    return this.roles.find(role => role.id === id);
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol | null> {
    const index = this.roles.findIndex(role => role.id === id);
    if (index !== -1) {
      this.roles[index] = { ...this.roles[index], ...updateRolDto };
      return this.roles[index];
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const index = this.roles.findIndex(role => role.id === id);
    if (index !== -1) {
      this.roles.splice(index, 1);
    }
  }
}