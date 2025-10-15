import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from '../entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(@InjectRepository(AppConfig) private repo: Repository<AppConfig>) {}

  async get(key = 'ganancia_default'): Promise<number> {
    const row = await this.repo.findOne({ where: { key } });
    return row ? Number(row.value) : 0;
  }

  async set(key = 'ganancia_default', value: number): Promise<number> {
    let row = await this.repo.findOne({ where: { key } });
    if (!row) row = this.repo.create({ key, value });
    else row.value = value;
    row.updatedAt = new Date();
    await this.repo.save(row);
    return Number(row.value);
  }
}