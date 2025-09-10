# Gestion de Stock Backend

Este proyecto es una aplicación backend desarrollada con Nest.js para la gestión de stock de productos. Su objetivo es facilitar a los vendedores la administración de su inventario, permitiendo agregar, modificar, ver y eliminar productos de manera sencilla. Además, el sistema calcula automáticamente el precio final de cada producto, teniendo en cuenta la moneda seleccionada, el IVA y el porcentaje de ganancia.

## Estructura del Proyecto

El proyecto está organizado en módulos, cada uno de los cuales encapsula la lógica relacionada con una entidad específica:

- **Usuario**: Maneja la autenticación y gestión de usuarios.
- **Producto**: Permite la gestión de productos, incluyendo operaciones CRUD y actualizaciones de stock.
- **Venta**: Gestiona las ventas y la generación de comprobantes en formato PDF.
- **DetalleVenta**: Maneja los detalles de cada venta, incluyendo la cantidad y el subtotal.
- **Rol**: Administra los roles de usuario y sus permisos.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la raíz del proyecto:

```
npm install
```

## Ejecución

Para iniciar la aplicación, utiliza el siguiente comando:

```
npm run start
```

La aplicación escuchará por defecto en el puerto 3000. Puedes acceder a la API en `http://localhost:3000`.

## Pruebas

El proyecto incluye pruebas unitarias y de integración. Para ejecutar las pruebas, utiliza el siguiente comando:

```
npm run test
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request en el repositorio.

## Licencia

Este proyecto está bajo la Licencia MIT.