import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { Moneda } from '../entities/moneda.entity';
import { CreateProductoDto } from '../common/dto/create-producto.dto';
import { UpdateProductoDto } from '../common/dto/update-producto.dto';
import { CotizacionService } from '../moneda/cotizacion.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(TipoProducto)
    private readonly tipoProductoRepository: Repository<TipoProducto>,
    @InjectRepository(Moneda)
    private readonly monedaRepository: Repository<Moneda>,
    private readonly cotizacionService: CotizacionService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateProductoDto): Promise<any> {
    const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
    if (!tipoProducto) throw new BadRequestException('Tipo de producto no encontrado');
    const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda }, relations: ['tipoMoneda'] });
    if (!moneda) throw new BadRequestException('Moneda no encontrada');

    // Ganancia: si viene en body la usamos; si no, usamos la de config
    const ganancia = typeof data.ganancia === 'number' ? Number(data.ganancia) : Number(await this.configService.get('ganancia_default'));
    const iva = typeof data.iva === 'number' ? Number(data.iva) : 21; // 21% por defecto

    // Obtener cotización si la moneda es USD
    let cot = 1;
    if (moneda.nombre?.toLowerCase().includes('dolar') || moneda.tipoMoneda.nombre?.toLowerCase().includes('dolar')) {
      try{
        cot = await this.cotizacionService.getUsdOfficialVenta();

      } catch(err) {

        // fallback: Si la entidad moneda tiene cotizacion guardada
        const stored = Number((moneda as any).cotizacion);
        if (stored && !isNaN(stored) && stored > 0) {
          cot = stored;
          // opcional: log.warn('Cotizacion externa falló, usando moneda.cotizacion');
        } else {

        } // no hay fallback: lanzar un error claro para el cliente
        throw new BadRequestException('No se pudo obtener la cotización del Dólar. Intente más tarde.');
      }
    }

    const precioCompra = Number(data.precioNeto ?? 0);
    const cantidad = Number(data.stock ?? 1);
    
    // Calculos
    const costoARS = precioCompra * cot;
    const precioVentaUnitarioSinIva = costoARS * (1 + ganancia / 100);
    const precioVentaUnitarioConIva = precioVentaUnitarioSinIva * (1 + iva / 100);
    const precioVentaTotalConIva = precioVentaUnitarioConIva * cantidad;
    
    const producto = this.productoRepository.create({
      ...data,
      tipoProducto,
      moneda,
      precioNeto: Number(costoARS.toFixed(2)),               // costo en ARS
      precioVenta: Number(precioVentaUnitarioSinIva.toFixed(2)), // unitario sin IVA
      iva,
      ganancia,
    });
    
    const saved = await this.productoRepository.save(producto);
    // devolver también los valores con IVA para que el front los muestre inmediatamente
    return {
      ...saved,
      precioVentaUnitarioConIva: Number(precioVentaUnitarioConIva.toFixed(2)),
      precioVentaTotalConIva: Number(precioVentaTotalConIva.toFixed(2)),
      cotizacionUsada: cot,
    } as any;
  }
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({ relations: ['tipoProducto', 'moneda'] });
  }

  async findOne(id: number): Promise<any> {
  const producto = await this.productoRepository.findOne({ where: { idProducto: id }, relations: ['tipoProducto', 'moneda'] });
  if (!producto) throw new NotFoundException('Producto no encontrado');

  const precioUnitSinIva = Number(producto.precioVenta);
  const unitConIva = precioUnitSinIva * (1 + Number(producto.iva) / 100);

  return {
    ...producto,
    precioVentaUnitarioConIva: Number(unitConIva.toFixed(2)),
    // si querés total por stock o por cantidad, multiplicar por producto.stock
    precioVentaTotalConIva: Number((unitConIva * (producto.stock ?? 1)).toFixed(2)),
  };
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