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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moneda_entity_1 = require("../entities/moneda.entity");
const tipo_moneda_entity_1 = require("../entities/tipo-moneda.entity");
let MonedaService = class MonedaService {
    constructor(repo, tipoRepo) {
        this.repo = repo;
        this.tipoRepo = tipoRepo;
    }
    async create(data) {
        const tipo = await this.tipoRepo.findOneBy({ idTipoMoneda: data.tipoMonedaId });
        if (!tipo)
            throw new common_1.NotFoundException('TipoMoneda no encontrado');
        const m = this.repo.create({
            nombre: data.nombre,
            cotizacion: data.cotizacion,
            tipoMoneda: tipo,
        });
        return this.repo.save(m);
    }
    findAll() {
        return this.repo.find({ relations: ['tipoMoneda'] });
    }
    async findOne(id) {
        const m = await this.repo.findOne({ where: { idMoneda: id }, relations: ['tipoMoneda'] });
        if (!m)
            throw new common_1.NotFoundException('Moneda no encontrada');
        return m;
    }
    async update(id, data) {
        const m = await this.findOne(id);
        if (data.tipoMonedaId) {
            const tipo = await this.tipoRepo.findOneBy({ idTipoMoneda: data.tipoMonedaId });
            if (!tipo)
                throw new common_1.NotFoundException('TipoMoneda no encontrado');
            m.tipoMoneda = tipo;
        }
        Object.assign(m, data);
        return this.repo.save(m);
    }
    async remove(id) {
        const m = await this.findOne(id);
        return this.repo.remove(m);
    }
    // método que devuelve la cotización numérica (transforma string->number si hace falta)
    async getCotizacion(monedaId) {
        const m = await this.findOne(monedaId);
        // TypeORM puede traer 'cotizacion' como string si usás decimal en DB
        return Number(m.cotizacion);
    }
};
MonedaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(moneda_entity_1.Moneda)),
    __param(1, (0, typeorm_1.InjectRepository)(tipo_moneda_entity_1.TipoMoneda)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MonedaService);
exports.MonedaService = MonedaService;
