import { Controller, Get, InternalServerErrorException, HttpException, Logger } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';

@Controller('cotizacion')
export class CotizacionController {
  private readonly logger = new Logger(CotizacionController.name);

  constructor(private readonly cotizacionService: CotizacionService) {}

  @Get('usd')
  async getUsdVenta(): Promise<{ moneda: 'USD'; venta: number }> {
    try {
      const venta = await this.cotizacionService.getUsdOficialVenta();
      return { moneda: 'USD', venta };
    } catch (err) {
      // Permitir que las HttpExceptions (NotFoundException, BadRequest...) pasen tal cual
      if (err instanceof HttpException) throw err;

      // Log más info útil para depuración
      this.logger.error('Error al obtener cotización USD', err as any);
      throw new InternalServerErrorException('No se pudo obtener la cotización. Intente más tarde.');
    }
  }
}