/**
 * Test de integración para CotizacionService (llamada a la API real).
 *
 * Propósito:
 * - Verificar que la integración con la API externa (dolarapi) funciona en condiciones reales.
 * - Validar que el servicio puede obtener y parsear la cotización oficial y devolver un número válido.
 *
 * Consideraciones:
 * - Este test es frágil (depende de red, disponibilidad de la API y límites de uso). Por eso lleva
 *   un "gate" para ejecutarse sólo cuando la variable de entorno RUN_EXTERNAL_INTEGRATION esté activada.
 * - No se testea un valor exacto (la cotización varía), solo que la forma y el rango sean correctos.
 * - Timeout aumentado para evitar falsos negativos por latencia.
 */

import { CotizacionService } from '../cotizacion.service';

jest.setTimeout(10000); // 10 segundos de timeout para la llamada externa

describe('CotizacionService (integration)', () => {
  it('llama a la API real y obtiene un numero > 0', async () => {
    // Gate: evita que el test corra por defecto (p. ej. en CI)
    // Activa la prueba manualmente con:
    //   PowerShell: $env:RUN_EXTERNAL_INTEGRATION=1; npm run test -- src/moneda/tests/cotizacion.int.spec.ts
    //   CMD: set RUN_EXTERNAL_INTEGRATION=1 && npm run test -- src\moneda\tests\cotizacion.int.spec.ts
    if (!process.env.RUN_EXTERNAL_INTEGRATION) {
      console.log('Skipping external integration test. Set RUN_EXTERNAL_INTEGRATION=1 to enable.');
      return;
    }

    // Arrange: crear instancia real del servicio (sin mocks) para probar integración real
    const svc = new CotizacionService();

    // Act: llamada real a la API (puede tardar)
    const venta = await svc.getUsdOficialVenta();

    // Assert: validaciones robustas
    // - Tipo número
    // - Es finito
    // - Es mayor que 0 (sanity check)
    expect(typeof venta).toBe('number');
    expect(Number.isFinite(venta)).toBe(true);
    expect(venta).toBeGreaterThan(0);
  });
});