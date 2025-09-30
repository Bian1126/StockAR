import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from '../src/producto/producto.controller';
import { ProductoService } from '../src/producto/producto.service';
import { Producto } from '../src/entities/producto.entity';

describe('ProductoController (e2e)', () => {
  let app;
  let productoController: ProductoController;
  let productoService: ProductoService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [ProductoService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productoController = moduleFixture.get<ProductoController>(ProductoController);
    productoService = moduleFixture.get<ProductoService>(ProductoService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/producto (GET)', () => {
    it('should return an array of productos', async () => {
      const result: Producto[] = [
        { idProducto: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precioNeto: 100, moneda: 'USD', iva: 21, ganancia: 10, stock: 50 },
        { idProducto: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precioNeto: 200, moneda: 'USD', iva: 21, ganancia: 20, stock: 30 },
      ];
      jest.spyOn(productoService, 'findAll').mockImplementation(async () => result);

      const response = await productoController.findAll();
      expect(response).toEqual(result);
    });
  });

  describe('/producto (POST)', () => {
    it('should create a new producto', async () => {
      const newProducto: Producto = { idProducto: 3, nombre: 'Producto 3', descripcion: 'Descripción 3', precioNeto: 150, moneda: 'USD', iva: 21, ganancia: 15, stock: 20 };
      jest.spyOn(productoService, 'create').mockImplementation(async () => newProducto);

      const response = await productoController.create(newProducto);
      expect(response).toEqual(newProducto);
    });
  });
});