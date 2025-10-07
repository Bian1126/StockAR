import { Injectable } from '@nestjs/common';
import { Moneda } from '../entities/moneda.entity';
import { TipoMoneda } from '../entities/tipo-moneda.entity';
import { CreateMonedaDto } from '../common/dto/create-moneda.dto';

@Injectable()
export class MonedaService {
  private tipoMonedas: TipoMoneda[] = [
    { idTipoMoneda: 1, nombre: 'Oficial', descripcion: 'Tipo oficial' } as TipoMoneda,
    { idTipoMoneda: 2, nombre: 'Paralelo', descripcion: 'Tipo paralelo' } as TipoMoneda,
  ];

  private monedas: Moneda[] = [];
  private nextId = 1;

  private findTipoById(id: number): TipoMoneda | undefined {
    return this.tipoMonedas.find(t => t.idTipoMoneda === id);
  }

  async create(data: CreateMonedaDto): Promise<Moneda> {
    const tipo = this.findTipoById(data.tipoMonedaId);
    const moneda: Moneda = new Moneda({
      idMoneda: this.nextId++,
      nombre: data.nombre,
      cotizacion: data.cotizacion,
      tipoMoneda: tipo!,
      productos: [],
    });
    this.monedas.push(moneda);
    return moneda;
  }

  async findAll(): Promise<Moneda[]> {
    return this.monedas;
  }

  async findOne(id: number): Promise<Moneda | undefined> {
    return this.monedas.find(m => m.idMoneda === id);
  }

  async update(id: number, data: Partial<Moneda & { tipoMonedaId?: number }>): Promise<Moneda | null> {
    const moneda = this.monedas.find(m => m.idMoneda === id);
    if (!moneda) return null;
    if (typeof (data as any).tipoMonedaId === 'number') {
      const tipo = this.findTipoById((data as any).tipoMonedaId);
      if (tipo) moneda.tipoMoneda = tipo;
    }
    Object.assign(moneda, data);
    return moneda;
  }

  async remove(id: number): Promise<void> {
    const index = this.monedas.findIndex(m => m.idMoneda === id);
    if (index !== -1) this.monedas.splice(index, 1);
  }
}