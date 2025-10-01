import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Empleado } from './empleado.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_Usuario' })
  idUsuario!: number;

  @Column()
  email!: string;

  @Column()
  contraseña!: string;

  @OneToOne(() => Empleado, { nullable: false })
  @JoinColumn({ name: 'id_Empleado' }) // FK en Usuario
  empleado!: Empleado;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}