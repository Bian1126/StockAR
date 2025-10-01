import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Usuario } from './usuario.entity';
import { Venta } from './venta.entity';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn({ name: 'id_Empleado' })
  idEmpleado!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @ManyToOne(() => Rol, rol => rol.empleados, { nullable: false })
  @JoinColumn({ name: 'id_Rol' }) // Personaliza el nombre de la FK
  rol!: Rol;

  @OneToOne(() => Usuario, usuario => usuario.empleado)
  usuario!: Usuario;

  @OneToMany(() => Venta, venta => venta.empleado)
  ventas!: Venta[];
}