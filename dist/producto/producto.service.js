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
const cotizacion_service_1 = require("../moneda/cotizacion.service");
const config_service_1 = require("../config/config.service");
let ProductoService = class ProductoService {
    constructor(productoRepository, tipoProductoRepository, monedaRepository, cotizacionService, configService) {
        this.productoRepository = productoRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.monedaRepository = monedaRepository;
        this.cotizacionService = cotizacionService;
        this.configService = configService;
    }
    async create(data) {
        const tipoProducto = await this.tipoProductoRepository.findOne({ where: { idTipoProducto: data.idTipoProducto } });
        if (!tipoProducto)
            throw new common_1.BadRequestException('Tipo de producto no encontrado');
        const moneda = await this.monedaRepository.findOne({ where: { idMoneda: data.idMoneda }, relations: ['tipoMoneda'] });
        if (!moneda)
            throw new common_1.BadRequestException('Moneda no encontrada');
        // Ganancia: si viene en body la usamos; si no, usamos la de config
        const ganancia = typeof data.ganancia === 'number' ? Number(data.ganancia) : Number(await this.configService.get('ganancia_default'));
        const iva = typeof data.iva === 'number' ? Number(data.iva) : 21; // 21% por defecto
        // Obtener cotización si la moneda es USD
        let cot = 1;
        if (moneda.nombre?.toLowerCase().includes('dolar') || moneda.tipoMoneda.nombre?.toLowerCase().includes('dolar')) {
            try {
                cot = await this.cotizacionService.getUsdOficialVenta();
            }
            catch (err) {
                // fallback: Si la entidad moneda tiene cotizacion guardada
                const stored = Number(moneda.cotizacion);
                if (stored && !isNaN(stored) && stored > 0) {
                    cot = stored;
                    // opcional: log.warn('Cotizacion externa falló, usando moneda.cotizacion');
                }
                else {
                } // no hay fallback: lanzar un error claro para el cliente
                throw new common_1.BadRequestException('No se pudo obtener la cotización del Dólar. Intente más tarde.');
            }
        }
        const precioCompra = Number(data.precioNeto ?? 0);
        const cantidad = Number(data.stock ?? 1);
        // Calculos
        const costoARS = precioCompra * cot;
        const precioVentaUnitarioSinIva = costoARS * (1 + ganancia / 100);
        const precioVentaUnitarioConIva = precioVentaUnitarioSinIva * (1 + iva / 100);
        const precioVentaTotalConIva = precioVentaUnitarioConIva * cantidad;
        const producto = this.productoRepository.create({
            ...data,
            tipoProducto,
            moneda,
            precioNeto: Number(costoARS.toFixed(2)),
            precioVenta: Number(precioVentaUnitarioSinIva.toFixed(2)),
            iva,
            ganancia,
        });
        const saved = await this.productoRepository.save(producto);
        // devolver también los valores con IVA para que el front los muestre inmediatamente
        return {
            ...saved,
            precioVentaUnitarioConIva: Number(precioVentaUnitarioConIva.toFixed(2)),
            precioVentaTotalConIva: Number(precioVentaTotalConIva.toFixed(2)),
            cotizacionUsada: cot,
        };
    }
    async findAll() {
        return await this.productoRepository.find({ relations: ['tipoProducto', 'moneda'] });
    }
    async findOne(id) {
        const producto = await this.productoRepository.findOne({ where: { idProducto: id }, relations: ['tipoProducto', 'moneda'] });
        if (!producto)
            throw new common_1.NotFoundException('Producto no encontrado');
        const precioUnitSinIva = Number(producto.precioVenta);
        const unitConIva = precioUnitSinIva * (1 + Number(producto.iva) / 100);
        return {
            ...producto,
            precioVentaUnitarioConIva: Number(unitConIva.toFixed(2)),
            // si querés total por stock o por cantidad, multiplicar por producto.stock
            precioVentaTotalConIva: Number((unitConIva * (producto.stock ?? 1)).toFixed(2)),
        };
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
        typeorm_2.Repository,
        cotizacion_service_1.CotizacionService,
        config_service_1.ConfigService])
], ProductoService);
exports.ProductoService = ProductoService;
