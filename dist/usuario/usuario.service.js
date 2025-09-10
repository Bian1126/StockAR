"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const usuario_entity_1 = require("../entities/usuario.entity");
let UsuarioService = class UsuarioService {
    constructor() {
        this.usuarios = [];
        this.nextId = 1;
    }
    async create(createUsuarioDto) {
        const usuario = new usuario_entity_1.Usuario();
        usuario.idUsuario = this.nextId++;
        usuario.nombre = createUsuarioDto.nombre;
        usuario.email = createUsuarioDto.email;
        usuario.contraseña = createUsuarioDto.contraseña;
        usuario.rol = undefined; // Asigna el rol real si lo tienes
        usuario.productos = [];
        usuario.ventas = [];
        this.usuarios.push(usuario);
        return usuario;
    }
    async findAll() {
        return this.usuarios;
    }
    async findOne(id) {
        return this.usuarios.find(usuario => usuario.idUsuario === id);
    }
    async update(id, updateUsuarioDto) {
        const index = this.usuarios.findIndex(u => u.idUsuario === id);
        if (index !== -1) {
            this.usuarios[index] = new usuario_entity_1.Usuario({
                ...this.usuarios[index],
                ...updateUsuarioDto
            });
            return this.usuarios[index];
        }
        return null;
    }
    async remove(id) {
        this.usuarios = this.usuarios.filter(usuario => usuario.idUsuario !== id);
    }
    async login(email, contraseña) {
        const usuario = this.usuarios.find(u => u.email === email && u.contraseña === contraseña);
        return usuario ? 'Login exitoso' : 'Credenciales incorrectas';
    }
    async logout(idUsuario) {
        // Aquí podrías marcar al usuario como deslogueado, si tuvieras un campo para eso
        return 'Logout exitoso';
    }
};
UsuarioService = __decorate([
    (0, common_1.Injectable)()
], UsuarioService);
exports.UsuarioService = UsuarioService;
