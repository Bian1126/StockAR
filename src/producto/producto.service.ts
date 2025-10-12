import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { Moneda } from '../entities/moneda.entity';
import { CreateProductoDto } from '../common/dto/create-producto.dto';
import { UpdateProductoDto } from '../common/dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(TipoProducto)
    private readonly tipoProductoRepository: Repository<TipoProducto>,
    @InjectRepository(Moneda)
    private readonly monedaRepository: Repository<Moneda>,
  ) {}

  async create(data: CreateProductoDto): Promise<Producto> {
    const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
    if (!tipoProducto) throw new BadRequestException('Tipo de producto no encontrado');
    const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda } });
    if (!moneda) throw new BadRequestException('Moneda no encontrada');

    const producto = this.productoRepository.create({
      ...data,
      tipoProducto,
      moneda,
    });
    return await this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({ relations: ['tipoProducto', 'moneda'] });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { idProducto: id }, relations: ['tipoProducto', 'moneda'] });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async update(id: number, data: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    if (data.idTipoProducto) {
      const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
      if (!tipoProducto) throw new BadRequestException('Tipo de producto no encontrado');
      producto.tipoProducto = tipoProducto;
    }
    if (data.idMoneda) {
      const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda } });
      if (!moneda) throw new BadRequestException('Moneda no encontrada');
      producto.moneda = moneda;
    }
    Object.assign(producto, data);
    return await this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  // Métodos para manejo de ventas
  async validarStock(idProducto: number, cantidadRequerida: number): Promise<void> {
    const producto = await this.findOne(idProducto);
    if (producto.stock < cantidadRequerida) {
      throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}, requerido: ${cantidadRequerida}`);
    }
  }

  async reducirStock(idProducto: number, cantidad: number): Promise<void> {
    const producto = await this.findOne(idProducto);
    producto.stock -= cantidad;
    await this.productoRepository.save(producto);
  }

  async aumentarStock(idProducto: number, cantidad: number): Promise<void> {
    const producto = await this.findOne(idProducto);
    producto.stock += cantidad;
    await this.productoRepository.save(producto);
  }
}