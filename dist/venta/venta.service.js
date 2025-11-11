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
    productoService, empleadoService, detalleVentaService, dataSource) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoService = productoService;
        this.empleadoService = empleadoService;
        this.detalleVentaService = detalleVentaService;
        this.dataSource = dataSource;
    }
    async create(createVentaDto) {
        // Usar transacción para que la creación de la venta, los detalles y la reducción
        // de stock sean atómicos: si algo falla, se revierte todo.
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Delega al EmpleadoService (fuera de transacción está bien si es lectura)
            const empleado = await this.empleadoService.findOne(createVentaDto.usuarioId);
            // Crear la venta usando queryRunner
            const venta = queryRunner.manager.create(venta_entity_1.Venta, {
                fechaHora: new Date(),
                total: 0,
                empleado,
            });
            const savedVenta = await queryRunner.manager.save(venta);
            const detallesCreados = [];
            let totalVenta = 0;
            if (createVentaDto.detalle?.length > 0) {
                for (const detalleDto of createVentaDto.detalle) {
                    // Validar stock y construir detalle (detalleVentaService.createFromVenta usa productoService.findOne)
                    const { detalle, subtotal } = await this.detalleVentaService.createFromVenta(savedVenta, detalleDto.productoId, detalleDto.cantidad, queryRunner.manager);
                    // Guardar detalle dentro de la transacción
                    const savedDetalle = await queryRunner.manager.save(detalle);
                    detallesCreados.push(savedDetalle);
                    totalVenta += subtotal;
                    // Reducir stock usando queryRunner para mantener consistencia
                    // Intentamos la operación atómica definida en ProductoService (que usa query builder)
                    // Para usarla dentro de la transacción, ejecutamos un UPDATE condicional directamente aquí
                    const updateResult = await queryRunner.manager
                        .createQueryBuilder()
                        .update('producto')
                        .set({ stock: () => `stock - ${detalleDto.cantidad}` })
                        .where('idProducto = :idProducto AND stock >= :cantidad', { idProducto: detalleDto.productoId, cantidad: detalleDto.cantidad })
                        .execute();
                    if ((updateResult.affected || 0) === 0) {
                        // No hay stock suficiente, lanzar excepción para que la transacción haga rollback
                        const productoActual = await queryRunner.manager.findOne('producto', { where: { idProducto: detalleDto.productoId } });
                        const nombre = (productoActual && productoActual.nombre) || detalleDto.productoId;
                        throw new common_1.BadRequestException(`Stock insuficiente para ${nombre}. Requerido: ${detalleDto.cantidad}`);
                    }
                }
            }
            // Actualizar total y commit
            savedVenta.total = totalVenta;
            await queryRunner.manager.save(savedVenta);
            savedVenta.detalles = detallesCreados;
            await queryRunner.commitTransaction();
            return savedVenta;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            if (err instanceof common_1.BadRequestException)
                throw err;
            throw new common_1.InternalServerErrorException('Error al crear la venta');
        }
        finally {
            await queryRunner.release();
        }
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
        detalle_venta_service_1.DetalleVentaService,
        typeorm_2.DataSource])
], VentaService);
exports.VentaService = VentaService;
