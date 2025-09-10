"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMonedaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_moneda_dto_1 = require("./create-moneda.dto");
class UpdateMonedaDto extends (0, mapped_types_1.PartialType)(create_moneda_dto_1.CreateMonedaDto) {
}
exports.UpdateMonedaDto = UpdateMonedaDto;
