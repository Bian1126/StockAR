import { Injectable } from '@nestjs/common';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDetalleDto, CreateVentaDto } from '../common/dto/create-venta.dto';
import { UpdateVentaDto } from '../common/dto/update-venta.dto';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class VentaService {
  private ventas: Venta[] = [];
  private nextId = 1;
  productos: Producto[] = []; // Debe ser inicializado desde ProductoService

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    let detalleId = 1;

    // Buscar producto por ID y descontar stock
    const detalles = createVentaDto.detalle.map((d: CreateVentaDetalleDto) => {
      const producto = this.productos.find(p => p.idProducto === d.productoId); // Buscar por ID
      if (!producto) throw new Error('Producto no encontrado');
      if (producto.stock < d.cantidad) throw new Error('Stock insuficiente');
      producto.stock -= d.cantidad; // Descontar stock

      const detalle = new DetalleVenta({
        idDetalle: detalleId++,
        cantidad: d.cantidad,
        producto: producto,
        venta: undefined,
      });
      detalle.subtotal = detalle.calcularSubtotal();
      return detalle;
    });

    const venta = new Venta({
      idVenta: this.nextId++,
      fecha: new Date(),
      estado: 'Registrada',
      detalle: detalles,
    });
    venta.total = venta.calcularTotal();
    venta.detalle.forEach(d => (d.venta = venta));
    this.ventas.push(venta);
    return venta;
  }

  async findAll(): Promise<Venta[]> {
    return this.ventas;
  }

  async findOne(id: number): Promise<Venta | undefined> {
    return this.ventas.find(v => v.idVenta === id);
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta | null> {
    const index = this.ventas.findIndex(v => v.idVenta === id);

    if (index !== -1) {
      let detalleActualizado: DetalleVenta[] = this.ventas[index].detalle;

      if (updateVentaDto.detalle) {
        let detalleId = 1;
        detalleActualizado = updateVentaDto.detalle.map(d => {
          const producto = this.productos.find(p => p.idProducto === d.productoId);
          if (!producto) throw new Error('Producto no encontrado');
          if (producto.stock < d.cantidad) throw new Error('Stock insuficiente');
          producto.stock -= d.cantidad;

          const detalle = new DetalleVenta({
            idDetalle: detalleId++,
            cantidad: d.cantidad,
            producto: producto,
            venta: this.ventas[index],
          });
          detalle.subtotal = detalle.calcularSubtotal();
          return detalle;
        });
      }

      this.ventas[index] = new Venta({
        ...this.ventas[index],
        ...updateVentaDto,
        detalle: detalleActualizado,
      });
      this.ventas[index].total = this.ventas[index].calcularTotal();
      return this.ventas[index];
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    this.ventas = this.ventas.filter(v => v.idVenta !== id);
  }

  async generarPDF(venta: Venta): Promise<void> {
    // Implementación para generar un PDF de la venta
  }
}