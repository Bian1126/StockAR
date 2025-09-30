import { Injectable } from '@nestjs/common';
import { Producto } from '../entities/producto.entity';
import { UpdateProductoDto } from '../common/dto/update-producto.dto';
import { Moneda } from '../entities/moneda.entity';
import { CreateProductoDto } from '../common/dto/create-producto.dto';

@Injectable()
export class ProductoService {
  private productos: Producto[] = [];
  private monedas: Moneda[] = [
    new Moneda({ idMoneda: 1, nombre: 'ARS', cotizacion: 1 }),
    new Moneda({ idMoneda: 2, nombre: 'USD', cotizacion: 350 }),
    new Moneda({ idMoneda: 3, nombre: 'EUR', cotizacion: 380 })
  ];

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const moneda = this.monedas.find(m => m.idMoneda === createProductoDto.monedaId);
    const producto = new Producto({
      ...createProductoDto,
      idProducto: this.productos.length + 1,
      moneda: moneda,
      detalles: [],
      usuario: undefined,
      precioVenta: (
        createProductoDto.precioNeto +
        (createProductoDto.precioNeto * createProductoDto.iva) / 100 +
        (createProductoDto.precioNeto * createProductoDto.ganancia) / 100
      ),
      stock: createProductoDto.stock // inicializa el stock
    });
    this.productos.push(producto);
    return producto;
  }

  findAll(): Producto[] {
    return this.productos;
  }

  findOne(id: string | number): Producto | undefined {
    return this.productos.find(p => p.idProducto === Number(id));
  }

  remove(id: string | number): void {
    const index = this.productos.findIndex(p => p.idProducto === Number(id));
    if (index !== -1) {
      this.productos.splice(index, 1);
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto | null> {
    const index = this.productos.findIndex(p => p.idProducto === id);
    if (index !== -1) {
      // Permite modificar stock sumando/restando cantidad
      let nuevoStock = this.productos[index].stock;
      if (typeof updateProductoDto.stock === 'number') {
        nuevoStock = updateProductoDto.stock;
      }
      this.productos[index] = new Producto({
        ...this.productos[index],
        ...updateProductoDto,
        stock: nuevoStock
      });
      return this.productos[index];
    }
    return null;
  }

  updateStock(idProducto: number, cantidad: number): Producto {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (producto) {
      producto.stock += cantidad; // suma o resta stock
      return producto;
    }
    throw new Error('Producto no encontrado');
  }

  calcularPrecioFinal(idProducto: number): number {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (producto) {
      return producto.precioNeto + (producto.precioNeto * producto.iva) / 100 + (producto.precioNeto * producto.ganancia) / 100;
    }
    throw new Error('Producto no encontrado');
  }
}