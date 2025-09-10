"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolService = void 0;
const common_1 = require("@nestjs/common");
const rol_entity_1 = require("../entities/rol.entity");
let RolService = class RolService {
    constructor() {
        this.roles = [];
        this.nextId = 1;
    }
    async create(createRolDto) {
        const rol = { ...createRolDto, id: this.nextId++ };
        this.roles.push(rol);
        return rol;
    }
    async findAll() {
        return this.roles;
    }
    async findOne(id) {
        return this.roles.find(role => role.id === id);
    }
    async update(id, updateRolDto) {
        const index = this.roles.findIndex(role => role.id === id);
        if (index !== -1) {
            this.roles[index] = new rol_entity_1.Rol({
                ...this.roles[index],
                ...updateRolDto
            });
            return this.roles[index];
        }
        return null;
    }
    async remove(id) {
        const index = this.roles.findIndex(role => role.id === id);
        if (index !== -1) {
            this.roles.splice(index, 1);
        }
    }
};
RolService = __decorate([
    (0, common_1.Injectable)()
], RolService);
exports.RolService = RolService;
