# Architecture

Esta fase implementa únicamente el backend y la base de datos. El backend será un único microservicio REST desplegable como una aplicación ASP.NET Core Web API; no se crearán varios microservicios para este reto.

## Flujo de comunicación

```text
React Native App (fase posterior)
      ↓ HTTP/JSON
Arpasoft.TaskManagement.Api
      ↓ ISender
Application (CQRS/MediatR)
      ↓ interfaces
Infrastructure
      ↓ Dapper / Stored Procedures
SQL Server
```

La aplicación mobile consumirá únicamente la API REST. La API coordinará los casos de uso de Application; Infrastructure será la única capa responsable de acceder a SQL Server.

## Capas del backend

- **Domain**: entidad `TaskItem`, valores controlados y reglas de negocio independientes de frameworks y persistencia.
- **Application**: queries, handlers MediatR, DTOs, paginación e interfaces de lectura. Solo depende de Domain y MediatR.
- **Infrastructure**: implementación de interfaces de Application, conexiones SQL y ejecución de stored procedures mediante Dapper.
- **Api**: HTTP, configuración, inyección de dependencias, OpenAPI, health check y controllers delgados.

## CQRS

El alcance actual es de solo lectura, por lo que se implementan queries sin comandos:

- `GetTasksQuery`: filtra y pagina tareas.
- `GetTaskByIdQuery`: obtiene el detalle de una tarea.

No se incorporan bases de datos separadas, event sourcing, buses de eventos ni abstracciones de CQRS adicionales.

## Contrato funcional

```text
Id: Guid
Title: obligatorio
Description: obligatoria
Priority: Low | Medium | High | Critical
Status: Todo | InProgress | Done
CreatedAt: UTC
```

Los estados y prioridades se serializan como strings sin espacios. Los filtros aceptan varios valores separados por comas.

```http
GET /tasks?page=1&pageSize=20&status=Todo,InProgress&priority=High,Critical
GET /tasks/{id}
```

El listado usa `page=1`, `pageSize=20`, un máximo de `pageSize=100` y orden `Priority DESC, CreatedAt DESC, Id ASC`. La respuesta incluye `items`, `page`, `pageSize`, `totalItems` y `totalPages`.

Los parámetros inválidos producen `400 ProblemDetails`, una tarea inexistente produce `404 ProblemDetails` y un listado sin resultados produce `200` con `items` vacío.

## Decisiones técnicas

- Se utiliza .NET 10 Web API en `src/api/` con el formato `.slnx`.
- Los proyectos usan el prefijo `Arpasoft.TaskManagement`.
- Se utiliza SQL Server con stored procedures.
- Se utiliza Dapper en lugar de Entity Framework.
- Se utiliza MediatR para separar queries y handlers, sin crear comandos que el reto no necesita.
- Los `Guid` se generan en SQL Server con `NEWSEQUENTIALID()` para futuros inserts; el seed usará valores explícitos y reproducibles.
- Las pruebas de integración de Infrastructure usarán Testcontainers para iniciar SQL Server automáticamente cuando Docker Engine esté disponible.
- No se implementan autenticación, multiusuario, CRUD completo, despliegue ni CI/CD en esta fase.
- La futura evolución multiusuario podrá incorporar `OwnerId` sin introducirlo prematuramente en el alcance actual.

## Estructura

```text
src/
├── api/
│   ├── Arpasoft.TaskManagement.slnx
│   ├── Arpasoft.TaskManagement.Domain/
│   ├── Arpasoft.TaskManagement.Application/
│   ├── Arpasoft.TaskManagement.Infrastructure/
│   ├── Arpasoft.TaskManagement.Api/
│   ├── Arpasoft.TaskManagement.Domain.Tests/
│   ├── Arpasoft.TaskManagement.Application.Tests/
│   ├── Arpasoft.TaskManagement.Infrastructure.Tests/
│   └── Arpasoft.TaskManagement.Api.Tests/
└── mobile/ (fase posterior)
```
