import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';

@Controller('cotizacion')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Get('usd')
  async getUsdVenta() {
    try {
      const venta = await this.cotizacionService.getUsdOficialVenta();
      return { moneda: 'USD', venta };
    } catch (err) {
      // No exponer detalles internos. Devolver un error controlado.
      throw new InternalServerErrorException('No se pudo obtener la cotización. Intente más tarde.');
    }
  }
}