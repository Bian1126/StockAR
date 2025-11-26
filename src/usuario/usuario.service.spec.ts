import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../common/dto/create-usuario.dto';
import { LoginUsuarioDto } from '../common/dto/login-usuario.dto';

describe('UsuarioService - registro e inicio de sesión', () => {
  let service: UsuarioService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('Registro de usuario exitoso', async () => {
    const usuario = await service.create({
      email: 'nuevo@test.com',
      contraseña: 'NuevaPass123',
      verificarContraseña: 'NuevaPass123'
    } as CreateUsuarioDto);
    expect(usuario.email).toBe('nuevo@test.com');
  });

  it('Registro de usuario no exitoso - contraseñas no coinciden', async () => {
    await expect(service.create({
      email: 'nuevo@test.com',
      contraseña: 'pass1',
      verificarContraseña: 'pass2'
    } as CreateUsuarioDto)).rejects.toThrow('Las contraseñas no coinciden');
  });

  it('Inicio de Sesión Exitoso', async () => {
    const resultado = await service.login({
      email: 'usuarioadmin@test.com',
      contraseña: 'Password123'
    } as LoginUsuarioDto);
    expect(resultado).toBe('Login exitoso');
  });

  it('Inicio de Sesión No Exitoso - Email incorrecto', async () => {
    const resultado = await service.login({
      email: 'usuarioadmin1@test.com',
      contraseña: 'Password123'
    } as LoginUsuarioDto);
    expect(resultado).toBe('Credenciales incorrectas');
  });

  it('Inicio de Sesión No Exitoso - Contraseña incorrecta', async () => {
    const resultado = await service.login({
      email: 'usuarioadmin@test.com',
      contraseña: 'WrongPassword'
    } as LoginUsuarioDto);
    expect(resultado).toBe('Credenciales incorrectas');
  });
});