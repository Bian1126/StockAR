import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from '../common/dto/create-usuario.dto';
import { LoginUsuarioDto } from '../common/dto/login-usuario.dto';

describe('UsuarioService - registro e inicio de sesión', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    service = new UsuarioService();
    // Creamos un usuario para las pruebas de login
    await service.create({
      email: 'usuarioadmin@test.com',
      contraseña: 'Password123',
      verificarContraseña: 'Password123'
    } as CreateUsuarioDto);
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