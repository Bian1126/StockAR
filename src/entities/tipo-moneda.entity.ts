import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Moneda } from './moneda.entity';

@Entity()
export class TipoMoneda {
  @PrimaryGeneratedColumn({ name: 'id_TipoMoneda' })
  idTipoMoneda!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @OneToMany(() => Moneda, moneda => moneda.tipoMoneda)
  monedas!: Moneda[];
}