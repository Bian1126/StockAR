import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { Producto } from '../entities/producto.entity';
import { Venta } from '../entities/venta.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  idUsuario!: number;

  @Column()
  nombre!: string;

  @Column()
  email!: string;

  @Column()
  contraseña!: string;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  rol!: Rol;

  @OneToMany(() => Producto, producto => producto.usuario)
  productos!: Producto[];

  @OneToMany(() => Venta, venta => venta.usuario)
  ventas!: Venta[];

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
  
  // Despues ver
  login(): boolean {
    // Lógica de autenticación aquí
    return true;
  }

  logout(): void {
    // Lógica de cierre de sesión aquí
  }
}