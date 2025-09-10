import { Test, TestingModule } from '@nestjs/testing';
import { VentaController } from '../src/venta/venta.controller';
import { VentaService } from '../src/venta/venta.service';
import { Venta } from '../src/venta/venta.entity';

describe('VentaController (e2e)', () => {
  let app;
  let ventaController: VentaController;
  let ventaService: VentaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [VentaController],
      providers: [VentaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    ventaController = moduleFixture.get<VentaController>(VentaController);
    ventaService = moduleFixture.get<VentaService>(VentaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new venta', async () => {
    const newVenta = new Venta();
    newVenta.fecha = new Date();
    newVenta.total = 100;

    jest.spyOn(ventaService, 'create').mockImplementation(async () => newVenta);

    const result = await ventaController.create(newVenta);
    expect(result).toEqual(newVenta);
  });

  it('should return all ventas', async () => {
    const ventas = [new Venta(), new Venta()];

    jest.spyOn(ventaService, 'findAll').mockImplementation(async () => ventas);

    const result = await ventaController.findAll();
    expect(result).toEqual(ventas);
  });

  it('should return a single venta by id', async () => {
    const venta = new Venta();
    venta.idVenta = 1;

    jest.spyOn(ventaService, 'findOne').mockImplementation(async () => venta);

    const result = await ventaController.findOne(1);
    expect(result).toEqual(venta);
  });

  it('should update a venta', async () => {
    const updatedVenta = new Venta();
    updatedVenta.idVenta = 1;
    updatedVenta.total = 150;

    jest.spyOn(ventaService, 'update').mockImplementation(async () => updatedVenta);

    const result = await ventaController.update(1, updatedVenta);
    expect(result).toEqual(updatedVenta);
  });

  it('should delete a venta', async () => {
    jest.spyOn(ventaService, 'remove').mockImplementation(async () => true);

    const result = await ventaController.remove(1);
    expect(result).toBe(true);
  });
});