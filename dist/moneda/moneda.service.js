"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaService = void 0;
const common_1 = require("@nestjs/common");
let MonedaService = class MonedaService {
    constructor() {
        this.monedas = [];
        this.nextId = 1;
    }
    async create(data) {
        const moneda = { ...data, idMoneda: this.nextId++ };
        this.monedas.push(moneda);
        return moneda;
    }
    async findAll() {
        return this.monedas;
    }
    async findOne(id) {
        return this.monedas.find(m => m.idMoneda === id);
    }
    async update(id, data) {
        const moneda = this.monedas.find(m => m.idMoneda === id);
        if (moneda) {
            Object.assign(moneda, data);
            return moneda;
        }
        return null;
    }
    async remove(id) {
        const index = this.monedas.findIndex(m => m.idMoneda === id);
        if (index !== -1) {
            this.monedas.splice(index, 1);
        }
    }
};
MonedaService = __decorate([
    (0, common_1.Injectable)()
], MonedaService);
exports.MonedaService = MonedaService;
