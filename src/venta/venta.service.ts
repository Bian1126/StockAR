import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto } from '../common/dto/create-venta.dto';
import { UpdateVentaDto } from '../common/dto/update-venta.dto';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createVentaDto: CreateVentaDto, detallesDto: CreateDetalleVentaDto[]) {
    const venta = this.ventaRepository.create(createVentaDto);
    const savedVenta = await this.ventaRepository.save(venta);

    if (detallesDto?.length > 0) {
      const detalles = detallesDto.map((detalle) =>
        this.detalleVentaRepository.create({ ...detalle, venta: savedVenta }),
      );
      await this.detalleVentaRepository.save(detalles);
      savedVenta.detalles = detalles;
    }

    return savedVenta;
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({ relations: ['detalles', 'detalles.producto'] });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    Object.assign(venta, updateVentaDto);
    return this.ventaRepository.save(venta);
  }

  async remove(id: number): Promise<void> {
    const venta = await this.findOne(id);
    await this.ventaRepository.remove(venta);
  }
}
