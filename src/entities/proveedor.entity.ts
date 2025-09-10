import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Entity()
export class Proveedor {
  @PrimaryGeneratedColumn()
  idProveedor!: number;

  @Column()
  nombre!: string;

  @Column()
  contacto!: string;

  @Column()
  rubro!: string;

  @OneToMany(() => Producto, producto => producto.proveedor)
  productos!: Producto[];

}