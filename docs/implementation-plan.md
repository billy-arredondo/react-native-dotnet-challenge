# Implementation Plan

Plan incremental para implementar el reto descrito en `docs/technical-challenge.md`.

## 1. Definir el contrato funcional

- Confirmar el modelo mínimo `Task`: título, descripción, prioridad y estado.
- Definir los valores permitidos para prioridad y estado.
- Definir las operaciones necesarias:
  - `GET /tasks`, con filtros opcionales `status` y `priority`.
  - `GET /tasks/{id}`, para consultar el detalle.
- Acordar las respuestas para lista vacía, filtros sin resultados y tarea inexistente.

## 2. Preparar la base de datos

- Crear el script de esquema en `database/`.
- Crear datos iniciales representativos.
- Crear procedimientos almacenados para listar/filtrar y consultar el detalle.
- Documentar cómo ejecutar los scripts en SQL Server.

No se implementará autenticación, multiusuario ni operaciones de creación, edición o eliminación.

## 3. Implementar el backend

- Crear la solución .NET bajo `src/backend/`.
- Mantener las capas Domain, Application, Infrastructure y Api con sus dependencias unidireccionales.
- Implementar el acceso a SQL Server mediante Dapper y procedimientos almacenados.
- Exponer únicamente los endpoints necesarios para listado, filtros y detalle.
- Configurar inyección de dependencias, configuración, OpenAPI y un endpoint de health check.
- Agregar pruebas unitarias para lógica de aplicación significativa.

Validaciones previstas:

```text
dotnet restore
dotnet build
dotnet test
```

## 4. Implementar la aplicación mobile

- Crear la aplicación React Native CLI con TypeScript bajo `src/mobile/`.
- Mantener una estructura separada para API, componentes, hooks, navegación, pantallas, tema y tipos.
- Implementar la lista de tareas.
- Implementar filtros por estado y prioridad.
- Implementar la vista de detalle.
- Manejar estados de carga, error, lista vacía y ausencia de resultados.
- Mantener la UI propia, sin React Native UI Kits.

Validaciones previstas:

```text
npm ci
npx tsc --noEmit
npm run lint
npm test
```

## 5. Documentar y revisar

- Actualizar `README.md` con prerrequisitos, configuración y ejecución.
- Mantener `docs/architecture.md` actualizado con diagramas y decisiones técnicas.
- Verificar que el flujo completo sea `App -> API -> DB`.
- Revisar que no se hayan añadido funcionalidades fuera del alcance.
- Usar commits pequeños con Conventional Commits.

## Orden recomendado

1. Contrato funcional.
2. Base de datos y procedimientos almacenados.
3. Backend y pruebas.
4. Aplicación mobile.
5. Documentación, revisión y validación final.
