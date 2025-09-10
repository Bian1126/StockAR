import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../common/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../common/dto/update-usuario.dto';
import { LoginUsuarioDto } from '../common/dto/login-usuario.dto';
import { LogoutUsuarioDto } from '../common/dto/logout-usuario.dto';


@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario | undefined> {
    return await this.usuarioService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario | null> {
    return await this.usuarioService.update(Number(id), updateUsuarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usuarioService.remove(Number(id));
  }

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto): Promise<string> {
    return await this.usuarioService.login(loginUsuarioDto.email, loginUsuarioDto.contraseña);
  }

  @Post('logout')
  async logout(@Body() logoutUsuarioDto: LogoutUsuarioDto): Promise<string> {
    return await this.usuarioService.logout(logoutUsuarioDto.idUsuario);
  }
}