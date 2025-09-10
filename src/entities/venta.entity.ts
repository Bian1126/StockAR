import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { DetalleVenta } from '../entities/detalle-venta.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  idVenta!: number;

  @Column()
  fecha!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column()
  estado!: string;

  @ManyToOne(() => Usuario, usuario => usuario.ventas)
  usuario!: Usuario;

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.venta)
  detalle!: DetalleVenta[];
  
  constructor(init?: Partial<Venta>) {
    Object.assign(this, init);
      if (!this.detalle) {
        this.detalle = [];
      }
  }

  calcularTotal(): number {
    // Lógica para calcular el total de la venta sumando los subtotales de los detalles
    return this.detalle.reduce((sum, d) => sum + d.subtotal, 0);
  }

  generarPDF(): void {
    // Lógica para generar el comprobante PDF
  }
}