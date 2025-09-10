import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from '../src/usuario/usuario.controller';
import { UsuarioService } from '../src/usuario/usuario.service';
import { Usuario } from '../src/usuario/usuario.entity';

describe('UsuarioController (e2e)', () => {
  let app;
  let usuarioController: UsuarioController;
  let usuarioService: UsuarioService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [UsuarioService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usuarioController = moduleFixture.get<UsuarioController>(UsuarioController);
    usuarioService = moduleFixture.get<UsuarioService>(UsuarioService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(usuarioController).toBeDefined();
  });

  describe('login', () => {
    it('should return a user on successful login', async () => {
      const user: Usuario = { idUsuario: 1, nombre: 'Test User', email: 'test@example.com', contraseña: 'password', rol: null };
      jest.spyOn(usuarioService, 'login').mockResolvedValue(user);

      const result = await usuarioController.login(user.email, user.contraseña);
      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should call logout method', async () => {
      jest.spyOn(usuarioService, 'logout').mockImplementation(() => Promise.resolve());

      await usuarioController.logout();
      expect(usuarioService.logout).toHaveBeenCalled();
    });
  });
});