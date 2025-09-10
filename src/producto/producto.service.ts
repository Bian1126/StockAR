import { Injectable } from '@nestjs/common';
import { Producto } from '../entities/producto.entity';
import { UpdateProductoDto } from 'common/dto';


@Injectable()
export class ProductoService {
  update(arg0: number, updateProductoDto: UpdateProductoDto): Producto | PromiseLike<Producto> {
    throw new Error('Method not implemented.');
  }
  private productos: Producto[] = [];

  create(producto: Producto): Producto {
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

  updateStock(idProducto: number, cantidad: number): Producto {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (producto) {
      producto.stock += cantidad;
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