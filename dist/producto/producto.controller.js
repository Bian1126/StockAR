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
exports.ProductoController = void 0;
const common_1 = require("@nestjs/common");
const producto_service_1 = require("./producto.service");
const create_producto_dto_1 = require("../common/dto/create-producto.dto");
const update_producto_dto_1 = require("../common/dto/update-producto.dto");
let ProductoController = class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }
    async create(createProductoDto) {
        return this.productoService.create(createProductoDto);
    }
    async findAll() {
        return this.productoService.findAll();
    }
    async findOne(id) {
        return this.productoService.findOne(id);
    }
    async remove(id) {
        return this.productoService.remove(id);
    }
    async update(id, updateProductoDto) {
        const producto = await this.productoService.update(Number(id), updateProductoDto);
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async updateStock(id, cantidad) {
        const producto = await this.productoService.updateStock(Number(id), Number(cantidad));
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async calcularPrecioFinal(id) {
        return this.productoService.calcularPrecioFinal(Number(id));
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/stock/:cantidad'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('cantidad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Get)(':id/precio-final'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "calcularPrecioFinal", null);
ProductoController = __decorate([
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [producto_service_1.ProductoService])
], ProductoController);
exports.ProductoController = ProductoController;
