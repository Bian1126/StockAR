import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Venta } from '../entities/venta.entity';

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  idDetalle!: number;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => Producto, producto => producto.detalles)
  producto?: Producto;

  @ManyToOne(() => Venta, venta => venta.detalle)
  venta!: Venta;

  calcularSubtotal(): number {
    return this.cantidad * (this.producto ? this.producto.calcularPrecioFinal() : 0);
  }
}
