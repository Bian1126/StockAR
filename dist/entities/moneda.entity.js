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
exports.Moneda = void 0;
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("../entities/producto.entity");
let Moneda = class Moneda {
    constructor(init) {
        Object.assign(this, init);
    }
    actualizarCotizacion(nuevaCotizacion) {
        this.cotizacion = nuevaCotizacion;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Moneda.prototype, "idMoneda", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Moneda.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Moneda.prototype, "cotizacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => producto_entity_1.Producto, producto => producto.moneda),
    __metadata("design:type", Array)
], Moneda.prototype, "productos", void 0);
Moneda = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Moneda);
exports.Moneda = Moneda;
