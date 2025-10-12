import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Permission } from './permission.entity';

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

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'rol_permissions' })
  permissions!: Permission[];

  constructor(init?: Partial<Rol>) {
    Object.assign(this, init);
  }

}