import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedor.entity';
import { CreateProveedorDto } from '../common/dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../common/dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(createProveedorDto);
    return this.proveedorRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async findOne(id: number): Promise<Proveedor | null> {
    return this.proveedorRepository.findOne({ where: { idProveedor: id } });
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor | null> {
    await this.proveedorRepository.update(id, updateProveedorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> { 
    await this.proveedorRepository.delete(id);
  }
}