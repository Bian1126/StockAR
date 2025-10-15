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
exports.DetalleVentaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const detalle_venta_entity_1 = require("../entities/detalle-venta.entity");
const producto_service_1 = require("../producto/producto.service");
let DetalleVentaService = class DetalleVentaService {
    constructor(detalleVentaRepository, 
    //Usar ProductoService en lugar de repositorio directo
    productoService) {
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoService = productoService;
    }
    //Método para crear detalle desde venta (uso interno)
    async createFromVenta(venta, productoId, cantidad) {
        //Validar y obtener producto usando ProductoService
        const producto = await this.productoService.findOne(productoId);
        await this.productoService.validarStock(productoId, cantidad);
        //Calcular subtotal (lógica de DetalleVenta)
        const subtotal = this.calcularSubtotal(producto.precioVenta, cantidad);
        //Crear detalle
        const detalle = this.detalleVentaRepository.create({
            cantidad,
            subtotal,
            producto,
            venta
        });
        return { detalle, subtotal };
    }
    //Lógica de negocio: calcular subtotal
    calcularSubtotal(precioUnitario, cantidad) {
        return precioUnitario * cantidad;
    }
    async create(dto) {
        //Este método se mantiene para uso directo del API
        throw new common_1.BadRequestException('Use createFromVenta para crear detalles desde ventas');
    }
    async findAll() {
        return this.detalleVentaRepository.find({ relations: ['venta', 'producto'] });
    }
    async findOne(id) {
        const detalle = await this.detalleVentaRepository.findOne({
            where: { idDetalle: id },
            relations: ['venta', 'producto'],
        });
        if (!detalle) {
            throw new common_1.NotFoundException(`DetalleVenta con id ${id} no encontrado`);
        }
        return detalle;
    }
    async update(id, dto) {
        const detalle = await this.findOne(id);
        Object.assign(detalle, dto);
        return this.detalleVentaRepository.save(detalle);
    }
    async remove(id) {
        const detalle = await this.findOne(id);
        await this.detalleVentaRepository.remove(detalle);
    }
};
DetalleVentaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(detalle_venta_entity_1.DetalleVenta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        producto_service_1.ProductoService])
], DetalleVentaService);
exports.DetalleVentaService = DetalleVentaService;
