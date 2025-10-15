import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { CreateTipoProductoDto } from '../common/dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from '../common/dto/update-tipo-producto.dto';

@Injectable()
export class TipoProductoService {
  constructor(
    @InjectRepository(TipoProducto)
    private readonly tipoProductoRepo: Repository<TipoProducto>,
  ) {}
  
  async create(data: CreateTipoProductoDto): Promise<TipoProducto> {
    const exists = await this.tipoProductoRepo.findOne({ where: { nombre: data.nombre } });
    if (exists) throw new BadRequestException('Ya existe un tipo de producto con ese nombre');
    const tp = this.tipoProductoRepo.create(data as Partial<TipoProducto>);
    return this.tipoProductoRepo.save(tp);
  } 

  async findAll(): Promise<TipoProducto[]> {
    return this.tipoProductoRepo.find({ relations: ['productos'] });
  }
  
  async findOne(id: number): Promise<TipoProducto | null> {
    return this.tipoProductoRepo.findOne({ where: { idTipoProducto: id }, relations: ['productos'] });
  }
  
  async update(id: number, data: UpdateTipoProductoDto): Promise<TipoProducto> {
    const tp = await this.findOne(id);
    if (!tp) throw new NotFoundException('TipoProducto no encontrado');
    const nuevoNombre = (data as any).nombre;
    if (nuevoNombre) {
      const exists = await this.tipoProductoRepo.findOne({ where: { nombre: nuevoNombre } });
      if (exists && exists.idTipoProducto !== id) throw new BadRequestException('Ya existe un tipo de producto con ese nombre');
    }
    Object.assign(tp, data);
    return this.tipoProductoRepo.save(tp);
  }
  
  async remove(id: number): Promise<void> {
   const res = await this.tipoProductoRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('TipoProducto no encontrado');
  }

}
  

