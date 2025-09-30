import { Injectable } from '@nestjs/common';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class DetalleVentaService {
  private readonly detalles: DetalleVenta[] = [];
  private nextId = 1;
  private productos: Producto[] = [
    new Producto({
      idProducto: 1,
      codigo: 'P1',
      nombre: 'Producto 1',
      tipoProducto: 'Repuesto',
      descripcion: 'Desc',
      marca: 'Marca',
      precioNeto: 100,
      precioVenta: 0, // Se calcula
      moneda: undefined,
      iva: 21,
      ganancia: 10,
      stock: 50,
      proveedor: 'Proveedor 1',
      usuario: undefined,
      detalles: []
    }),
    new Producto({
      idProducto: 2,
      codigo: 'P2',
      nombre: 'Producto 2',
      tipoProducto: 'Repuesto',
      descripcion: 'Desc',
      marca: 'Marca',
      precioNeto: 200,
      precioVenta: 0,
      moneda: undefined,
      iva: 21,
      ganancia: 15,
      stock: 30,
      proveedor: 'Proveedor 2',
      usuario: undefined,
      detalles: []
    })
  ];

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const producto = this.productos.find(p => p.idProducto === createDetalleVentaDto.productoId);
    if (!producto) throw new Error('Producto no encontrado');
    if (producto.stock < createDetalleVentaDto.cantidad) throw new Error('Stock insuficiente');
    producto.stock -= createDetalleVentaDto.cantidad;

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

  async findAllForView(): Promise<any[]> {
    // Devuelve los detalles listos para la vista
    return this.detalles.map(detalle => ({
      codigo: detalle.producto?.codigo,
      nombre: detalle.producto?.nombre,
      tipoProducto: detalle.producto?.tipoProducto,
      descripcion: detalle.producto?.descripcion,
      marca: detalle.producto?.marca,
      cantidad: detalle.cantidad,
      precioProducto: detalle.producto?.calcularPrecioFinal(),
      subtotal: detalle.subtotal,
      proveedor: detalle.producto?.proveedor
    }));
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