import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Empleado } from './empleado.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_Rol' })
  idRol!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @OneToMany(() => Empleado, empleado => empleado.rol)
  empleados!: Empleado[];

  constructor(init?: Partial<Rol>) {
    Object.assign(this, init);
  }

}