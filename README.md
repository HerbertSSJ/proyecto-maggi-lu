# Intranet MIMImarket - Evaluación Sumativa 3

Proyecto de intranet para el minimarket "MIMImarket", desarrollado como parte de la Evaluación Sumativa 3

## Contexto
Este proyecto es una migración de un proyecto anterior (HTML + CSS + JS) a **Next.js (App Router) + React + TypeScript**.
En esta entrega, los datos se persisten íntegramente utilizando `localStorage` en el navegador del cliente. (El uso de Firebase está programada para la siguiente evaluación).

### Funcionalidades Implementadas
1. **Autenticación (Login/Logout):** Sistema de sesión con validación de credenciales estáticas y persistencia en localStorage. Las rutas están protegidas mediante guards (`useEffect`).
2. **Módulo de Inventario (CRUD Completo):** Permite Crear, Leer (Listar), Actualizar (Editar) y Eliminar productos. Incluye búsqueda en tiempo real y vista de detalle dinámico por ID (`/inventario/[id]`).
3. **Módulo de Caja/Ventas:** Carrito de compras que permite agregar productos, seleccionar método de pago y emitir una boleta.
4. **Módulo de Historial de Ventas:** Lista de boletas emitidas, con capacidad de ver detalles (`/historial/[id]`), editar la información de la boleta y eliminarla.
5. **Módulo de Fiados:** Lista de deudores, permite visualizar el total de la deuda y registrar pagos.

### Funcionalidades NO Implementadas en esta entrega
- Conexión a base de datos real (Backend / Firebase). Toda la persistencia es vía localStorage.
- Descuento automático de stock en inventario al finalizar una venta. (Se coordinará su desarrollo posteriormente).


### Flujo de datos completo
1. El usuario inicia sesión en la página de inicio.
2. Navega al módulo de **Inventario**.
3. Registra un nuevo producto (ej. "Bebida Cola 2L", Precio: 2000, Cantidad: 10).
4. El producto queda visible en el listado de inventario.
5. El usuario puede hacer clic en "Ver detalle" para entrar a la ruta dinámica del producto.
6. El usuario puede buscar el producto en la barra de búsqueda y filtrarlo.
7. Al recargar la página, el producto se mantiene en el listado gracias a `localStorage`.


## Estructura del Proyecto
- `src/app/`: Rutas de la aplicación (App Router).
- `src/components/`: Componentes reutilizables de React (ej. formularios y tablas).
- `src/context/`: Contexto de autenticación (`AuthContext.tsx`).
- `src/types/`: Definiciones de interfaces TypeScript (`Producto`, `Boleta`, `Fiado`).
- `src/utils/`: Lógica de persistencia y acceso a `localStorage`.


## Uso de LocalStorage
La aplicación utiliza las siguientes claves en el `localStorage` del navegador para persistir los datos:
- `usuarioMimi`: Guarda la sesión del usuario actual (nombre).
- `inventarioMimi`: Array con los objetos del inventario (productos).
- `boletasMimi`: Array con el historial de ventas realizadas.
- `boletasContador`: Secuencia para generar el ID autoincremental de las boletas.
- `listaDeudores`: Array con los clientes que tienen deuda pendiente (fiados).


## Instrucciones de Ejecución Local

### Prerrequisitos
- Node.js instalado (v18 o superior).

### Pasos
1. Clonar este repositorio.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la dirección: [http://localhost:3000](http://localhost:3000)

### Usuarios de Prueba
Para iniciar sesión, utilice cualquiera de las siguientes credenciales de prueba preconfiguradas:

- **Usuario:** `Ignacio` / **Clave:** `123456`
- **Usuario:** `Herbert` / **Clave:** `654321`

