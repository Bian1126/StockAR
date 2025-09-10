import { Injectable } from '@nestjs/common';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto} from '../common/dto/create-venta.dto'
import { UpdateVentaDto} from '../common/dto/update.venta.dto'


@Injectable()
export class VentaService {
  findOne(arg0: number): Venta | PromiseLike<Venta | undefined> | undefined {
    throw new Error('Method not implemented.');
  }
  private ventas: Venta[] = [];
  private nextId = 1;

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const detalles = createVentaDto.detalle.map(d => ({
      ...d,
      subtotal: 0, // Aquí podrías calcular el subtotal si tienes acceso al producto
      producto: undefined, // Aquí deberías buscar el producto real si lo tienes cargado
      venta: undefined 
    }))
    const venta: Venta = {
      idVenta: this.nextId++,
      fecha: new Date(),
      total: 0,
      estado: createVentaDto.estado,
      usuario: undefined as any,
      detalle: detalles,
      calcularTotal: function () {
        return this.detalle?.reduce((sum, d) => sum + d.subtotal, 0) || 0;
      },
      generarPDF: function () {}

    };
    venta.total = venta.calcularTotal();
    this.ventas.push(venta);
    return venta;

    //venta.idVenta = this.nextId++;
    // venta.fecha = new Date();

  }

  async findAll(): Promise<Venta[]> {
    return this.ventas;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta | null> {
    const index = this.ventas.findIndex(v => v.idVenta === id);
    if (index !== -1) {
      this.ventas[index] = new Venta({
        ...this.ventas[index],
        ...updateVentaDto
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

 /*  async findOne(id: string | number): Promise<Venta | undefined> {
    return this.ventas.find(v => v.idVenta === Number(id));
  }*/
}