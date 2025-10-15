import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../common/dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from '../common/dto/update-detalle-venta.dto';
import { ProductoService } from '../producto/producto.service';

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
    cantidad: number
  ): Promise<{ detalle: DetalleVenta, subtotal: number }> {
    
    //Validar y obtener producto usando ProductoService
    const producto = await this.productoService.findOne(productoId);
    await this.productoService.validarStock(productoId, cantidad);
    
    //Calcular subtotal (lógica de DetalleVenta)
    const subtotal = this.calcularSubtotal(producto.precioVenta, cantidad);
    
    //Crear detalle
    const detalle = this.detalleVentaRepository.create({
      cantidad,
      subtotal,
      producto,
      venta
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
