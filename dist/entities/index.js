"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moneda = exports.Proveedor = exports.Rol = exports.DetalleVenta = exports.Venta = exports.Producto = exports.Usuario = exports.entities = void 0;
const usuario_entity_1 = require("./usuario.entity");
Object.defineProperty(exports, "Usuario", { enumerable: true, get: function () { return usuario_entity_1.Usuario; } });
const producto_entity_1 = require("./producto.entity");
Object.defineProperty(exports, "Producto", { enumerable: true, get: function () { return producto_entity_1.Producto; } });
const venta_entity_1 = require("./venta.entity");
Object.defineProperty(exports, "Venta", { enumerable: true, get: function () { return venta_entity_1.Venta; } });
const detalle_venta_entity_1 = require("./detalle-venta.entity");
Object.defineProperty(exports, "DetalleVenta", { enumerable: true, get: function () { return detalle_venta_entity_1.DetalleVenta; } });
const rol_entity_1 = require("./rol.entity");
Object.defineProperty(exports, "Rol", { enumerable: true, get: function () { return rol_entity_1.Rol; } });
const proveedor_entity_1 = require("./proveedor.entity");
Object.defineProperty(exports, "Proveedor", { enumerable: true, get: function () { return proveedor_entity_1.Proveedor; } });
const moneda_entity_1 = require("./moneda.entity");
Object.defineProperty(exports, "Moneda", { enumerable: true, get: function () { return moneda_entity_1.Moneda; } });
exports.entities = [
    usuario_entity_1.Usuario,
    producto_entity_1.Producto,
    venta_entity_1.Venta,
    detalle_venta_entity_1.DetalleVenta,
    rol_entity_1.Rol,
    proveedor_entity_1.Proveedor,
    moneda_entity_1.Moneda,
];
