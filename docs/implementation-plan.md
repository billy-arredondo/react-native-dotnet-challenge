# Implementation Plan

Esta fase cubre exclusivamente backend y base de datos. La aplicación mobile se implementará después de validar e integrar esta fase en `main`.

## 1. Contrato y documentación

- Modelar `TaskItem` con `Guid`, título, descripción, prioridad, estado y `CreatedAt` UTC.
- Usar `Low`, `Medium`, `High`, `Critical` para prioridad.
- Usar `Todo`, `InProgress`, `Done` para estado.
- Implementar filtros múltiples separados por comas.
- Implementar `page=1`, `pageSize=20`, con máximo de `100`.
- Ordenar por prioridad, fecha de creación y `Id`.
- Usar `ProblemDetails` para errores HTTP.

## 2. Proyectos de tests

Crear y agregar a `Arpasoft.TaskManagement.slnx` cuatro proyectos xUnit:

```text
Arpasoft.TaskManagement.Domain.Tests
Arpasoft.TaskManagement.Application.Tests
Arpasoft.TaskManagement.Infrastructure.Tests
Arpasoft.TaskManagement.Api.Tests
```

Cada proyecto verificará su capa sin saltarse los límites de Clean Architecture.

## 3. Domain

- Crear `TaskItem`, `TaskPriority` y `TaskItemStatus`.
- Validar identificador, título, descripción, enums y fecha UTC.
- Agregar pruebas unitarias para las invariantes.
- Mantener Domain independiente de MediatR, HTTP y SQL Server.

## 4. Application con CQRS/MediatR

- Crear `GetTasksQuery` y `GetTasksQueryHandler`.
- Crear `GetTaskByIdQuery` y `GetTaskByIdQueryHandler`.
- Crear DTOs, resultado paginado e interfaz de lectura.
- Validar filtros y paginación en Application.
- Propagar `CancellationToken`.
- Probar handlers con repositorios simulados.

## 5. Database

Crear scripts en `database/` para:

- Esquema de tareas y restricciones.
- Seed reproducible.
- Stored procedure de listado, filtros, paginación y conteo.
- Stored procedure de detalle.

Usar `uniqueidentifier`, `NEWSEQUENTIALID()` y fechas UTC. Los filtros deben ser parametrizados y no concatenar SQL.

## 6. Infrastructure

- Agregar Dapper y `Microsoft.Data.SqlClient`.
- Implementar la interfaz de lectura con stored procedures.
- Configurar conexiones mediante `IConfiguration`.
- Crear pruebas de integración con `Testcontainers.MsSql`.
- Ejecutar esquema, procedimientos y seed desde la fixture de tests.
- Verificar filtros, orden, paginación, conteo, detalle y mapeo.

Docker Engine debe estar activo para ejecutar las pruebas de integración.

## 7. Api

- Registrar MediatR, Application e Infrastructure en DI.
- Crear `TasksController` usando `ISender`.
- Exponer `GET /tasks` y `GET /tasks/{id}`.
- Configurar serialización de enums como strings.
- Configurar `400 ProblemDetails`, `404 ProblemDetails`, OpenAPI y health check.
- Agregar pruebas del contrato HTTP.

## 8. Validación de backend

```text
dotnet restore src/api/Arpasoft.TaskManagement.slnx
dotnet build src/api/Arpasoft.TaskManagement.slnx
dotnet test src/api/Arpasoft.TaskManagement.slnx
```

Las pruebas de Infrastructure requieren Docker Engine. Si Docker no está disponible, esa limitación debe reportarse explícitamente.

## 9. Cierre de la fase

- Actualizar README con setup de .NET, SQL Server y Docker para tests.
- Documentar decisiones y comandos reproducibles.
- Verificar que no se haya implementado frontend ni funcionalidades fuera del alcance.
- Integrar la fase backend/DB en `main` antes de iniciar mobile.

## 10. Mobile

La implementación mobile consume el backend ya integrado mediante sus contratos REST.

### 10.1 Bootstrap

- Crear la aplicación Expo dentro de `src/mobile/` con React Native y TypeScript.
- Verificar Node.js/npm y Expo Go, o configurar opcionalmente un emulador Android.
- No generar `android/` ni `ios/` mediante `prebuild` mientras no exista una necesidad de código nativo personalizado.
- Configurar Android/iOS y una URL de API por entorno.
- Configurar `EXPO_PUBLIC_API_URL` para Android Emulator, iOS Simulator o dispositivo físico.
- Verificar conectividad con `GET /health` y `GET /tasks`.

### 10.2 Base técnica

- Configurar Expo Router.
- Configurar TanStack Query para el estado remoto.
- Usar Zustand únicamente para los filtros locales de la interfaz; TanStack Query conserva el estado remoto.
- Usar Zod para validar `TaskItemDto` y `PagedResult<TaskItemDto>` en el borde HTTP.
- Añadir `lucide-react-native` para iconos.
- Usar componentes nativos y estilos propios, sin React Native UI Kits.

### 10.3 Features

- Implementar la lista paginada de tareas. **Completado.**
- Implementar filtros por estado y prioridad. **Completado.**
- Implementar navegación al detalle de una tarea. **Completado.**
- Cubrir estados de carga, vacío, error y reintento. **Completado.**
- Mantener el cliente alineado con los contratos de `/tasks` y `/tasks/{id}`. **Completado.**

### 10.4 Validación mobile

- Probar la aplicación en Android y, cuando esté disponible, iOS.
- Verificar navegación, filtros, detalle, errores de red y adaptación a distintos tamaños de pantalla.
- Ejecutar `npm run typecheck`, `npm run lint` y `npm test` desde `src/mobile/`.
- Actualizar README con los comandos de instalación, ejecución y configuración de la API mobile. **Completado.**
