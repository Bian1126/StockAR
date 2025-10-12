"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.Venta = exports.Usuario = exports.TipoProducto = exports.TipoMoneda = exports.Rol = exports.Producto = exports.Moneda = exports.Empleado = exports.DetalleVenta = exports.entities = void 0;
const detalle_venta_entity_1 = require("./detalle-venta.entity");
Object.defineProperty(exports, "DetalleVenta", { enumerable: true, get: function () { return detalle_venta_entity_1.DetalleVenta; } });
const empleado_entity_1 = require("./empleado.entity");
Object.defineProperty(exports, "Empleado", { enumerable: true, get: function () { return empleado_entity_1.Empleado; } });
const moneda_entity_1 = require("./moneda.entity");
Object.defineProperty(exports, "Moneda", { enumerable: true, get: function () { return moneda_entity_1.Moneda; } });
const producto_entity_1 = require("./producto.entity");
Object.defineProperty(exports, "Producto", { enumerable: true, get: function () { return producto_entity_1.Producto; } });
const rol_entity_1 = require("./rol.entity");
Object.defineProperty(exports, "Rol", { enumerable: true, get: function () { return rol_entity_1.Rol; } });
const tipo_moneda_entity_1 = require("./tipo-moneda.entity");
Object.defineProperty(exports, "TipoMoneda", { enumerable: true, get: function () { return tipo_moneda_entity_1.TipoMoneda; } });
const tipo_producto_entity_1 = require("./tipo-producto.entity");
Object.defineProperty(exports, "TipoProducto", { enumerable: true, get: function () { return tipo_producto_entity_1.TipoProducto; } });
const usuario_entity_1 = require("./usuario.entity");
Object.defineProperty(exports, "Usuario", { enumerable: true, get: function () { return usuario_entity_1.Usuario; } });
const venta_entity_1 = require("./venta.entity");
Object.defineProperty(exports, "Venta", { enumerable: true, get: function () { return venta_entity_1.Venta; } });
const permission_entity_1 = require("./permission.entity");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return permission_entity_1.Permission; } });
exports.entities = [
    detalle_venta_entity_1.DetalleVenta,
    empleado_entity_1.Empleado,
    moneda_entity_1.Moneda,
    producto_entity_1.Producto,
    rol_entity_1.Rol,
    tipo_moneda_entity_1.TipoMoneda,
    tipo_producto_entity_1.TipoProducto,
    usuario_entity_1.Usuario,
    venta_entity_1.Venta,
    permission_entity_1.Permission,
];
