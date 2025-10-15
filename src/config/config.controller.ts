import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private cfg: ConfigService) {}

  @Get('ganancia')
  async get() {
    return { value: await this.cfg.get() };
  }

  @Put('ganancia')
  async set(@Body() body: { value: number }) {
    return { value: await this.cfg.set('ganancia_default', Number(body.value)) };
  }
}