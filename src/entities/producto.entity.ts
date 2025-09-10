import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Moneda } from '../entities/moneda.entity';
import { Proveedor } from './proveedor.entity';
import { Usuario } from './usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';


@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  idProducto!: number;

  @Column()
  codigo!: string;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column()
  marca!: string;

  @Column()
  rubro!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioNeto!: number;

  @ManyToOne(() => Moneda, moneda => moneda.productos)
  moneda!: Moneda;

  @Column('decimal', { precision: 5, scale: 2 })
  iva!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ganancia!: number;

  @Column({ default: 0 })
  stock!: number;

  @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  proveedor!: Proveedor;

  @ManyToOne(() => Usuario, usuario => usuario.productos, { nullable: true })
  usuario!: Usuario;

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.producto)
  detalles!: DetalleVenta[];

  constructor(init?: Partial<Producto>) {
    Object.assign(this, init);
  }

  calcularPrecioFinal(): number {
    //CAlculo de precioNeto + IVA + Ganancia
    return (
      this.precioNeto + 
      (this.precioNeto * this.iva) / 100 + 
      (this.precioNeto * this.ganancia) / 100
    );
  }

  actualizarStock(cantidad: number): void {
    this.stock -= cantidad;
  }

} 
