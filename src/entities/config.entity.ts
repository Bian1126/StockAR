import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AppConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  key!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;
}