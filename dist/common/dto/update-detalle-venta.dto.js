"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDetalleVentaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_detalle_venta_dto_1 = require("./create-detalle-venta.dto");
class UpdateDetalleVentaDto extends (0, mapped_types_1.PartialType)(create_detalle_venta_dto_1.CreateDetalleVentaDto) {
}
exports.UpdateDetalleVentaDto = UpdateDetalleVentaDto;
