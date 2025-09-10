import { Test, TestingModule } from '@nestjs/testing';
import { DetalleVentaController } from '../src/detalle-venta/detalle-venta.controller';
import { DetalleVentaService } from '../src/detalle-venta/detalle-venta.service';

describe('DetalleVentaController (e2e)', () => {
  let app: TestingModule;
  let controller: DetalleVentaController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [DetalleVentaController],
      providers: [DetalleVentaService],
    }).compile();

    controller = app.get<DetalleVentaController>(DetalleVentaController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests for the DetalleVentaController methods here
});