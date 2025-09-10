"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoService = void 0;
const common_1 = require("@nestjs/common");
const producto_entity_1 = require("../entities/producto.entity");
const moneda_entity_1 = require("../entities/moneda.entity");
let ProductoService = class ProductoService {
    constructor() {
        this.productos = [];
        this.monedas = [
            new moneda_entity_1.Moneda({ idMoneda: 1, nombre: 'ARS', cotizacion: 1 }),
            new moneda_entity_1.Moneda({ idMoneda: 2, nombre: 'USD', cotizacion: 350 }),
            new moneda_entity_1.Moneda({ idMoneda: 3, nombre: 'EUR', cotizacion: 380 })
        ];
    }
    async create(createProductoDto) {
        const moneda = this.monedas.find(m => m.idMoneda === createProductoDto.monedaId);
        const producto = new producto_entity_1.Producto({
            ...createProductoDto,
            idProducto: this.productos.length + 1,
            moneda: moneda,
            proveedor: undefined,
            usuario: undefined,
            detalles: []
        });
        this.productos.push(producto);
        return producto;
    }
    findAll() {
        return this.productos;
    }
    findOne(id) {
        return this.productos.find(p => p.idProducto === Number(id));
    }
    remove(id) {
        const index = this.productos.findIndex(p => p.idProducto === Number(id));
        if (index !== -1) {
            this.productos.splice(index, 1);
        }
    }
    async update(id, updateProductoDto) {
        const index = this.productos.findIndex(p => p.idProducto === id);
        if (index !== -1) {
            this.productos[index] = new producto_entity_1.Producto({
                ...this.productos[index],
                ...updateProductoDto
            });
            return this.productos[index];
        }
        return null;
    }
    updateStock(idProducto, cantidad) {
        const producto = this.productos.find(p => p.idProducto === idProducto);
        if (producto) {
            producto.stock += cantidad;
            return producto;
        }
        throw new Error('Producto no encontrado');
    }
    calcularPrecioFinal(idProducto) {
        const producto = this.productos.find(p => p.idProducto === idProducto);
        if (producto) {
            return producto.precioNeto + (producto.precioNeto * producto.iva) / 100 + (producto.precioNeto * producto.ganancia) / 100;
        }
        throw new Error('Producto no encontrado');
    }
};
ProductoService = __decorate([
    (0, common_1.Injectable)()
], ProductoService);
exports.ProductoService = ProductoService;
