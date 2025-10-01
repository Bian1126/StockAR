import { BadRequestException, Injectable } from '@nestjs/common';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { CreateTipoProductoDto } from 'common/dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from 'common/dto/update-tipo-producto.dto';

@Injectable()
export class TipoProductoService {
  private tipoProductos: TipoProducto[] = [];
  private nextId = 1;

  // Crea un nuevo tipo de producto con nombre y descripción.
  async create(data: Partial<TipoProducto>): Promise<TipoProducto> {
    // Validación de nombre repetido
    if (this.tipoProductos.some(tp => tp.nombre.toLowerCase() === data.nombre?.toLocaleLowerCase())){
        throw new BadRequestException('Ya existe un tipo de producto con ese nombre');
    }
    const tipoProducto = new TipoProducto();
    tipoProducto.idTipoProducto = this.nextId++;
    tipoProducto.nombre = data.nombre!;
    tipoProducto.descripcion = data.descripcion!;
    tipoProducto.productos = [];
    tipoProducto.detallesVenta = [];
    this.tipoProductos.push(tipoProducto);
    return tipoProducto;
  }

  // devuelve todos los tipos de productos.
  async findAll(): Promise<TipoProducto[]> {
    return this.tipoProductos;
  }

  // busca un tipo de producto por su ID:
  async findOne(id: number): Promise<TipoProducto | undefined> {
    return this.tipoProductos.find(tp => tp.idTipoProducto === id);
  }

  // permite modificar nombre y descripción.
  async update(id: number, data: Partial<TipoProducto>): Promise<TipoProducto | null> {
    const tipoProducto = await this.findOne(id);
    if (!tipoProducto) return null;
    // Validacion de nombre repetido (si se cambia el nombre)
    if (data.nombre && this.tipoProductos.some(tp => tp.nombre.toLowerCase() === data.nombre!.toLocaleLowerCase() && tp.idTipoProducto !== id)){
        throw new BadRequestException('Ya existe un tipo de producto con ese nombre');
    }
    tipoProducto.nombre = data.nombre ?? tipoProducto.nombre;
    tipoProducto.descripcion = data.descripcion ?? tipoProducto.descripcion;
    return tipoProducto;
  }

  // elimina un tipo de producto por su ID.
  async remove(id: number): Promise<void> {
    this.tipoProductos = this.tipoProductos.filter(tp => tp.idTipoProducto !== id);
  }
}