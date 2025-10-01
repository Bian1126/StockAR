import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from '../common/dto/update-detalle-venta.dto';
import { Venta } from '../entities/venta.entity';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(dto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const venta = await this.ventaRepository.findOne({ where: { id: dto.ventaId } });
    const producto = await this.productoRepository.findOne({ where: { id: dto.productoId } });

    if (!venta) throw new NotFoundException(`Venta con id ${dto.ventaId} no encontrada`);
    if (!producto) throw new NotFoundException(`Producto con id ${dto.productoId} no encontrado`);

    const detalle = this.detalleVentaRepository.create({
      cantidad: dto.cantidad,
      venta,
      producto,
    });

    return this.detalleVentaRepository.save(detalle);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({ relations: ['venta', 'producto'] });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalle = await this.detalleVentaRepository.findOne({
      where: { id },
      relations: ['venta', 'producto'],
    });

    if (!detalle) {
      throw new NotFoundException(`DetalleVenta con id ${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: number, dto: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const detalle = await this.findOne(id);
    Object.assign(detalle, dto);
    return this.detalleVentaRepository.save(detalle);
  }

  async remove(id: number): Promise<void> {
    const detalle = await this.findOne(id);
    await this.detalleVentaRepository.remove(detalle);
  }
}
