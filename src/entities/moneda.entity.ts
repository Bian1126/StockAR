import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { TipoMoneda } from './tipo-moneda.entity';

@Entity()
export class Moneda {
  @PrimaryGeneratedColumn({ name: 'id_Moneda' })
  idMoneda!: number;

  @Column()
  nombre!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cotizacion!: number;

  @ManyToOne(() => TipoMoneda, { nullable: false })
  @JoinColumn({ name: 'id_TipoMoneda' })
  tipoMoneda!: TipoMoneda;

  @OneToMany(() => Producto, producto => producto.moneda)
  productos!: Producto[];

  constructor(init?: Partial<Moneda>) {
    Object.assign(this, init);
  }

}