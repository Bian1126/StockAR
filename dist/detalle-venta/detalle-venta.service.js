"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleVentaService = void 0;
const common_1 = require("@nestjs/common");
const detalle_venta_entity_1 = require("../entities/detalle-venta.entity");
const producto_entity_1 = require("../entities/producto.entity");
let DetalleVentaService = class DetalleVentaService {
    constructor() {
        this.detalles = [];
        this.nextId = 1;
        this.productos = [
            new producto_entity_1.Producto({ idProducto: 1, nombre: 'Producto 1', descripcion: 'Desc', codigo: 'P1', marca: 'Marca', rubro: 'Rubro', precioNeto: 100, moneda: undefined, iva: 21, ganancia: 10, stock: 50, proveedor: undefined, usuario: undefined, detalles: [] }),
            new producto_entity_1.Producto({ idProducto: 2, nombre: 'Producto 2', descripcion: 'Desc', codigo: 'P2', marca: 'Marca', rubro: 'Rubro', precioNeto: 200, moneda: undefined, iva: 21, ganancia: 15, stock: 30, proveedor: undefined, usuario: undefined, detalles: [] })
        ];
    }
    async create(createDetalleVentaDto) {
        const producto = this.productos.find(p => p.idProducto === createDetalleVentaDto.productoId);
        const detalle = new detalle_venta_entity_1.DetalleVenta();
        detalle.idDetalle = this.nextId++;
        detalle.cantidad = createDetalleVentaDto.cantidad;
        detalle.producto = producto;
        detalle.venta = undefined;
        detalle.subtotal = detalle.calcularSubtotal();
        this.detalles.push(detalle);
        return detalle;
    }
    async findAll() {
        return this.detalles;
    }
    async findOne(id) {
        return this.detalles.find(detalle => detalle.idDetalle === id);
    }
    async update(id, detalle) {
        const index = this.detalles.findIndex(d => d.idDetalle === id);
        if (index !== -1) {
            this.detalles[index] = detalle;
            return detalle;
        }
        return null;
    }
    async remove(id) {
        const index = this.detalles.findIndex(d => d.idDetalle === id);
        if (index !== -1) {
            this.detalles.splice(index, 1);
        }
    }
};
DetalleVentaService = __decorate([
    (0, common_1.Injectable)()
], DetalleVentaService);
exports.DetalleVentaService = DetalleVentaService;
