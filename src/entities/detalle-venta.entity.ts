import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Venta } from '../entities/venta.entity';

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  idDetalle!: number;

  @Column({default: 0 })
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal!: number;
  
  @ManyToOne(() => Producto, producto => producto.detalles)
  producto!: Producto;

  @ManyToOne(() => Venta, venta => venta.detalle)
  venta?: Venta;

  constructor(init?: Partial<DetalleVenta>) {
    Object.assign(this, init);
  }

  calcularSubtotal(): number {
    this.subtotal = this.cantidad * (this.producto?.calcularPrecioFinal() ?? 0);
    return this.subtotal;
  }
}
