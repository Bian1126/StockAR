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
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const moneda_entity_1 = require("./moneda.entity");
const tipo_producto_entity_1 = require("./tipo-producto.entity");
let Producto = class Producto {
    constructor(init) {
        Object.assign(this, init);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_Producto' }),
    __metadata("design:type", Number)
], Producto.prototype, "idProducto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Producto.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Producto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Producto.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "precioNeto", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "iva", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "ganancia", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Producto.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_producto_entity_1.TipoProducto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_TipoProducto' }),
    __metadata("design:type", tipo_producto_entity_1.TipoProducto)
], Producto.prototype, "tipoProducto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => moneda_entity_1.Moneda, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Moneda' }),
    __metadata("design:type", moneda_entity_1.Moneda)
], Producto.prototype, "moneda", void 0);
Producto = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Producto);
exports.Producto = Producto;
