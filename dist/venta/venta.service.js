"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaService = void 0;
const common_1 = require("@nestjs/common");
const venta_entity_1 = require("../entities/venta.entity");
const create_venta_dto_1 = require("../common/dto/create-venta.dto");
const detalle_venta_entity_1 = require("../entities/detalle-venta.entity");
let VentaService = class VentaService {
    constructor() {
        this.ventas = [];
        this.nextId = 1;
    }
    async create(crateVentaDto) {
        let detalleId = 1;
        const detalles = create_venta_dto_1.CreateVentaDto.detalle.map((d) => {
            const producto = this.productos.find(p => p.idProducto === d.productoId);
            const detalle = new detalle_venta_entity_1.DetalleVenta({
                idDetalle: detalleId++,
                cantidad: d.cantidad,
                producto: producto,
                venta: undefined,
            });
            detalle.subtotal = detalle.calcularSubtotal();
            return detalle;
        });
        const venta = new venta_entity_1.Venta({
            idVenta: this.nextId++,
            fecha: new Date(),
            estado: undefined,
            detalle: this.detalles,
        });
        venta.total = venta.calcularTotal();
        venta.detalle.forEach(d => (d.venta = venta));
        this.ventas.push(venta);
        return venta;
    }
    async findAll() {
        return this.ventas;
    }
    async findOne(id) {
        return this.ventas.find(v => v.idVenta === id);
    }
    async update(id, updateVentaDto) {
        const index = this.ventas.findIndex(v => v.idVenta === id);
        if (index !== -1) {
            let detalleActualizado = this.ventas[index].detalle;
            if (updateVentaDto.detalle) {
                let detalleId = 1;
                detalleActualizado = updateVentaDto.detalle.map(d => {
                    const producto = this.productos.find(p => p.idProducto === d.productoId);
                    const detalle = new detalle_venta_entity_1.DetalleVenta({
                        idDetalle: detalleId++,
                        cantidad: d.cantidad,
                        producto: producto,
                        venta: this.ventas[index],
                    });
                    detalle.subtotal = detalle.calcularSubtotal();
                    return detalle;
                });
            }
            this.ventas[index] = new venta_entity_1.Venta({
                ...this.ventas[index],
                ...updateVentaDto,
                detalle: detalleActualizado,
            });
            this.ventas[index].total = this.ventas[index].calcularTotal();
            return this.ventas[index];
        }
        return null; // ← Agrega este return final
    }
    async remove(id) {
        this.ventas = this.ventas.filter(v => v.idVenta !== id);
    }
    async generarPDF(venta) {
        // Implementación para generar un PDF de la venta
    }
};
VentaService = __decorate([
    (0, common_1.Injectable)()
], VentaService);
exports.VentaService = VentaService;
