import { Injectable } from '@nestjs/common';
import { Moneda } from '../entities/moneda.entity';

@Injectable()
export class MonedaService {
  private monedas: Moneda[] = [];
  private nextId = 1;

  async create(data: Partial<Moneda>): Promise<Moneda> {
    const moneda = { ...data, idMoneda: this.nextId++ } as Moneda;
    this.monedas.push(moneda);
    return moneda;
  }

  async findAll(): Promise<Moneda[]> {
    return this.monedas;
  }

  async findOne(id: number): Promise<Moneda | undefined> {
    return this.monedas.find(m => m.idMoneda === id);
  }

  async update(id: number, data: Partial<Moneda>): Promise<Moneda | null> {
    const moneda = this.monedas.find(m => m.idMoneda === id);
    if (moneda) {
      Object.assign(moneda, data);
      return moneda;
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const index = this.monedas.findIndex(m => m.idMoneda === id);
    if (index !== -1) {
      this.monedas.splice(index, 1);
    }
  }
}