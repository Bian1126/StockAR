import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios!: Usuario[];

  constructor(init?: Partial<Rol>) {
    Object.assign(this, init);
  }

  // Ver si van o no
  setNombre(nombre: string) {
    this.nombre = nombre;
  }

  getNombre(): string {
    return this.nombre;
  }

  setDescripcion(descripcion: string) {
    this.descripcion = descripcion;
  }

  getDescripcion(): string {
    return this.descripcion;
  }
}