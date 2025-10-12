import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { RolModule } from './rol/rol.module';
import { MonedaModule } from './moneda/moneda.module';
import { entities } from './entities';
import { EmpleadoModule } from './empleado/empleado.module';
import { PermissionModule } from './permissions/permission.module';
import { TipoMonedaModule } from './tipoMoneda/tipoMoneda.module';
import { TipoProductoModule } from './tipoProducto/tipoProducto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST') || 'localhost';
        const port = Number(config.get<number>('DB_PORT')) || 5437;
        const username = config.get<string>('DB_USERNAME') || 'postgres';
        const password = config.get<string>('DB_PASSWORD') || 'stockar11';
        const database = config.get<string>('DB_DATABASE') || 'stockar';
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities,
        };
      },
      inject: [ConfigService],
    }), 
    UsuarioModule,
    ProductoModule,
    VentaModule,
    DetalleVentaModule,
    RolModule,
    MonedaModule,
    EmpleadoModule,
    PermissionModule,
    TipoMonedaModule,
    TipoProductoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}