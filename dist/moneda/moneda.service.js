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
const moneda_entity_1 = require("../entities/moneda.entity");
let MonedaService = class MonedaService {
    constructor() {
        this.tipoMonedas = [
            { idTipoMoneda: 1, nombre: 'Oficial', descripcion: 'Tipo oficial' },
            { idTipoMoneda: 2, nombre: 'Paralelo', descripcion: 'Tipo paralelo' },
        ];
        this.monedas = [];
        this.nextId = 1;
    }
    findTipoById(id) {
        return this.tipoMonedas.find(t => t.idTipoMoneda === id);
    }
    async create(data) {
        const tipo = this.findTipoById(data.tipoMonedaId);
        const moneda = new moneda_entity_1.Moneda({
            idMoneda: this.nextId++,
            nombre: data.nombre,
            cotizacion: data.cotizacion,
            tipoMoneda: tipo,
            productos: [],
        });
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
        if (!moneda)
            return null;
        if (typeof data.tipoMonedaId === 'number') {
            const tipo = this.findTipoById(data.tipoMonedaId);
            if (tipo)
                moneda.tipoMoneda = tipo;
        }
        Object.assign(moneda, data);
        return moneda;
    }
    async remove(id) {
        const index = this.monedas.findIndex(m => m.idMoneda === id);
        if (index !== -1)
            this.monedas.splice(index, 1);
    }
};
MonedaService = __decorate([
    (0, common_1.Injectable)()
], MonedaService);
exports.MonedaService = MonedaService;
