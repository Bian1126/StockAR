/**
 * Test unitario del CotizacionController.
 *
 * Objetivos:
 * - Verificar el contrato HTTP que expone el controller: { moneda: 'USD', venta }.
 * - Verificar el manejo de errores:
 *    - Si el servicio lanza una excepción genérica → el controller registra y lanza InternalServerErrorException.
 *    - Si el servicio lanza una HttpException (p.ej. NotFoundException) → el controller la deja pasar (no la convierte).
 *
 * Estrategia:
 * - Mock parcial del servicio (`serviceMock`) para controlar distintos escenarios sin tocar la red.
 * - Uso de `Test.createTestingModule` para instanciar el controlador con el mock inyectado.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CotizacionController} from '../cotizacion.controller';
import { CotizacionService } from '../cotizacion.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('CotizacionController', () => {
  let controller: CotizacionController;
  // Mock parcial del servicio: solo implementamos lo necesario para las pruebas
  let serviceMock: Partial<CotizacionService>;

  beforeEach(async () => {
    // Por defecto el mock devuelve un valor de venta válido (caso feliz)
    serviceMock = {
      getUsdOficialVenta: async () => 1400,
    };

    // Creamos un módulo de testing de Nest y proporcionamos el mock en lugar del servicio real
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CotizacionController],
      providers: [
        {
          provide: CotizacionService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    // Obtenemos la instancia del controlador desde el módulo de testing
    controller = module.get<CotizacionController>(CotizacionController);
  });

  it('devuelve {moneda, venta} cuando el service responde', async () => {
    // Caso feliz: el servicio devuelve 1400 → el controller debe responder con la forma esperada
    const res = await controller.getUsdVenta();
    expect(res).toEqual({ moneda: 'USD', venta: 1400 });
  });

  it('lanza InternalServerErrorException cuando el service falla con un error genérico', async () => {
    // Simulamos que el service lanza un Error genérico (no HttpException)
    (serviceMock.getUsdOficialVenta as any) = async () => { throw new Error('boom'); };

    // El controller debe captar el error, registrar y lanzar InternalServerErrorException
    await expect(controller.getUsdVenta()).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('deja pasar HttpException (ej. NotFoundException) tal cual', async () => {
    // Simulamos que el service lanza una NotFoundException (subclase de HttpException)
    (serviceMock.getUsdOficialVenta as any) = async () => { throw new NotFoundException('No existe'); };

    // El controller debe reenviar esa excepción sin envolverla, por lo que la expectativa es NotFoundException
    await expect(controller.getUsdVenta()).rejects.toBeInstanceOf(NotFoundException);
  });
});