"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const usuario_module_1 = require("./usuario/usuario.module");
const producto_module_1 = require("./producto/producto.module");
const venta_module_1 = require("./venta/venta.module");
const detalle_venta_module_1 = require("./detalle-venta/detalle-venta.module");
const rol_module_1 = require("./rol/rol.module");
const moneda_module_1 = require("./moneda/moneda.module");
const entities_1 = require("./entities");
const empleado_module_1 = require("./empleado/empleado.module");
const permission_module_1 = require("./permissions/permission.module");
const tipoMoneda_module_1 = require("./tipoMoneda/tipoMoneda.module");
const tipoProducto_module_1 = require("./tipoProducto/tipoProducto.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => {
                    const host = config.get('DB_HOST') || 'localhost';
                    const port = Number(config.get('DB_PORT')) || 5437;
                    const username = config.get('DB_USERNAME') || 'postgres';
                    const password = config.get('DB_PASSWORD') || 'stockar11';
                    const database = config.get('DB_DATABASE') || 'stockar';
                    return {
                        type: 'postgres',
                        host,
                        port,
                        username,
                        password,
                        database,
                        entities: entities_1.entities,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            usuario_module_1.UsuarioModule,
            producto_module_1.ProductoModule,
            venta_module_1.VentaModule,
            detalle_venta_module_1.DetalleVentaModule,
            rol_module_1.RolModule,
            moneda_module_1.MonedaModule,
            empleado_module_1.EmpleadoModule,
            permission_module_1.PermissionModule,
            tipoMoneda_module_1.TipoMonedaModule,
            tipoProducto_module_1.TipoProductoModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
