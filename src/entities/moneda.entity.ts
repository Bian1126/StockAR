import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Entity()
export class Moneda {
  @PrimaryGeneratedColumn()
  idMoneda!: number;

  @Column()
  nombre!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cotizacion!: number;

  @OneToMany(() => Producto, producto => producto.moneda)
  productos!: Producto[];

  constructor(init?: Partial<Moneda>) {
    Object.assign(this, init);
  }

  actualizarCotizacion(nuevaCotizacion: number) {
    this.cotizacion = nuevaCotizacion;
  }
}