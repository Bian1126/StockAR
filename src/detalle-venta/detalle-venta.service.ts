import { Injectable } from '@nestjs/common';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class DetalleVentaService {
  private readonly detalles: DetalleVenta[] = [];
  private nextId = 1;
  private productos: Producto[] = [
    new Producto({ idProducto: 1, nombre: 'Producto 1', descripcion: 'Desc', codigo: 'P1', marca: 'Marca', rubro: 'Rubro', precioNeto: 100, moneda: undefined, iva: 21, ganancia: 10, stock: 50, proveedor: undefined, usuario: undefined, detalles: [] }),
    new Producto({ idProducto: 2, nombre: 'Producto 2', descripcion: 'Desc', codigo: 'P2', marca: 'Marca', rubro: 'Rubro', precioNeto: 200, moneda: undefined, iva: 21, ganancia: 15, stock: 30, proveedor: undefined, usuario: undefined, detalles: [] })
  ];

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const producto = this.productos.find(p => p.idProducto === createDetalleVentaDto.productoId);
    const detalle = new DetalleVenta();
    detalle.idDetalle = this.nextId++;
    detalle.cantidad = createDetalleVentaDto.cantidad;
    detalle.producto = producto;
    detalle.venta = undefined;
    detalle.subtotal = detalle.calcularSubtotal();
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