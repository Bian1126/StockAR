"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moneda_entity_1 = require("../entities/moneda.entity");
const tipo_moneda_entity_1 = require("../entities/tipo-moneda.entity");
const moneda_service_1 = require("../moneda/moneda.service");
const moneda_controller_1 = require("./moneda.controller");
const cotizacion_service_1 = require("./cotizacion.service");
const cotizacion_controller_1 = require("./cotizacion.controller");
let MonedaModule = class MonedaModule {
};
MonedaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([moneda_entity_1.Moneda, tipo_moneda_entity_1.TipoMoneda])],
        providers: [moneda_service_1.MonedaService, cotizacion_service_1.CotizacionService],
        controllers: [moneda_controller_1.MonedaController, cotizacion_controller_1.CotizacionController],
        exports: [moneda_service_1.MonedaService, cotizacion_service_1.CotizacionService],
    })
], MonedaModule);
exports.MonedaModule = MonedaModule;
