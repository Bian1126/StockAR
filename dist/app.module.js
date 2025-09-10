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
const usuario_module_1 = require("./usuario/usuario.module");
const producto_module_1 = require("./producto/producto.module");
const venta_module_1 = require("./venta/venta.module");
const detalle_venta_module_1 = require("./detalle-venta/detalle-venta.module");
const rol_module_1 = require("./rol/rol.module");
const proveedor_module_1 = require("./proveedor/proveedor.module");
const moneda_module_1 = require("./moneda/moneda.module");
const entities_1 = require("./entities");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'stockar11',
                database: 'stockar',
                entities: entities_1.entities,
                synchronize: true,
            }),
            usuario_module_1.UsuarioModule,
            producto_module_1.ProductoModule,
            venta_module_1.VentaModule,
            detalle_venta_module_1.DetalleVentaModule,
            rol_module_1.RolModule,
            proveedor_module_1.ProveedorModule,
            moneda_module_1.MonedaModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
