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
exports.MonedaController = void 0;
const common_1 = require("@nestjs/common");
const moneda_service_1 = require("../moneda/moneda.service");
const create_moneda_dto_1 = require("../common/dto/create-moneda.dto");
const update_moneda_dto_1 = require("../common/dto/update-moneda.dto");
let MonedaController = class MonedaController {
    constructor(monedaService) {
        this.monedaService = monedaService;
    }
    async create(createMonedaDto) {
        return this.monedaService.create(createMonedaDto);
    }
    async findAll() {
        return this.monedaService.findAll();
    }
    async findOne(id) {
        return this.monedaService.findOne(Number(id));
    }
    async update(id, updateMonedaDto) {
        return this.monedaService.update(Number(id), updateMonedaDto);
    }
    async remove(id) {
        return this.monedaService.remove(Number(id));
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_moneda_dto_1.CreateMonedaDto]),
    __metadata("design:returntype", Promise)
], MonedaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonedaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonedaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_moneda_dto_1.UpdateMonedaDto]),
    __metadata("design:returntype", Promise)
], MonedaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonedaController.prototype, "remove", null);
MonedaController = __decorate([
    (0, common_1.Controller)('monedas'),
    __metadata("design:paramtypes", [moneda_service_1.MonedaService])
], MonedaController);
exports.MonedaController = MonedaController;
