# Architecture

La solución seguirá principios de Clean Architecture, manteniendo separadas las responsabilidades del dominio, la aplicación, la infraestructura y el punto de entrada HTTP.

## Flujo de comunicación

```text
React Native App
      ↓ HTTP/JSON
.NET REST API
      ↓
Application
      ↓
Infrastructure
      ↓
SQL Server / Stored Procedures
```

La aplicación mobile consumirá únicamente la API REST. La API coordinará los casos de uso de Application; Infrastructure será la única capa responsable de acceder a SQL Server.

## Capas del backend

- **Domain**: entidades y reglas de negocio independientes de frameworks y persistencia.
- **Application**: casos de uso, DTOs y abstracciones requeridas por la aplicación. Solo depende de Domain.
- **Infrastructure**: acceso a SQL Server mediante Dapper y procedimientos almacenados. Depende de Application y Domain.
- **Api**: HTTP, configuración, inyección de dependencias, OpenAPI y controladores. Depende de Application e Infrastructure.

## Decisiones iniciales

- Se utilizará .NET 10 Web API.
- La solución backend vive en `src/api/` y usa el formato `.slnx`.
- Los proyectos usan el prefijo `Arpasoft.TaskManagement`.
- Se utilizará SQL Server con procedimientos almacenados.
- Se utilizará Dapper en lugar de Entity Framework porque el requisito del reto pide procedimientos almacenados y el alcance de persistencia es pequeño.
- No se incorporarán CQRS, MediatR, Redux ni un UI Kit sin una necesidad demostrada.
- No se implementarán autenticación, CRUD completo, multiusuario, despliegue ni CI/CD.
- Las funcionalidades se limitarán a listar, filtrar y consultar el detalle de tareas.

## Estructura prevista

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
└── mobile/
```

Cada capa del backend (`Domain`, `Application`, `Infrastructure` y `Api`) tiene su propio proyecto de tests.
