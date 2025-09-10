import { Injectable } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../common/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../common/dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  private usuarios: Usuario[] = [];
  private nextId = 1;
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario();
    usuario.idUsuario = this.nextId++;
    usuario.nombre = createUsuarioDto.nombre;
    usuario.email = createUsuarioDto.email;
    usuario.contraseña = createUsuarioDto.contraseña;
    usuario.rol = undefined as any; // Asigna el rol real si lo tienes
    usuario.productos = [];
    usuario.ventas = [];
    this.usuarios.push(usuario);
    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarios;
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    return this.usuarios.find(usuario => usuario.idUsuario === id);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario | null> {
    const index = this.usuarios.findIndex(u => u.idUsuario === id);
    if (index !== -1) {
      this.usuarios[index] = new Usuario ({
        ...this.usuarios[index],
        ...updateUsuarioDto
      });
      return this.usuarios[index];
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    this.usuarios = this.usuarios.filter(usuario => usuario.idUsuario !== id);
  }

  async login(email: string, contraseña: string): Promise<string> {
    const usuario = this.usuarios.find(u => u.email === email && u.contraseña === contraseña);
    return usuario ? 'Login exitoso' : 'Credenciales incorrectas';
  }

  async logout(idUsuario: number): Promise<string> {
    // Aquí podrías marcar al usuario como deslogueado, si tuvieras un campo para eso
    return 'Logout exitoso';
  }
}