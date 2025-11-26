import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../common/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../common/dto/update-usuario.dto';
import { LoginUsuarioDto } from '../common/dto/login-usuario.dto';
import { LogoutUsuarioDto } from '../common/dto/logout-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    if (createUsuarioDto.contraseña !== createUsuarioDto.verificarContraseña) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    
    // Verificar si el email ya existe
    const existingUsuario = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email }
    });
    
    if (existingUsuario) {
      throw new BadRequestException('El email ya está registrado');
    }

    const usuario = this.usuarioRepository.create({
      email: createUsuarioDto.email,
      contraseña: createUsuarioDto.contraseña,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id }
    });
    return usuario ?? undefined;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usuarioRepository.remove(usuario);
  }

  async login(loginUsuarioDto: LoginUsuarioDto): Promise<string> {
    const usuario = await this.usuarioRepository.findOne({
      where: { 
        email: loginUsuarioDto.email,
        contraseña: loginUsuarioDto.contraseña
      }
    });

    if (!usuario) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    return 'Login exitoso';
  }

  async logout(logoutUsuarioDto: LogoutUsuarioDto): Promise<string> {
    // Aquí podrías marcar al usuario como deslogueado, si tuvieras un campo para eso
    return 'Logout exitoso';
  }
}