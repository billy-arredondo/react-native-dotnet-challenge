# Task Management Challenge

Repositorio base para un desafío técnico de gestión de tareas.

Este repositorio implementa un desafío técnico de gestión de tareas. La fase actual cubre el backend y la base de datos; el proyecto mobile se implementará después de integrar esta fase en `main`.

## Tecnología

- React Native CLI con TypeScript
- .NET 10 Web API
- SQL Server
- REST API
- Stored procedures
- Principios de Clean Architecture
- CQRS con MediatR
- Dapper
- Testcontainers para pruebas de integración

## Estructura

```text
src/api/        Microservicio REST .NET (Arpasoft.TaskManagement.slnx)
src/mobile/     Proyecto React Native futuro
database/       Esquema, seed y stored procedures SQL Server
docs/           Documentación del proyecto
```

## Alcance

La aplicación permite listar tareas, filtrarlas por estado y prioridad, paginarlas y consultar su detalle. No se contemplan autenticación, multiusuario, CRUD completo, despliegue ni CI/CD.

Endpoints previstos:

```text
GET /tasks?page=1&pageSize=20&status=Todo,InProgress&priority=High,Critical
GET /tasks/{id}
GET /health
```

## Prerrequisitos

Para el backend se requiere el SDK de .NET 10. Para ejecutar las pruebas de integración se requiere Docker Engine activo.

## Configuración

Restaurar, compilar y ejecutar las pruebas desde la raíz del repositorio:

```text
dotnet restore src/api/Arpasoft.TaskManagement.slnx
dotnet build src/api/Arpasoft.TaskManagement.slnx
dotnet test src/api/Arpasoft.TaskManagement.slnx
```

Las pruebas de Infrastructure crean automáticamente un container SQL Server, ejecutan los scripts de `database/` y lo eliminan al finalizar.

## Decisiones arquitectónicas

Las decisiones iniciales están documentadas en [`docs/architecture.md`](docs/architecture.md).

El orden de implementación está documentado en [`docs/implementation-plan.md`](docs/implementation-plan.md).

El enunciado original se conserva en [`docs/technical-challenge.md`](docs/technical-challenge.md).

Este repositorio es un technical challenge y su implementación se realizará de forma incremental.
