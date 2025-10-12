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
exports.VentaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("../entities/venta.entity");
const detalle_venta_entity_1 = require("../entities/detalle-venta.entity");
const producto_service_1 = require("../producto/producto.service");
const empleado_service_1 = require("../empleado/empleado.service");
const detalle_venta_service_1 = require("../detalle-venta/detalle-venta.service");
let VentaService = class VentaService {
    constructor(ventaRepository, detalleVentaRepository, 
    //Usar servicios especializados
    productoService, empleadoService, detalleVentaService) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoService = productoService;
        this.empleadoService = empleadoService;
        this.detalleVentaService = detalleVentaService;
    }
    async create(createVentaDto) {
        //Delega al EmpleadoService
        const empleado = await this.empleadoService.findOne(createVentaDto.usuarioId);
        // Crear la venta
        const venta = this.ventaRepository.create({
            fechaHora: new Date(),
            total: 0,
            empleado
        });
        const savedVenta = await this.ventaRepository.save(venta);
        // ✅ Procesar detalles usando DetalleVentaService
        if (createVentaDto.detalle?.length > 0) {
            let totalVenta = 0;
            const detallesCreados = [];
            for (const detalleDto of createVentaDto.detalle) {
                // ✅ DetalleVentaService maneja su propia lógica
                const { detalle, subtotal } = await this.detalleVentaService.createFromVenta(savedVenta, detalleDto.productoId, detalleDto.cantidad);
                // Guardar detalle
                const savedDetalle = await this.detalleVentaRepository.save(detalle);
                detallesCreados.push(savedDetalle);
                totalVenta += subtotal;
                //ProductoService reduce stock
                await this.productoService.reducirStock(detalleDto.productoId, detalleDto.cantidad);
            }
            // Actualizar total de la venta
            savedVenta.total = totalVenta;
            await this.ventaRepository.save(savedVenta);
            savedVenta.detalles = detallesCreados;
        }
        return savedVenta;
    }
    async findAll() {
        return this.ventaRepository.find({
            relations: ['empleado', 'detalles']
        });
    }
    //Antes estaba id y todos se corrigieron por idVenta
    async findOne(idVenta) {
        const venta = await this.ventaRepository.findOne({
            where: { idVenta },
            relations: ['empleado', 'detalles'],
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con id ${idVenta} no encontrada`);
        }
        return venta;
    }
    async update(id, updateVentaDto) {
        const venta = await this.findOne(id);
        Object.assign(venta, updateVentaDto);
        return this.ventaRepository.save(venta);
    }
    async remove(id) {
        const venta = await this.findOne(id);
        await this.ventaRepository.remove(venta);
    }
};
VentaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_entity_1.DetalleVenta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        producto_service_1.ProductoService,
        empleado_service_1.EmpleadoService,
        detalle_venta_service_1.DetalleVentaService])
], VentaService);
exports.VentaService = VentaService;
