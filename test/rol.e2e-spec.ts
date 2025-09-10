import { Test, TestingModule } from '@nestjs/testing';
import { RolController } from '../src/rol/rol.controller';
import { RolService } from '../src/rol/rol.service';
import { Rol } from '../src/rol/rol.entity';

describe('RolController (e2e)', () => {
  let app;
  let rolController: RolController;
  let rolService: RolService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RolController],
      providers: [RolService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    rolController = moduleFixture.get<RolController>(RolController);
    rolService = moduleFixture.get<RolService>(RolService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/rol (GET)', () => {
    const result: Rol[] = [
      { id: 1, nombre: 'Admin', descripcion: 'Administrator role' },
      { id: 2, nombre: 'User', descripcion: 'Regular user role' },
    ];
    jest.spyOn(rolService, 'findAll').mockImplementation(() => result);

    expect(rolController.findAll()).toBe(result);
  });

  it('/rol (POST)', () => {
    const newRol: Rol = { id: 3, nombre: 'Manager', descripcion: 'Manager role' };
    jest.spyOn(rolService, 'create').mockImplementation(() => newRol);

    expect(rolController.create(newRol)).toBe(newRol);
  });

  it('/rol/:id (GET)', () => {
    const result: Rol = { id: 1, nombre: 'Admin', descripcion: 'Administrator role' };
    jest.spyOn(rolService, 'findOne').mockImplementation(() => result);

    expect(rolController.findOne(1)).toBe(result);
  });

  it('/rol/:id (DELETE)', () => {
    jest.spyOn(rolService, 'remove').mockImplementation(() => true);

    expect(rolController.remove(1)).toBe(true);
  });
});