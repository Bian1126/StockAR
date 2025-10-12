"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleVenta = void 0;
const typeorm_1 = require("typeorm");
const venta_entity_1 = require("../entities/venta.entity");
const producto_entity_1 = require("./producto.entity");
let DetalleVenta = class DetalleVenta {
    constructor(init) {
        Object.assign(this, init);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_DetalleVenta' }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "idDetalle", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Producto' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleVenta.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, venta => venta.detalles, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Venta' }),
    __metadata("design:type", venta_entity_1.Venta)
], DetalleVenta.prototype, "venta", void 0);
DetalleVenta = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DetalleVenta);
exports.DetalleVenta = DetalleVenta;
