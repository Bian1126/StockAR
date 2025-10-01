import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { Empleado } from './empleado.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn({ name: 'id_Venta' })
  idVenta!: number;

  @Column()
  fechaHora!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @ManyToOne(() => Empleado, { nullable: false })
  @JoinColumn({ name: 'id_Empleado' }) // FK en Venta
  empleado!: Empleado;

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.venta)
  detalles!: DetalleVenta[];

  constructor(init?: Partial<Venta>) {
    Object.assign(this, init);
    if (!this.detalles) {
      this.detalles = [];
    }
  }
}