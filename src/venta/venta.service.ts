import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto, CreateVentaDetalleDto } from '../common/dto/create-venta.dto';
import { UpdateVentaDto } from '../common/dto/update-venta.dto';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { ProductoService } from '../producto/producto.service';
import { EmpleadoService } from '../empleado/empleado.service';
import { DetalleVentaService } from '../detalle-venta/detalle-venta.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    //Usar servicios especializados
    private readonly productoService: ProductoService,
    private readonly empleadoService: EmpleadoService,
    private readonly detalleVentaService: DetalleVentaService,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    //Delega al EmpleadoService
    const empleado = await this.empleadoService.findOne(createVentaDto.usuarioId);

    // Crear la venta
    const venta = this.ventaRepository.create({
      fechaHora: new Date(),
      total: 0, // Se calculará después
      empleado
    });
    const savedVenta = await this.ventaRepository.save(venta);

    // ✅ Procesar detalles usando DetalleVentaService
    if (createVentaDto.detalle?.length > 0) {
      let totalVenta = 0;
      const detallesCreados: DetalleVenta[] = [];

      for (const detalleDto of createVentaDto.detalle) {
        // ✅ DetalleVentaService maneja su propia lógica
        const { detalle, subtotal } = await this.detalleVentaService.createFromVenta(
          savedVenta,
          detalleDto.productoId,
          detalleDto.cantidad
        );
        
        // Guardar detalle
        const savedDetalle = await this.detalleVentaRepository.save(detalle);
        detallesCreados.push(savedDetalle);
        totalVenta += subtotal;

        //ProductoService reduce stock
        await this.productoService.reducirStock(detalleDto.productoId, detalleDto.cantidad);
      }

      // Actualizar total de la venta
      savedVenta.total = totalVenta;
      await this.ventaRepository.save(savedVenta);
      savedVenta.detalles = detallesCreados;
    }

    return savedVenta;
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({ 
      relations: ['empleado', 'detalles'] 
    });
  }
//Antes estaba id y todos se corrigieron por idVenta
  async findOne(idVenta: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { idVenta },
      relations: ['empleado', 'detalles'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${idVenta} no encontrada`);
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
