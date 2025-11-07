import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    // Usar transacción para que la creación de la venta, los detalles y la reducción
    // de stock sean atómicos: si algo falla, se revierte todo.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Delega al EmpleadoService (fuera de transacción está bien si es lectura)
      const empleado = await this.empleadoService.findOne(createVentaDto.usuarioId);

      // Crear la venta usando queryRunner
      const venta = queryRunner.manager.create(Venta, {
        fechaHora: new Date(),
        total: 0,
        empleado,
      });
      const savedVenta = await queryRunner.manager.save(venta);

      const detallesCreados: DetalleVenta[] = [];
      let totalVenta = 0;

      if (createVentaDto.detalle?.length > 0) {
        for (const detalleDto of createVentaDto.detalle) {
          // Validar stock y construir detalle (detalleVentaService.createFromVenta usa productoService.findOne)
          const { detalle, subtotal } = await this.detalleVentaService.createFromVenta(
            savedVenta,
            detalleDto.productoId,
            detalleDto.cantidad,
            queryRunner.manager,
          );

          // Guardar detalle dentro de la transacción
          const savedDetalle = await queryRunner.manager.save(detalle);
          detallesCreados.push(savedDetalle);
          totalVenta += subtotal;

          // Reducir stock usando queryRunner para mantener consistencia
          // Intentamos la operación atómica definida en ProductoService (que usa query builder)
          // Para usarla dentro de la transacción, ejecutamos un UPDATE condicional directamente aquí
          const updateResult = await queryRunner.manager
            .createQueryBuilder()
            .update('producto')
            .set({ stock: () => `stock - ${detalleDto.cantidad}` })
            .where('idProducto = :idProducto AND stock >= :cantidad', { idProducto: detalleDto.productoId, cantidad: detalleDto.cantidad })
            .execute();

          if ((updateResult.affected || 0) === 0) {
            // No hay stock suficiente, lanzar excepción para que la transacción haga rollback
            const productoActual = await queryRunner.manager.findOne('producto', { where: { idProducto: detalleDto.productoId } as any });
            const nombre = (productoActual && (productoActual as any).nombre) || detalleDto.productoId;
            throw new BadRequestException(`Stock insuficiente para ${nombre}. Requerido: ${detalleDto.cantidad}`);
          }
        }
      }

      // Actualizar total y commit
      savedVenta.total = totalVenta;
      await queryRunner.manager.save(savedVenta);
      savedVenta.detalles = detallesCreados;

      await queryRunner.commitTransaction();
      return savedVenta;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Error al crear la venta');
    } finally {
      await queryRunner.release();
    }
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
