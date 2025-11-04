import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from '../common/dto/update-detalle-venta.dto';
import { ProductoService } from '../producto/producto.service';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    
    //Usar ProductoService en lugar de repositorio directo
    private readonly productoService: ProductoService,
  ) {}

  //Método para crear detalle desde venta (uso interno)
  async createFromVenta(
    venta: any,
    productoId: number,
    cantidad: number,
    manager?: EntityManager,
  ): Promise<{ detalle: DetalleVenta; subtotal: number }> {
    // Obtener producto: si nos pasan un EntityManager (ej. queryRunner.manager) lo usamos
    let producto: Producto | null = null;
    if (manager) {
      producto = await manager.findOne(Producto, { where: { idProducto: productoId }, relations: ['tipoProducto', 'moneda'] as any });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      if ((producto.stock ?? 0) < cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}, requerido: ${cantidad}`);
      }
    } else {
      // Lectura fuera de transacción usando el servicio existente
      producto = await this.productoService.findOne(productoId);
      await this.productoService.validarStock(productoId, cantidad);
    }

    //Calcular subtotal (lógica de DetalleVenta)
    const subtotal = this.calcularSubtotal((producto as any).precioVenta, cantidad);

    //Crear detalle
    const detalle = Object.assign(new DetalleVenta(), {
      cantidad,
      subtotal,
      producto: producto as any,
      venta,
    });

    return { detalle, subtotal };
  }

  //Lógica de negocio: calcular subtotal
  private calcularSubtotal(precioUnitario: number, cantidad: number): number {
    return precioUnitario * cantidad;
  }

  async create(dto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    //Este método se mantiene para uso directo del API
    throw new BadRequestException('Use createFromVenta para crear detalles desde ventas');
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({ relations: ['venta', 'producto'] });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalle = await this.detalleVentaRepository.findOne({
      where: { idDetalle: id }, //Usar el campo correcto
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
