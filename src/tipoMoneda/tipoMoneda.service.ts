import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMoneda } from '../entities/tipo-moneda.entity';

@Injectable()
export class TipoMonedaService {
  constructor(
    @InjectRepository(TipoMoneda)
    private readonly repo: Repository<TipoMoneda>,
  ) {}

  async create(data: Partial<TipoMoneda>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const e = await this.repo.findOneBy({ idTipoMoneda: id });
    if (!e) throw new NotFoundException('TipoMoneda not found');
    return e;
  }

  async update(id: number, data: Partial<TipoMoneda>) {
    const entity = await this.findOne(id);
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    return this.repo.remove(entity);
  }
}
