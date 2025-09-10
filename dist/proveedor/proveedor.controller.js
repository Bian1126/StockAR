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
exports.ProveedorController = void 0;
const common_1 = require("@nestjs/common");
const proveedor_service_1 = require("./proveedor.service");
const create_proveedor_dto_1 = require("../common/dto/create-proveedor.dto");
const update_proveedor_dto_1 = require("../common/dto/update-proveedor.dto");
let ProveedorController = class ProveedorController {
    constructor(proveedorService) {
        this.proveedorService = proveedorService;
    }
    async create(createProveedorDto) {
        return await this.proveedorService.create(createProveedorDto);
    }
    async findAll() {
        return await this.proveedorService.findAll();
    }
    async findOne(id) {
        return await this.proveedorService.findOne(+id);
    }
    async update(id, updateProveedorDto) {
        return await this.proveedorService.update(+id, updateProveedorDto);
    }
    async remove(id) {
        return await this.proveedorService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proveedor_dto_1.CreateProveedorDto]),
    __metadata("design:returntype", Promise)
], ProveedorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProveedorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProveedorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_proveedor_dto_1.UpdateProveedorDto]),
    __metadata("design:returntype", Promise)
], ProveedorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProveedorController.prototype, "remove", null);
ProveedorController = __decorate([
    (0, common_1.Controller)('proveedores'),
    __metadata("design:paramtypes", [proveedor_service_1.ProveedorService])
], ProveedorController);
exports.ProveedorController = ProveedorController;
