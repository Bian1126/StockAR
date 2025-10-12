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
exports.ProductoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("../entities/producto.entity");
const tipo_producto_entity_1 = require("../entities/tipo-producto.entity");
const moneda_entity_1 = require("../entities/moneda.entity");
let ProductoService = class ProductoService {
    constructor(productoRepository, tipoProductoRepository, monedaRepository) {
        this.productoRepository = productoRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.monedaRepository = monedaRepository;
    }
    async create(data) {
        const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
        if (!tipoProducto)
            throw new common_1.BadRequestException('Tipo de producto no encontrado');
        const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda } });
        if (!moneda)
            throw new common_1.BadRequestException('Moneda no encontrada');
        const producto = this.productoRepository.create({
            ...data,
            tipoProducto,
            moneda,
        });
        return await this.productoRepository.save(producto);
    }
    async findAll() {
        return await this.productoRepository.find({ relations: ['tipoProducto', 'moneda'] });
    }
    async findOne(id) {
        const producto = await this.productoRepository.findOne({ where: { idProducto: id }, relations: ['tipoProducto', 'moneda'] });
        if (!producto)
            throw new common_1.NotFoundException('Producto no encontrado');
        return producto;
    }
    async update(id, data) {
        const producto = await this.findOne(id);
        if (data.idTipoProducto) {
            const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
            if (!tipoProducto)
                throw new common_1.BadRequestException('Tipo de producto no encontrado');
            producto.tipoProducto = tipoProducto;
        }
        if (data.idMoneda) {
            const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda } });
            if (!moneda)
                throw new common_1.BadRequestException('Moneda no encontrada');
            producto.moneda = moneda;
        }
        Object.assign(producto, data);
        return await this.productoRepository.save(producto);
    }
    async remove(id) {
        const producto = await this.findOne(id);
        await this.productoRepository.remove(producto);
    }
    // Métodos para manejo de ventas
    async validarStock(idProducto, cantidadRequerida) {
        const producto = await this.findOne(idProducto);
        if (producto.stock < cantidadRequerida) {
            throw new common_1.BadRequestException(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}, requerido: ${cantidadRequerida}`);
        }
    }
    async reducirStock(idProducto, cantidad) {
        const producto = await this.findOne(idProducto);
        producto.stock -= cantidad;
        await this.productoRepository.save(producto);
    }
    async aumentarStock(idProducto, cantidad) {
        const producto = await this.findOne(idProducto);
        producto.stock += cantidad;
        await this.productoRepository.save(producto);
    }
};
ProductoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(1, (0, typeorm_1.InjectRepository)(tipo_producto_entity_1.TipoProducto)),
    __param(2, (0, typeorm_1.InjectRepository)(moneda_entity_1.Moneda)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductoService);
exports.ProductoService = ProductoService;
