import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { RolModule } from './rol/rol.module';
import { MonedaModule } from './moneda/moneda.module';
import { entities } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'stockar11',
      database: 'stockar',
      entities,
      synchronize: true,
    }), 
    UsuarioModule,
    ProductoModule,
    VentaModule,
    DetalleVentaModule,
    RolModule,
    MonedaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}