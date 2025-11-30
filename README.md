# Gym Management API

Esta API RESTful gestiona un gimnasio con usuarios, membresías, pagos, clases, reservas y reportes. Está desarrollada en **Node.js** con **Express** y persiste datos en **MongoDB** usando **Mongoose**. Implementa autenticación mediante **JWT**, roles y permisos, validación de entradas, lógica de negocio y agregaciones de datos.

## Características

- **Usuarios y roles**: registro y login, roles `client`, `instructor`, `admin`.
- **Membresías**: alta de membresías por tipo (mensual, anual, premium), cálculo automático de fecha de vencimiento, estado activo/inactivo.
- **Pagos**: registro de pagos, método de pago, relación con membresías, activación automática de membresías.
- **Clases**: alta de clases con instructor asignado, cupo máximo y horarios semanales.
- **Reservas**: reserva de clases con reglas de negocio (cupos, membresía vigente, sin duplicados) y cancelación.
- **Reportes**: ocupación de clases, estadísticas de membresías, clases más reservadas e ingresos mensuales.
- **Seguridad**: autenticación JWT, middleware de autorización por rol, validación de datos con `express-validator`, manejo centralizado de errores.
- **Estructura modular**: rutas, controladores, servicios, modelos y middlewares claramente separados.
- **Contenedores**: incluye un ejemplo de `Dockerfile` y `docker-compose.yml` para ejecutar la API y la base de datos.

## Instalación

1. Clona el repositorio y entra en la carpeta `gym-api`.
2. Crea un archivo `.env` copiando de `.env.example` y ajusta tus variables (sobre todo `MONGO_URI` y `JWT_SECRET`).
3. Instala dependencias con npm:

    npm install

4. Inicia la aplicación en modo desarrollo con nodemon:

    npm run dev

   O en modo producción:

    npm start

La API escuchará en el puerto configurado en `.env` (por defecto 3000).

## Uso básico

### Autenticación

- **Registro**: `POST /api/v1/auth/register` con `name`, `email`, `password` y (opcional) `role`.
- **Login**: `POST /api/v1/auth/login` con `email` y `password`. Devuelve un token JWT que debe incluirse en el header `Authorization: Bearer <token>` para las rutas protegidas.

### Usuarios

Solo el administrador puede listar y modificar usuarios.

- `GET /api/v1/users` – Lista todos los usuarios.
- `GET /api/v1/users/:id` – Devuelve un usuario por ID.
- `PUT /api/v1/users/:id` – Actualiza nombre, email, rol o estado.

### Membresías

Rutas disponibles para el administrador:

- `POST /api/v1/memberships` – Crea una membresía. Requiere `userId`, `type`, `price` y opcional `startDate`.
- `GET /api/v1/memberships` – Lista todas las membresías.
- `GET /api/v1/memberships/user/:userId` – Lista membresías de un usuario.
- `PATCH /api/v1/memberships/:id/status` – Cambia el estado activo/inactivo.

### Pagos

Rutas para el administrador:

- `POST /api/v1/payments` – Registra un pago. Requiere `userId`, `membershipId`, `amount`, `method` y (opcional) `status`.
- `GET /api/v1/payments` – Lista todos los pagos.
- `GET /api/v1/payments/user/:userId` – Lista pagos de un usuario (admin u owner).

### Clases

- `POST /api/v1/classes` – Crear clase (admin).
- `GET /api/v1/classes` – Lista todas las clases (público).
- `GET /api/v1/classes/:id` – Devuelve clase por ID (público).
- `PUT /api/v1/classes/:id` – Modifica clase (admin).

### Reservas

Reservas de clases por parte del cliente:

- `POST /api/v1/bookings` – Reserva una clase. Requiere `classId` y `date` (ISO8601).
- `DELETE /api/v1/bookings/:id` – Cancela la reserva.
- `GET /api/v1/bookings/user/:userId` – Lista reservas del usuario (admin u owner).
- `GET /api/v1/bookings/class/:classId` – Lista reservas por clase (admin).

### Reportes

Solo administrador:

- `GET /api/v1/reports/occupancy` – Devuelve ocupación de clases (reservas por clase y fecha vs. cupo).
- `GET /api/v1/reports/membership-stats` – Estadísticas de membresías activas/inactivas por tipo.
- `GET /api/v1/reports/top-classes?limit=5` – Clases con más reservas.
- `GET /api/v1/reports/revenue` – Ingresos mensuales.

## Contenedores y Docker

Se incluyen archivos `Dockerfile` y `docker-compose.yml` para levantar la aplicación y una instancia de MongoDB en contenedores. Requiere tener Docker y docker-compose instalados. Para levantar los servicios en background:

    docker-compose up -d

Esto creará dos servicios: `api` (Puerto 3000) y `mongo` (Puerto 27017).

## Contribuciones y mejoras

Puedes extender la API añadiendo gestión de rutinas, check-in de acceso, lista de espera, roles de instructor en reservas y más reportes. Para cualquier duda o mejora, abre un issue o realiza un pull request.# Api-GYM
