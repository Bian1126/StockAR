import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { Producto } from './producto.entity';

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn({ name: 'id_DetalleVenta'})
  idDetalle!: number;

  @Column({default: 0 })
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal!: number;

  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'id_Producto' }) 
  producto!: Producto;

  @ManyToOne(() => Venta, venta => venta.detalles, { nullable: false })
  @JoinColumn({ name: 'id_Venta' }) 
  venta!: Venta;

  constructor(init?: Partial<DetalleVenta>) {
    Object.assign(this, init);
  }
}
