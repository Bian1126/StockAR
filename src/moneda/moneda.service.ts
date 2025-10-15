import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moneda } from '../entities/moneda.entity';
import { TipoMoneda } from '../entities/tipo-moneda.entity';
import { CreateMonedaDto } from '../common/dto/create-moneda.dto';

@Injectable()
export class MonedaService {
  constructor(
    @InjectRepository(Moneda)
    private readonly repo: Repository<Moneda>,

    @InjectRepository(TipoMoneda)
    private readonly tipoRepo: Repository<TipoMoneda>,
  ) {}

  async create(data: CreateMonedaDto): Promise<Moneda> {
    const tipo = await this.tipoRepo.findOneBy({ idTipoMoneda: data.tipoMonedaId });
    if (!tipo) throw new NotFoundException('TipoMoneda no encontrado');
    const m = this.repo.create({
      nombre: data.nombre,
      cotizacion: data.cotizacion,
      tipoMoneda: tipo,
    } as Partial<Moneda>);
    return this.repo.save(m);
  }

  findAll() {
    return this.repo.find({ relations: ['tipoMoneda'] });
  }

  async findOne(id: number) {
    const m = await this.repo.findOne({ where: { idMoneda: id }, relations: ['tipoMoneda'] });
    if (!m) throw new NotFoundException('Moneda no encontrada');
    return m;
  }

  async update(id: number, data: Partial<Moneda & { tipoMonedaId?: number }>) {
    const m = await this.findOne(id);
    if ((data as any).tipoMonedaId) {
      const tipo = await this.tipoRepo.findOneBy({ idTipoMoneda: (data as any).tipoMonedaId });
      if (!tipo) throw new NotFoundException('TipoMoneda no encontrado');
      m.tipoMoneda = tipo;
    }
    Object.assign(m, data);
    return this.repo.save(m);
  }

  async remove(id: number) {
    const m = await this.findOne(id);
    return this.repo.remove(m);
  }

  // método que devuelve la cotización numérica (transforma string->number si hace falta)
  async getCotizacion(monedaId: number): Promise<number> {
    const m = await this.findOne(monedaId);
    // TypeORM puede traer 'cotizacion' como string si usás decimal en DB
    return Number((m as any).cotizacion);
  }
}