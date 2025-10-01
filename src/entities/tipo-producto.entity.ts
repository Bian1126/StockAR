import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity()
export class TipoProducto {
  @PrimaryGeneratedColumn({ name: 'id_TipoProducto' })
  idTipoProducto!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @OneToMany(() => Producto, producto => producto.tipoProducto)
  productos!: Producto[];

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.tipoProducto)
  detallesVenta!: DetalleVenta[];
}