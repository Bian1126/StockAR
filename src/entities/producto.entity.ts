import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Moneda } from './moneda.entity';
import { TipoProducto } from './tipo-producto.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_Producto' })
  idProducto!: number;

  @Column()
  codigo!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column()
  marca!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioNeto!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioVenta!: number;

  @Column('decimal', { precision: 5, scale: 2 })
  iva!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ganancia!: number;

  @Column({ default: 0 })
  stock!: number;

  @ManyToOne(() => TipoProducto, { nullable: false })
  @JoinColumn({ name: 'id_TipoProducto' })
  tipoProducto!: TipoProducto;

  @ManyToOne(() => Moneda, { nullable: false })
  @JoinColumn({ name: 'id_Moneda' })
  moneda!: Moneda;

  constructor(init?: Partial<Producto>) {
    Object.assign(this, init);
  }

}