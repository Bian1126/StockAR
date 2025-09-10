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
exports.VentaController = void 0;
const common_1 = require("@nestjs/common");
const venta_service_1 = require("./venta.service");
const create_venta_dto_1 = require("../common/dto/create-venta.dto");
const update_venta_dto_1 = require("../common/dto/update-venta.dto");
let VentaController = class VentaController {
    constructor(ventaService) {
        this.ventaService = ventaService;
    }
    async create(createVentaDto) {
        return await this.ventaService.create(createVentaDto);
    }
    async findOne(id) {
        return await this.ventaService.findOne(Number(id));
    }
    async findAll() {
        return await this.ventaService.findAll();
    }
    async update(id, updateVentaDto) {
        return await this.ventaService.update(Number(id), updateVentaDto);
    }
    async remove(id) {
        return await this.ventaService.remove(Number(id));
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venta_dto_1.CreateVentaDto]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_venta_dto_1.UpdateVentaDto]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "remove", null);
VentaController = __decorate([
    (0, common_1.Controller)('venta'),
    __metadata("design:paramtypes", [venta_service_1.VentaService])
], VentaController);
exports.VentaController = VentaController;
