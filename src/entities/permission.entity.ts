import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Rol } from './rol.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @ManyToMany(() => Rol, rol => rol.permissions)
  roles!: Rol[];
}