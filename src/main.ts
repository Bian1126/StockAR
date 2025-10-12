import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: false, //true lanza error si vienen props extras
      transform: true, // transforma payloads a DTOs (e.g., string -> number)
    }),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Server is running on ${port}`);
}
bootstrap();