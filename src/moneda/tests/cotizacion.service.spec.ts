import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CotizacionService } from '../cotizacion.service';
import axios from 'axios';


// Mock completo de axios para aislar las pruebas de dependencias externas
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * Suite de pruebas unitarias para CotizacionService
 * 
 * Estas pruebas verifican el comportamiento del servicio que obtiene cotizaciones
 * del dólar oficial desde una API externa, incluyendo:
 * - Parsing correcto de números con formato argentino
 * - Manejo de errores de red con valores fallback
 * - Funcionamiento del sistema de cache
 */
describe('CotizacionService - Unit Test|s', () => {
  let service: CotizacionService;

  /**
   * Configuración que se ejecuta antes de cada test individual
   * 
   * - Crea un módulo de testing aislado con el CotizacionService
   * - Limpia todos los mocks para evitar interferencias entre tests
   * - Resetea el cache interno del servicio a estado inicial (vacío)
   */
  beforeEach(async () => {
    // Crear módulo de testing de NestJS con el servicio aislado
    const module: TestingModule = await Test.createTestingModule({
      providers: [CotizacionService],
    }).compile();

    // Obtener instancia del servicio del contenedor de inyección de dependencias
    service = module.get<CotizacionService>(CotizacionService);
    
    // Limpiar todos los mocks de Jest para evitar state compartido entre tests
    jest.clearAllMocks();
    
    // Resetear el cache interno del servicio para que cada test empiece limpio
    // El cache tiene la estructura: { value: number, ts: timestamp }
    (service as any).cache = { value: 0, ts: 0 };
  });

  /**
   * GRUPO DE TESTS: Funcionalidad parseNumber
   * 
   * Estos tests verifican que el método parseNumber del servicio convierte correctamente
   * los diferentes formatos de números que puede devolver la API argentina:
   * - Strings con coma como separador decimal ("1.025,50")
   * - Strings con punto como separador de miles ("1.385,75") 
   * - Números directos sin formatear (1400.25)
   * 
   * Es crucial porque la API puede devolver precios en formato string argentino
   * y necesitamos convertirlos a numbers para hacer cálculos matemáticos.
   */
  describe('parseNumber functionality', () => {
    
    /**
     * TEST: Conversión de string con coma decimal (formato argentino típico)
     * 
     * Verifica que "1.025,50" se convierte correctamente a 1025.50
     * Este es el formato más común que devuelve la API argentina.
     */
    it('should correctly parse string numbers with comma decimal separator', async () => {
      // ARRANGE: Preparar mock de respuesta de API con precio como string con coma
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: '1.025,50', // ← String con formato argentino: punto=miles, coma=decimal
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      // Configurar axios mock para devolver esta respuesta cuando se llame
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // ACT: Ejecutar el método que queremos testear
      const result = await service.getUsdOficialVenta();

      // ASSERT: Verificar que el resultado es correcto
      expect(result).toBe(1025.50); // Debe convertir "1.025,50" → 1025.50
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Verificar que se hizo 1 llamada HTTP
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://dolarapi.com/v1/dolares',
        { timeout: 5000 }
      ); // Verificar que se llamó con los parámetros correctos
    });

    /**
     * TEST: Conversión de string con separador de miles
     * 
     * Verifica que "1.385,75" se convierte correctamente a 1385.75
     * Prueba el caso donde hay punto como separador de miles y coma como decimal.
     */
    it('should correctly parse string numbers with dot thousands separator', async () => {
      // ARRANGE: Mock con formato que incluye separador de miles
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: '1.385,75', // ← String con miles: "1.385,75" → 1385.75
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // ACT: Llamar al servicio
      const result = await service.getUsdOficialVenta();

      // ASSERT: Debe parsear correctamente removiendo el punto de miles
      expect(result).toBe(1385.75);
    });

    /**
     * TEST: Manejo de valores numéricos directos
     * 
     * Verifica que cuando la API devuelve un número directo (no string),
     * el servicio lo maneja correctamente sin intentar parsearlo.
     */
    it('should handle numeric values correctly', async () => {
      // ARRANGE: Mock con valor numérico directo (no string)
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: 1400.25, // ← Número directo, no string
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // ACT: Llamar al servicio
      const result = await service.getUsdOficialVenta();

      // ASSERT: Debe devolver el número tal como está
      expect(result).toBe(1400.25);
    });
  });

  /**
   * GRUPO DE TESTS: Manejo de fallos de red
   * 
   * Estos tests verifican que el servicio maneja correctamente los errores
   * que pueden ocurrir al llamar a la API externa:
   * - Fallos de conexión → devuelve valor fallback
   * - API devuelve array vacío → lanza NotFoundException
   * - No encuentra dólar oficial → lanza NotFoundException
   * - Valor de venta inválido → lanza NotFoundException
   * 
   * Es fundamental para garantizar que la app sea resiliente ante fallos externos.
   */
  describe('network failure handling', () => {
    
    /**
     * TEST: Fallo de red devuelve valor fallback
     * 
     * Verifica que cuando axios falla (timeout, conexión, etc.),
     * el servicio devuelve un valor hardcodeado de fallback (1385)
     * en lugar de crashear la aplicación.
     */
    it('should return fallback value when API call fails', async () => {
      // ARRANGE: Configurar axios para que falle con error de red
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      // Spy para verificar que se loguea el warning del fallback
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // ACT: Llamar al servicio que debería fallar
      const result = await service.getUsdOficialVenta();

      // ASSERT: Debe devolver el valor de fallback hardcodeado
      expect(result).toBe(1385); // Valor fallback definido en el servicio
      expect(consoleSpy).toHaveBeenCalledWith('Error al llamar la API, usando valor local de fallback');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Intentó hacer la llamada

      // Cleanup: Restaurar console.warn
      consoleSpy.mockRestore();
    });

    /**
     * TEST: API devuelve array vacío → excepción
     * 
     * Verifica que cuando la API responde exitosamente pero con array vacío,
     * se lanza NotFoundException (no se usa fallback porque la API funcionó).
     */
    it('should return fallback value when API returns empty array', async () => {
      // ARRANGE: Mock de respuesta exitosa pero vacía
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // ACT & ASSERT: Debe lanzar excepción específica
      await expect(service.getUsdOficialVenta()).rejects.toThrow('No se encontró el dólar oficial en la API');
    });

    /**
     * TEST: No encuentra dólar oficial → excepción
     * 
     * Verifica que cuando la API devuelve datos pero no incluye 'casa: oficial',
     * se lanza NotFoundException.
     */
    it('should throw NotFoundException when oficial dollar is not found', async () => {
      // ARRANGE: Mock con otros tipos de dólar pero sin oficial
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'blue', // ← Solo blue, no oficial
            nombre: 'Dólar Blue',
            compra: 1200,
            venta: 1220,
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

  // ACT & ASSERT: Debe lanzar excepción
  await expect(service.getUsdOficialVenta()).rejects.toThrow('No se encontró el dólar oficial en la API');
    });

    /**
     * TEST: Valor de venta inválido → excepción
     * 
     * Verifica que cuando el valor 'venta' no se puede parsear a número,
     * se lanza NotFoundException.
     */
    it('should throw NotFoundException when venta value is invalid', async () => {
      // ARRANGE: Mock con valor de venta que no se puede convertir a número
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: 'invalid_number', // ← Valor que parseNumber no puede convertir
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

  // ACT & ASSERT: Debe lanzar excepción por valor inválido
  await expect(service.getUsdOficialVenta()).rejects.toThrow('Valor de cotización inválido');
    });
  });

  /**
   * GRUPO DE TESTS: Funcionalidad de cache
   * 
   * Estos tests verifican que el sistema de cache funciona correctamente:
   * - Cache activo → segunda llamada no genera HTTP request
   * - Cache expirado → nueva llamada genera HTTP request 
   * - Valores fallback → NO se almacenan en cache
   * 
   * El cache es crucial para performance (evita llamadas repetidas a API externa)
   * y está configurado con TTL de 60 segundos.
   */
  describe('caching functionality', () => {
    
    /**
     * TEST: Cache previene segunda llamada HTTP
     * 
     * Verifica que dos llamadas consecutivas al servicio dentro del TTL (60s)
     * resultan en solo 1 llamada HTTP, porque la segunda usa el valor cacheado.
     */
    it('should cache results and not make second API call within TTL', async () => {
      // ARRANGE: Mock de respuesta de API para la primera llamada
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: 1025.50,
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // ACT: Hacer dos llamadas consecutivas (dentro del TTL de 60s)
      const firstResult = await service.getUsdOficialVenta();   // Primera llamada → API
      const secondResult = await service.getUsdOficialVenta();  // Segunda llamada → Cache

      // ASSERT: Ambos resultados iguales, pero solo 1 llamada HTTP
      expect(firstResult).toBe(1025.50);
      expect(secondResult).toBe(1025.50);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // ← Clave: solo 1 llamada HTTP
    });

    /**
     * TEST: Cache expira después del TTL
     * 
     * Verifica que después de que expira el TTL (60 segundos),
     * una nueva llamada genera una segunda petición HTTP.
     * Simula el paso del tiempo manipulando el timestamp del cache.
     */
    it('should make new API call after cache TTL expires', async () => {
      // ARRANGE: Preparar dos respuestas diferentes para simular cambio de precio
      const firstMockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: 1025.50, // Primer precio
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };
      
      const secondMockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 990,
            venta: 1030.75, // Precio actualizado
            fechaActualizacion: '2025-10-22T10:01:00Z'
          }
        ]
      };

      // Configurar mocks para devolver respuestas diferentes en cada llamada
      mockedAxios.get
        .mockResolvedValueOnce(firstMockResponse)
        .mockResolvedValueOnce(secondMockResponse);

      // ACT: Primera llamada
      const firstResult = await service.getUsdOficialVenta();

      // Simular que pasa el tiempo (TTL = 60 segundos)
      // Manipular directamente el timestamp del cache para simular expiración
      const cache = (service as any).cache;
      cache.ts = Date.now() - 61000; // Hacer que el cache tenga 61 segundos de antigüedad

      // ACT: Segunda llamada después del TTL expirado
      const secondResult = await service.getUsdOficialVenta();

      // ASSERT: Debe haber dos llamadas HTTP con resultados diferentes
      expect(firstResult).toBe(1025.50);  // Primer precio
      expect(secondResult).toBe(1030.75); // Precio actualizado
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // ← Dos llamadas HTTP
    });

    /**
     * TEST: Valores fallback no se cachean
     * 
     * Verifica que cuando se devuelve un valor fallback por error de red,
     * ese valor NO se almacena en cache. La siguiente llamada debe intentar
     * la API nuevamente en lugar de usar el fallback cacheado.
     */
    it('should not cache fallback values from network errors', async () => {
      // ARRANGE: Primera llamada falla, segunda es exitosa
      const mockResponse = {
        data: [
          {
            moneda: 'USD',
            casa: 'oficial',
            nombre: 'Dólar Oficial',
            compra: 985,
            venta: 1025.50,
            fechaActualizacion: '2025-10-22T10:00:00Z'
          }
        ]
      };

      // Configurar axios para fallar primero, luego exitoso
      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network Error')) // Primera llamada falla
        .mockResolvedValueOnce(mockResponse);              // Segunda llamada exitosa

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // ACT: Primera llamada (falla y devuelve fallback)
      const firstResult = await service.getUsdOficialVenta();

      // ACT: Segunda llamada inmediata (debe intentar la API de nuevo, no usar cache)
      const secondResult = await service.getUsdOficialVenta();

      // ASSERT: Fallback no se cachea, segunda llamada va a la API
      expect(firstResult).toBe(1385);      // Valor fallback hardcodeado
      expect(secondResult).toBe(1025.50);  // Valor real de la API
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // ← Dos intentos de llamada

      consoleSpy.mockRestore();
    });
  });
});