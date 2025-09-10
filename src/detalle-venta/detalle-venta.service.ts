import { Injectable } from '@nestjs/common';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from 'common/dto/update-detalle-venta.dto';

@Injectable()
export class DetalleVentaService {
  private readonly detalles: DetalleVenta[] = [];
  private nextId = 1;

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const detalle = new DetalleVenta();
    detalle.idDetalle = this.nextId++;
    detalle.cantidad = createDetalleVentaDto.cantidad;
    detalle.productoId =  createDetalleVentaDto.productoId;
    detalle.ventaId = createDetalleVentaDto.ventaId;
    detalle.subtotal = 0;
    this.detalles.push(detalle);
    return detalle;
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalles;
  }

  async findOne(id: number): Promise<DetalleVenta | undefined> {
    return this.detalles.find(detalle => detalle.idDetalle === id);
  }

  async update(id: number, detalle: DetalleVenta): Promise<DetalleVenta | null> {
    const index = this.detalles.findIndex(d => d.idDetalle === id);
    if (index !== -1) {
      this.detalles[index] = detalle;
      return detalle;
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const index = this.detalles.findIndex(d => d.idDetalle === id);
    if (index !== -1) {
      this.detalles.splice(index, 1);
    }
  }
}